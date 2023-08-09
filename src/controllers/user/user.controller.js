const { request } = require("express");
const userModel = require("../../models/user/user.model")
const bcrypt = require('bcrypt')
const authMid = require('../../middlewares/auth/auth.mid');
const variables = require('../../middlewares/variables');
const sendMail = require('../../middlewares/mail/mail.Send');
//Chức năng đổi mật khẩu
const changePass = async (req = request, res = response) => {
	const userInput_oldpass = req.body.oldpass;
	const userInput_newpass = req.body.newpass;
	const userInput_cfnewpass = req.body.cfnewpass;
	//lấy token của người dùng trong header
	const accessTokenFromHeader = req.headers.x_authorization;
	//kiểm tra xác thực user
	const authUser = await authMid.isAuth(accessTokenFromHeader)

	if (authUser.err == true) {
		return res.status(400).json({
			err: true,
			msg: authUser.msg,
			data: authUser
		})
	}

	//kiểm tra các input đầu vào
	//hai cái mới để trống => không đổi gì
	if (!userInput_newpass && !userInput_cfnewpass) {
		return res.status(200).json({
			err: false,
			msg: "Không đổi gì cả",
			data: "success_nochange"
		})
	}
	//nhập một cái thì phải nhập cả 2
	if (!userInput_newpass) {
		return res.status(400).json({
			err: true,
			msg: "Vui lòng không để trống mật khẩu mới",
			data: "emty_cfnewpassword"
		})
	}
	if (!userInput_cfnewpass) {
		return res.status(400).json({
			err: true,
			msg: "Vui lòng xác nhận lại mật khẩu mới",
			data: "emty_cfnewpassword"
		})
	}
	if (!userInput_oldpass) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu người dùng đang để trống",
			data: "empty_oldpassword"
		})
	}
	// kiểm xem mật khẩu có nhập linh tinh không
	if (!userInput_oldpass.match(variables.passwordformat)) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu cũ không đúng định dạng vui lòng nhập lại. 8 đến 15 ký tự chứa ít nhất một chữ thường, một chữ in hoa, một chữ số và một ký tự đặc biệt",
			data: "error_oldpassword"
		})
	}
	if (!userInput_newpass.match(variables.passwordformat)) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu mới không đúng định dạng vui lòng nhập lại. 8 đến 15 ký tự chứa ít nhất một chữ thường, một chữ in hoa, một chữ số và một ký tự đặc biệt",
			data: "error_newpassword"
		})
	}
	if (!userInput_cfnewpass.match(variables.passwordformat)) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu mới không đúng định dạng vui lòng nhập lại. 8 đến 15 ký tự chứa ít nhất một chữ thường, một chữ in hoa, một chữ số và một ký tự đặc biệt",
			data: "error_cfnewpassword"
		})
	}
	//kiểm tra mật khẩu cũ có khớp hay không
	const isPasswordValid = bcrypt.compareSync(userInput_oldpass, authUser.data.data[0].user_password);
	if (!isPasswordValid) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu cũ không khớp, vui lòng thử lại",
			data: "err_oldpass"
		})
	}

	//kiểm tra 2 mật khẩu mới có giống nhau hay không
	if (userInput_newpass != userInput_cfnewpass) {
		return res.status(400).json({
			err: true,
			msg: "Vui lòng kiểm tra lại mật khẩu mới, hai mật khẩu mới không khớp nhau",
			data: "err_cfnewpass"
		})
	}
	//kiểm tra xem mật khẩu mới với mật khẩu cũ có khớp nhau không
	const isOldNewPasswordValid = bcrypt.compareSync(userInput_newpass, authUser.data.data[0].user_password);
	if (isOldNewPasswordValid) {
		return res.status(400).json({
			err: true,
			msg: "Mật khẩu mới không được để giống mật khẩu cũ",
			data: "err_oldnewpass"
		})
	}

	//Tiến hành cập nhật mật khẩu mới, lưu vào logs
	var updateUser = await userModel.updateUser("user_password", bcrypt.hashSync(userInput_newpass, 10), "user_email", authUser.data.data[0].user_email)
	if (updateUser.error != true) {
		return res.status(200).json({
			err: false,
			msg: "Cập nhật mật khẩu mới thành công",
			data: "success_changepass"
		})
	}
	else {
		return res.status(400).json({
			err: false,
			msg: "Có lỗi xảy ra trong quá trình thực thi lệnh",
			data: "err_database"
		})
	}
}


//hàm xử lý sự kiện người dùng quên mật khẩu
const forgotPass = async (req = request, res = response) => {
}

module.exports = {
	changePass,
	forgotPass
}