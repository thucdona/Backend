const express = require('express');
const auth = express.Router();
const authController = require('../../controllers/auth/auth.controller')
//const mail =  require('../../middlewares/mail/mail.Send');
auth.post('/adduser', authController.addUser)
//auth.get('/auth', authController.Auth)
auth.post('/login', authController.loginUser)
//auth.post('/mail', mail.mailSend)
auth.get('/', (req, res) => {
	res.json({err: false, msg:"Auth đang hoạt động"});
});

module.exports = auth;