const { pbkdf2Sync, createHash, randomBytes } = require('crypto');

/****************************************************************************
  All selected algorithms are based on NIST Digital Identity Guidelines:
  https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63b.pdf
****************************************************************************/

module.exports = {

  random_bytes: (number_of_bytes) => {
    const random_bytes = randomBytes(number_of_bytes);
    const random_bytes_hex = random_bytes.toString('hex');
    return random_bytes_hex;
  },

  hash: (string) => {
    const hash = createHash('sha512');
    hash.update(string);
    const hash_hex = hash.digest('hex');
    return hash_hex;
  },

  password_based_key_derivation: (secret, salt) => {
    const key = pbkdf2Sync(secret, salt, 120000, 64, 'sha512').toString('hex');
    const key_hex = key.toString('hex');
    return key_hex;
  }

}
