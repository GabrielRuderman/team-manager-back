const nodeMailer = require("nodemailer");

const sendRecoverPasswordEmail = async (email) => {
    const transporter = nodeMailer.createTransport({
        service: process.env.appEmailService,
        auth: {
            user: process.env.appEmailAddress,
            pass: process.env.appEmailPassword
        }
    });

    const mailOptions = {
        from: process.env.appEmailAddress,
        to: email,
        subject: "Password Recovery",
        text: "This feature is coming soon..."
    };
    
    await transporter.sendMail(mailOptions);
}

module.exports = { sendRecoverPasswordEmail };