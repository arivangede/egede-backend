const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");
const handlebars = require("handlebars");
require("dotenv").config();

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME,
} = process.env;

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: parseInt(MAIL_PORT, 10),
  secure: MAIL_PORT == 465,
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

const readHTMLTemplate = async (templateName) => {
  try {
    const filePath = path.join(__dirname, "templates", `${templateName}.hbs`);
    const html = await fs.readFile(filePath, "utf8");
    return html;
  } catch (error) {
    console.error("Error reading HTML template:", error);
    throw error;
  }
};

const sendEmail = async (to, subject, templateName, data) => {
  try {
    const html = await readHTMLTemplate(templateName);
    const template = handlebars.compile(html);
    const htmlToSend = template(data);

    const mailOptions = {
      from: `"${MAIL_FROM_NAME}" <${MAIL_FROM_ADDRESS}>`,
      to: to,
      subject: subject,
      html: htmlToSend,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
