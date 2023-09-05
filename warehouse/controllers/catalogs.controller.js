const { request } = require("express");
const catalogModel = require('../models/catalog.model');
const forgotPass = async (req = request, res = response) => {
    try {
        //đọc dữ liệu gửi lên
        const { ct_name, ct_info, ct_key } = req.body;
        //kiểm tra xem có để trống cái nào không
        if (!{ ct_name, ct_info, ct_key }) {
            return res.status(400).json({
                err: true,
                msg: "Vui lòng không để trống dữ liệu",
                data: "error"
            })
        }

        //lấy thông tin từ csdl xem đã tồn tại hay chưa
        const catalogGet = catalogModel.getCatalogbyKey(ct_key);
        if (catalogGet[0]) {
            return res.status(400).json({
                err: true,
                msg: "Mã của catalog đã tồn tại trong cơ sở dữ liệu, vui lòng kiểm tra lại",
                data: "error"
            })
        }
    } catch (error) {

    }
}