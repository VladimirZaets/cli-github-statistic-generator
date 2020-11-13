const crypto = require('crypto');

class CryptoService {
    encryptJSON(data, secret) {
        let cipher = crypto.createCipher('aes-256-cbc', Buffer.from(secret));
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    }

    decryptJSON(data, secret) {
        let encryptedText = Buffer.from(data, 'hex');
        let decipher = crypto.createDecipher('aes-256-cbc', Buffer.from(secret));
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return JSON.parse(decrypted.toString());
    }
}

module.exports = CryptoService;
