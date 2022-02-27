const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'this.is.a.test.m80',
        pass: 'ims0tired!'
    }
});

module.exports = {
    sendEmail(userEmail,userId,userVerificationCode){
        const emailHTML =
        `
        <html>
            <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
                <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                    <div style="margin: 0 auto; width: 90%; text-align: center;">
                        <h1 style="background-color: rgba(0, 53, 102, 1); padding: 5px 10px; border-radius: 5px; color: white;">Special Order Books Email Verification</h1>
                        <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                            <p style="margin-bottom: 30px;">Please input the code below or click the link to verify your email.</p>
                            <h2 style="margin-bottom: 30px; font-size: 24px;">${userVerificationCode}</h2>
                            <a style="display: block; margin: 0 auto; border: none; background-color: rgba(255, 214, 10, 1); color: white; width: 200px; line-height: 24px; padding: 10px; font-size: 24px; border-radius: 10px; cursor: pointer; text-decoration: none;"
                            href="http://localhost:3000/verify/${userId}/${userVerificationCode}">
                            Verify Email
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
        `

        const mailOptions = {
            from: 'noreply@specialorderbook.com',
            to: userEmail,
            subject: 'Special Order Book Verification Code',
            html: emailHTML
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
