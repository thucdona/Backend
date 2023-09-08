const { request } = require("express");
const catalogModel = require('../models/catalog.model');
const Auth = require('../../src/middlewares/auth/auth.mid');
const logs = require('../../src/middlewares/logs/server.log');
//tạo mới một danh mục
const createCat = async (req = request, res = response) => {
    try {
        //đọc dữ liệu gửi lên
        const { cat_name, cat_detail, cat_key } = req.body;
        //lấy key trong header
        const accessTokenFromHeader = req.headers.x_authorization;
        //Kiểm tra xem người dùng đăng nhập hay chưa
        const isAuth = await Auth.isAuth(accessTokenFromHeader,"add_catalog");
        if (isAuth.err === true) {
            return res.status(400).json(isAuth)
        }
        //kiểm tra xem có để trống cái nào không
        if (!{ cat_name, cat_detail, cat_key }) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng không để trống dữ liệu",
                data: "error_null"
            })
        }

        //lấy thông tin từ csdl xem đã tồn tại hay chưa
        const catalogGet = await catalogModel.getCatalog("cat_key", cat_key);

        if (catalogGet.data) {
            return res.status(400).json({
                err: true,
                msg: "Mã của danh mục đã tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_unique_key"
            })
        }

        const catalogGetbyName = await catalogModel.getCatalog("cat_name", cat_name);
        if (catalogGetbyName.data) {
            return res.status(400).json({
                err: true,
                msg: "Tên của danh mục đã tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error_unique_name"
            })
        }
        //nếu chưa tồn tại thì thêm vào CSDL
        await catalogModel.createCatalog(cat_name, cat_detail,cat_key)
        //kiểm tra xem trong data đã có hay chưa
        const checkCat = await catalogModel.getCatalog("cat_key", cat_key);
        if (!checkCat.data) {
            return res.status(500).json({
                err: true,
                msg: "Có lỗi trong quá trình thêm dữ liệu - Vui lòng liên hệ quản trị Viên hệ thống để sửa mã lỗi ERRADDCATNULL",
                data: "ERRADDCATNULL"
            })
        }
        return res.status(200).json({
            err: false,
            msg: "Thêm mới danh mục thành công",
            data: checkCat[0]
        })

    } catch (error) {
        //thêm log 
        logs.writeErrLog("500-ADDCAT","Lỗi thêm danh mục mới: " + JSON.stringify(error))
        return res.status(500).json({
            err: true,
            msg: "Có lỗi trong quá trình thêm dữ liệu - Vui lòng liên hệ quản trị Viên hệ thống để sửa mã lỗi ERRADDCAT",
            data: error
        })
    }
}

module.exports = {
    createCat,
}