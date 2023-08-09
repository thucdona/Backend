/**
 * Created by trungquandev.com's author on 05/16/2022
 * NodeJS send email by OAuth2 and Nodemailer
 * Tutorial here: https://trungquandev.com/nodejs-viet-api-gui-email-voi-oauth2-va-nodemailer
 */
//import nodemailer from 'nodemailer'
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library'); 
//cấu hình email
const GOOGLE_MAILER_CLIENT_ID = '855426930836-t004e8erg8ug64utnktvi8gv1uol311h.apps.googleusercontent.com'
const GOOGLE_MAILER_CLIENT_SECRET = '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'
const GOOGLE_MAILER_REFRESH_TOKEN = '1//040O-nhelQXv2CgYIARAAGAQSNwF-L9Ir3D1VJAXxAbPi2lWA2nKJyrluCjIrA3p9p1S93G7bWO3l1uIt4WzC0uBz9v6SR8_3nB0'
const ADMIN_EMAIL_ADDRESS = 'thuctrandona@gmail.com'
//// Khởi tạo OAuth2Client với Client ID và Client Secret 
const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
)
// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
})
const mailSend = async (req = request, res = response) => {
  try {
    // Lấy thông tin gửi lên từ client qua body
    const { email, subject, content } = req.body
     /**
     * Lấy AccessToken từ RefreshToken (bởi vì Access Token cứ một khoảng thời gian ngắn sẽ bị hết hạn)
     * Vì vậy mỗi lần sử dụng Access Token, chúng ta sẽ generate ra một thằng mới là chắc chắn nhất.
     */
     const myAccessTokenObject = await myOAuth2Client.getAccessToken()
     // Access Token sẽ nằm trong property 'token' trong Object mà chúng ta vừa get được ở trên
     const myAccessToken = myAccessTokenObject?.token
     // Tạo một biến Transport từ Nodemailer với đầy đủ cấu hình, dùng để gọi hành động gửi mail
     const transport = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         type: 'OAuth2',
         user: ADMIN_EMAIL_ADDRESS,
         clientId: GOOGLE_MAILER_CLIENT_ID,
         clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
         refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
         accessToken: myAccessToken
       }
     })
     // mailOption là những thông tin gửi từ phía client lên thông qua API
     const mailOptions = {
       to: email, // Gửi đến ai?
       subject: subject, // Tiêu đề email
       html: `<h3>${content}</h3>` // Nội dung email
     }
     // Gọi hành động gửi email
     await transport.sendMail(mailOptions)
  } catch (error) {
    // Có lỗi thì các bạn log ở đây cũng như gửi message lỗi về phía client
    console.log(error)
  }
}

module.exports = {
  mailSend,
}