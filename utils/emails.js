const nodemailer = require("nodemailer");

const sendEmail = async function (data) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "Node App",
    to: data.email,
    subject: "Restore Password",
    text: `Your password restoration link:\n ${data.restoreUrl} ! It expires in 10 minutes!`,
  });
};

module.exports = sendEmail;
