import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const secret = process.env.CRYPTO_SECRET;

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const iv = Buffer.from(encryptedText.slice(0, 32), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  let decrypted = decipher.update(encryptedText.slice(32), 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

