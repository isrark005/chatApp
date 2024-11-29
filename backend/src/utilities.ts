import crypto from 'crypto';

export function generateSecureID(length = 5) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const bytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length;
    result += characters.charAt(randomIndex);
  }
  
  return result;
}




