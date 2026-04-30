import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const keyLength = 64;
const separator = ':';

export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, keyLength);

    return `${salt}${separator}${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedPassword) {
    const [salt, storedKey] = storedPassword.split(separator);

    if (!salt || !storedKey) {
        return password === storedPassword;
    }

    const derivedKey = await scrypt(password, salt, keyLength);
    const storedKeyBuffer = Buffer.from(storedKey, 'hex');

    if (storedKeyBuffer.length !== derivedKey.length) {
        return false;
    }

    return timingSafeEqual(storedKeyBuffer, derivedKey);
}
