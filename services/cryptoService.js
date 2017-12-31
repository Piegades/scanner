"use strict";

const crypto = require("crypto"),
  pw = require("pw");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For AES, this is always 16
let ENCRYPTION_KEY = /*undefined; */ "12345678901234567890123456789012"; // Must be 256 bytes (32 characters)

/*
* Ajouter creation d'un user avec passeord a 40 charachters
plus bcrypt 40 round
*/

const cryptoService = {
  enterPassword: function() {
    return new Promise((resolve, reject) => {
      process.stdout.write("🔑 Enter Your Password: ");
      pw(password => {
        //ENCRYPTION_KEY = password;

        resolve(true);
      });
    });
  },

  encrypt: function(text) {
    return new Promise((resolve, reject) => {
      const iv = crypto.randomBytes(IV_LENGTH);
      let cipher = crypto.createCipheriv(
        ALGORITHM,
        new Buffer(ENCRYPTION_KEY),
        iv
      );

      let encrypted = cipher.update(JSON.stringify(text), "utf8", "hex");
      encrypted += cipher.final("hex");
      let tag = cipher.getAuthTag();

      resolve({ content: encrypted, iv, tag });
    });
  },

  decrypt: function(encrypted) {
    return new Promise((resolve, reject) => {
      const iv = encrypted.iv.buffer;
      let decipher = crypto.createDecipheriv(
        ALGORITHM,
        new Buffer(ENCRYPTION_KEY),
        iv
      );
      decipher.setAuthTag(encrypted.tag.buffer);
      let decrypted = decipher.update(encrypted.content, "hex", "utf8");
      decrypted += decipher.final("utf8");

      resolve(JSON.parse(decrypted));
    });
  }
};

module.exports = cryptoService;

/*
import bitcore from 'bitcore-lib';
delete global._bitcore;
import ECIES from 'bitcore-ecies';

const cryptoService = {
  encrypt({ privateKey, publicKey }, message) {
    const privKey = new bitcore.PrivateKey(privateKey);
    const receiver = ECIES()
      .privateKey(privKey)
      .publicKey(new bitcore.PublicKey(publicKey));
    const encrypted = receiver.encrypt(message);

    return encrypted.toString('hex');
  },
  decrypt({ privateKey }, encrypted) {
    const privKey = new bitcore.PrivateKey(privateKey);
    const alice = ECIES().privateKey(privKey);

    const decryptMe = new Buffer(encrypted, 'hex');

    const decrypted = alice.decrypt(decryptMe);
    return decrypted.toString('ascii');
  },
};

export default cryptoService;
*/
