const nodemailer = require('nodemailer');

const emailConfig = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       
  port: process.env.EMAIL_PORT,       
  secure: false,                      
  auth: {
    user: process.env.EMAIL_USER,    
    pass: process.env.EMAIL_PASS,     
  },
});

emailConfig.verify(function (error, success) {
  if (error) {
    console.error('Email server connection failed:', error);
  } else {
    console.log('Email server is ready to take messages');
  }
});

module.exports = emailConfig;
