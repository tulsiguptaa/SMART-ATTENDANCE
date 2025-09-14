const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendEmail(to, subject, text, html = null) {
  try {
    const mailOptions = {
      from: `"Smart Attendance" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
}


async function sendWeeklyReport(parentEmail, studentName, attendancePercentage) {
  const subject = `Weekly Attendance Report for ${studentName}`;
  const text = `
Dear Parent,

Here is the weekly attendance summary for your child, ${studentName}:
Attendance Percentage: ${attendancePercentage}%

Thank you,
Smart Attendance System
  `;

  const html = `
  <p>Dear Parent,</p>
  <p>Here is the weekly attendance summary for your child, <b>${studentName}</b>:</p>
  <h3>Attendance Percentage: ${attendancePercentage}%</h3>
  <p>Thank you,<br/>Smart Attendance System</p>
  `;

  return sendEmail(parentEmail, subject, text, html);
}

module.exports = {
  sendEmail,
  sendWeeklyReport,
};
