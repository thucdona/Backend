const { request, response } = require("express");
const itemModel = require('../models/item.model');
const Auth = require('../../src/middlewares/auth/auth.mid');
const logs = require('../../src/middlewares/logs/server.log');
const Create = require('../../src/middlewares/create');
const Func = require('../../src/middlewares/functions');
const catalogModel = require('../models/catalog.model');
const manufactorModel = require('../models/manufactor.model');
const Variable = require('../../src/middlewares/variables');
const mysql = require('mysql');
const { json } = require("body-parser");
//Tạo mới sản phẩm
const createProduct = async (req = request, res = response) => {
    //đây là hàm thêm mẫu sản phẩm vào kho, nó không có tác dụng thêm sản phẩm mới vào các khi, nó chỉ thêm phôi sản phẩm nên chỉ cần part và thông tin của sản phẩm => trạng thái sẽ là demo
    try {
        //đọc dữ liệu gửi lên
        var { pt_name, pt_namesub, pt_part, pt_serial, pt_detail, cat_uuid, pt_note, pt_image, man_uuid } = req.body;
        //lấy key trong header
        const accessTokenFromHeader = req.headers.x_authorization;
        //Kiểm tra xem người dùng đăng nhập hay chưa
        const isAuth = await Auth.isAuth(accessTokenFromHeader, "create_item");
        if (isAuth.err === true) {
            return res.status(400).json(isAuth)
        }
        const user_uuid = isAuth.data.data[0].user_key
        //kiểm tra có dữ liệu nào bị bỏ trống hay không
        const requiredFields = ['pt_name', 'pt_namesub', 'pt_part', 'pt_serial', 'pt_detail', 'cat_uuid', 'pt_note', 'pt_image', 'man_uuid'];
        const missingFields = [];
        requiredFields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });
        if (missingFields.length > 0) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng không để trống dữ liệu",
                data: missingFields.join(', ')
            });
        }
        if (!pt_image) {
            pt_image = "noimage"
        }
        //kiểm tra xem có cái nào dài quá hay không
        if (
            Func.isStringTooLong(pt_name, 100) ||
            Func.isStringTooLong(pt_namesub, 100) ||
            Func.isStringTooLong(pt_part, 100) ||
            Func.isStringTooLong(cat_uuid, 100) ||
            Func.isStringTooLong(pt_image, 255) ||
            Func.isStringTooLong(man_uuid, 100)) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng không nhập liệu quá dài",
                data: "error_length"
            });
        }

        //lấy thông tin từ csdl xem đã tồn tại hay chưa
        const ptGetKey = await itemModel.getProduct("pt_part", pt_part);
        if (ptGetKey.data) {
            return res.status(400).json({
                err: true,
                msg: "Đã tồn tại một sản phẩm mẫu tương tự trong CSDL",
                data: "error_unique_part"
            })
        }

        //kiểm tra xem danh mục đã tồn tại hay chưa
        const catalogGetuuid = await catalogModel.getCatalog("cat_uuid", cat_uuid);
        if (!catalogGetuuid.data) {
            return res.status(400).json({
                err: true,
                msg: "Danh mục sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_cat"
            })
        }
        //kiểm tra xem thương hiệu đã tồn tại hay chưa
        const manufactorGetuuid = await manufactorModel.getManufactor("man_uuid", man_uuid);
        if (!manufactorGetuuid.data) {
            return res.status(400).json({
                err: true,
                msg: "Nhãn hàng của sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_man"
            })
        }
        //có 2 loại sản phẩm 1 là duy nhất tức là part giống nhau và Serial khác nhau, mấy món này công thức add cũng khác nhau - nên quy định hàng này là add new tức là thêm mẫu mã cho sản phẩm nên không cần nhập serial, chỉ cần kiểm xem model có tồn tại hay chưa thôi

        //thêm hàng vào csdl
        const createItem = await itemModel.createProduct(pt_name, pt_namesub, pt_part, pt_serial, pt_detail, cat_uuid, pt_note, pt_image, man_uuid )
        if (createItem.err) {
            return res.status(500).json({
                err: true,
                msg: "Có lỗi trong quá trình thêm mới sản phẩm",
                data: createItem.data
            })
        }

        //lấy ngược lại từ CSDL sau đó trả về
        const checkItem = await itemModel.getProduct("pt_part", pt_part);
        if (checkItem.err) {
            return res.status(500).json({
                err: true,
                msg: "Có lỗi trong quá trình thêm mới sản phẩm",
                data: checkItem.data
            })
        }
        logs.writeLogs(user_uuid, 'createProduct', checkItem.data)
        return res.status(200).json({
            err: true,
            msg: "Thêm mới mẫu sản phẩm thành công",
            data: checkItem.data
        })

    } catch (error) {
        logs.writeErrLog('04ait', error)
        console.log(error);
        return res.status(500).json({
            err: true,
            msg: "Có lỗi phía máy chủ",
            data: error
        })
    }
}

