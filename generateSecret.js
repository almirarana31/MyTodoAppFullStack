import crypto from 'crypto';

// Generate a random 64-byte string
const accessTokenSecret = crypto.randomBytes(64).toString('hex');
console.log('ACCESS_TOKEN_SECRET:', accessTokenSecret); 