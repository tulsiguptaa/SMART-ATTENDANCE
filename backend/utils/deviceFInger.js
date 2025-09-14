const crypto = require('crypto');


function generateDeviceFingerprint(req, extraSeed = '') {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
  const userAgent = req.headers['user-agent'] || 'unknown-agent';

  const fingerprintString = `${ip}-${userAgent}-${extraSeed}`;

  return crypto.createHash('sha256').update(fingerprintString).digest('hex');
}


function compareFingerprints(fp1, fp2) {
  return fp1 === fp2;
}

module.exports = {
  generateDeviceFingerprint,
  compareFingerprints,
};
