const QRCode = require('qrcode');


async function generateQRCode(text, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'H', 
      type: 'image/png',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000', 
        light: '#ffffff', 
      },
      ...options,
    };

    const qrCodeDataUrl = await QRCode.toDataURL(text, qrOptions);
    return qrCodeDataUrl;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
}


async function generateQRCodeFile(text, filePath, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'M',
      width: 300,
      margin: 2,
      ...options,
    };
    await QRCode.toFile(filePath, text, qrOptions);
    console.log(`QR code saved to: ${filePath}`);
  } catch (err) {
    console.error('Error saving QR code:', err);
    throw new Error('Failed to save QR code to file');
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeFile,
};