const editProduct= async (req = request, res = response) => {
    try {
        //đọc dữ liệu gửi lên
        var { pt_uuid, pt_name, pt_namesub, pt_part, pt_detail, cat_uuid, pt_note, pt_image, man_uuid } = req.body;
        //lấy key trong header
        const accessTokenFromHeader = req.headers.x_authorization;
        const isAuth = await Auth.isAuth(accessTokenFromHeader, "edit_item");
        if (isAuth.err === true) {
            return res.status(400).json(isAuth)
        }
        //thông tin người dùng
        const user_uuid = isAuth.data.data[0].user_key
        //kiểm tra có dữ liệu nào bị bỏ trống hay không
        const requiredFields = ['pt_uuid', 'pt_name', 'pt_namesub', 'pt_part', 'pt_detail', 'cat_uuid', 'pt_note', 'pt_image', 'man_uuid'];//kiểm tra hết để chắc chắn máy khách luôn gửi lên đủ
        const missingFields = [];
        requiredFields.forEach(field => {
            if (!req.body[field]) {
                missingFields.push(field);
            }
        });
        if (missingFields.length > 0) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng không để trống dữ liệu",
                data: missingFields.join(',')
            });
        }
        //kiểm tra xem dữ liệu nhập có quá dài hay không
        const errorFields = [];

        const checkField = (fieldName, value, maxLength) => {
            if (!value || Func.isStringTooLong(value, maxLength)) {
                errorFields.push(fieldName);
            }
        }
        checkField('pt_name', pt_name, 150);
        checkField('pt_namesub', pt_namesub, 150);
        checkField('pt_part', pt_part, 150);
        checkField('cat_uuid', cat_uuid, 150);
        checkField('pt_uuid', pt_uuid, 150);
        if (errorFields.length > 0) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng kiểm tra các trường dữ liệu lỗi.",
                data: errorFields.join(',')
            });
        }
        //kiểm tra xem cái item đang sửa có đang tồn tại hay không
        const productGetuuid = await itemModel.getProduct("pt_uuid", pt_uuid);
        //nếu đang không tồn tại => trả về lỗi
        if (!productGetuuid.data) {
            return res.status(400).json({
                err: true,
                msg: "Sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_uuid"
            })
        }
        //kiểm tra xem cat_uuid có tồn tại không
        const catalogGetuuid = await catalogModel.getCatalog("cat_uuid", cat_uuid);
        if (!catalogGetuuid.data) {
            return res.status(400).json({
                err: true,
                msg: "Danh mục sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_cat"
            })
        }

        //kiểm tra xem man_uuid có tồn tại không
        const manufactorGetuuid = await manufactorModel.getManufactor("man_uuid", man_uuid);
        if (!manufactorGetuuid.data) {
            return res.status(400).json({
                err: true,
                msg: "Nhãn hàng của sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_man"
            })
        }
        const thisProduct = productGetuuid.data
        //đây là sp demo nên không cho phép sửa cái qq sn
        const newProduct = {
            'pt_name': pt_name,
            'pt_namesub': pt_namesub,
            'pt_part': pt_part,
            'pt_detail': pt_detail,
            'cat_uuid': cat_uuid,
            'pt_note': pt_note,
            'pt_image': pt_image,
            'man_uuid': man_uuid
        };

        //lấy allItem
        var allPrduct = await itemModel.getProduct('1','1', true)
        allPrduct = allPrduct.data;
        // 1. So sánh thisItem và newItem
        let diffKeys = [];
        // Lặp qua các keys trong thisItem
        Object.keys(thisProduct).forEach(async (key) => {
            // Nếu key không tồn tại trong newItem thì bỏ qua
            if (!newProduct[key]) return;
            // So sánh giá trị, nếu khác nhau thêm vào mảng diff
            //nếu có kiểm tra xem có tồn tại hay không
            if (thisProduct[key] !== newProduct[key]) {
                diffKeys.push({ [key]: newProduct[key] });
            }
        });
        //nếu không có cái nào thay đổi thì trả về lỗi luôn
        if (diffKeys.length < 1) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng phải thay đổi gì đó",
                data: "err_no_change"
            })
        }
        //Tìm xem cat uuid có thay đổi hay không
        // Hàm để tìm các giá trị trùng nhau
        const duplicates = diffKeys.filter(diffKeyProduct => allPrduct.some(allPrductPt =>
            Object.keys(diffKeyProduct).every(key => allPrductPt[key] === diffKeyProduct[key])
        ));
        //nếu có giá trị trùng nhau
        //trả về lỗi
        if (duplicates.length >= 1) {
            return res.status(400).json({
                err: true,
                msg: "Có một thành phần nào đó đã xuất hiện trong csdl, vui lòng kiểm tra lại",
                data: duplicates
            })
        }
        //nếu không có cái nào trùng
        const diffKeysObject = {};
        diffKeys.forEach(async (diffKeyProduct) => {
            Object.keys(diffKeyProduct).forEach(async (key) => {
                diffKeysObject[key] = diffKeyProduct[key];
            });
        });

        ///gửi vào CSDL
        var _err = false
        Object.keys(diffKeysObject).forEach(async (key) => {
            var editProduct = await itemModel.editProduct(key, diffKeysObject[key], pt_uuid)
            if (editProduct.err != true) {
                _err = true;
            }
        })
        if (_err === true) {
            return res.status(500).json({
                err: false,
                msg: "Có lỗi trong quá trình cập nhật Sản phẩm",
                data: "edit_product_err"
            })
        }
        const content = {
            oldProduct: thisProduct,
            updateProduct: diffKeysObject
        }
        //thêm vào file log thông tin cập nhật để sau này còn tra lại
        logs.writeLogs(user_uuid, "updateProduct", content)
        //Trả về OK
        return res.status(200).json({
            err: false,
            msg: "Chỉnh sửa Sản phẩm thành công",
            data: "edit_product_success"
        })

    } catch (error) {
        //thêm log 
        console.log(error);
        logs.writeErrLog("01eia", JSON.stringify(error))
        return res.status(500).json({
            err: true,
            msg: "Có lỗi trong quá trình thêm dữ liệu - Vui lòng liên hệ quản trị Viên hệ thống để sửa mã lỗi ERRADDWHS",
            data: error
        })
    }
}

