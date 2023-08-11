const { request } = require("express");
const userModel = require("../../models/user/user.model")
const bcrypt = require('bcrypt')
const authMethod = require('../../middlewares/auth/auth.method')
const authMid = require('../../middlewares/auth/auth.mid');
const isAuth = async (accessTokenFromHeader) => {
	try {
		//kiểm tra xem đúng user đang đăng nhập hay không//
		var data_rs = {
			err: true,
			msg: "Lỗi không xác định",
			data: null,
		}
		//kiểm tra xem có tồn tại hay không
		if (!accessTokenFromHeader) {
			data_rs = {
				err: true,
				msg: "Token không tồn tại hoặc bị sai, vui lòng kiểm tra lại",
				data: "error_tokenvalid"
			}

			return data_rs;
		}
		const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET // lấy mã bí mật lưu trong ENV
		///xác thực
		const verified = await authMethod.verifyToken(accessTokenFromHeader, accessTokenSecret)
		//kiểm tra token còn dùng được hay không
		if (!verified) {
			data_rs = {
				err: true,
				msg: "Token không tồn tại hoặc bị hết hạn, vui lòng kiểm tra lại",
				data: "error_tokennotverifed"
			}
			return data_rs;
		}
		//lấy thông tin user từ đống token mới lấy được
		const userInfo = await userModel.getUserInfo("user_email", verified.payload.user_email)
		if (!userInfo) {
			data_rs = {
				err: true,
				msg: "Xác thực không thành công, tài khoản có vấn đề, tài khoản của bạn sẽ bị tạm khoá",
				data: "err_hacker"
			}
			return data_rs;
		}

		//kiểm tra xem phiên làm việc của token có ok hay không
		if (userInfo.data[0].user_loginid != verified.payload.user_loginid) {
			data_rs = {
				err: true,
				msg: "Phiên đăng nhập không hợp lệ",
				data: "err_loginid"
			}
			return data_rs;
		}
		///trả về thông tin user
		data_rs = {
			err: false,
			msg: "Xác thực thành công",
			data: userInfo
		}
		return data_rs;
	} catch (error) {

	}
}


module.exports = {
	isAuth
}