//nhập sản phẩm
const importItem = async (req = request, res = response) => {
    //khi nhập sản phẩm thì có 2 dạng 1 là thêm số lượng với những item không có sn và thêm vào kho 1 cái đối với mấy cái có sn
    try {
        // đọc dữ liệu gửi lên
        var { pt_uuid, it_price, it_note, it_image, it_amount, it_serial, it_serial } = req.body;
        //lấy key trong header
        const accessTokenFromHeader = req.headers.x_authorization;
        //Kiểm tra xem người dùng đăng nhập hay chưa
        const isAuth = await Auth.isAuth(accessTokenFromHeader, "add_item");
        if (isAuth.err === true) {
            return res.status(400).json(isAuth)
        }
        //lấy thông tin người dùng
        const user_uuid = isAuth.data.data[0].user_key
        //kiểm tra có để trống cái nào hay không
        function checkFields(fields) {
            const errorFields = [];
            fields.forEach((field) => {
                if (!req.body[field]) {
                    errorFields.push(field);
                }
            });

            if (errorFields.length > 0) {
                return res.status(400).json({
                    err: true,
                    msg: "Vui lòng không để trống dữ liệu",
                    data: errorFields
                });
            }
        }
        const requiredFields = ['pt_uuid', 'it_price', 'it_note', 'it_image', 'it_amount', 'it_serial', 'it_serial'];
        checkFields(requiredFields);

        //Kiểm tra xem sản phẩm đã tồn tại trên CSDL chưa tránh người dùng nhập linh ta linh tinh
        const productGetuuid = itemModel.getProduct('pt_uuid', pt_uuid);
        if (!productGetuuid .data) {
            return res.status(400).json({
                err: true,
                msg: "Sản phẩm không tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_null_uuid"
            })
        }

        //nếu có tồn tại kiểm tra xem có cần kiểm soát theo Serial hay không
        const thisProduct = productGetuuid.data;

        //kiểm tra xem user nhập là NULLSN hay SN thường
        if (thisProduct.pt_serial === 0) {
            //kiểm tra xem sản phẩm đó đã từng nhập trong kho hay chưa
            //const checkSN = await itemModel.getItemData('it_serial', "NULLSN");

        }
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    createProduct,
    editProduct,
    importItem
}