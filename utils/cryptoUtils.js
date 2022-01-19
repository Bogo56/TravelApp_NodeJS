const bcrypt = require("bcryptjs");
const util = require("util");
const cryptoLib = require("crypto");

exports.hashPass = async function (password) {
  const salt = await util.promisify(bcrypt.genSalt)(12);
  const hashedPass = await util.promisify(bcrypt.hash)(
    password,
    salt
  );

  return hashedPass;
};

exports.checkPass = async function (password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
};

exports.createResetToken = async function () {
  let token = await util.promisify(cryptoLib.randomBytes)(20);
  token = token.toString("hex");

  return token;
};

exports.encryptResetToken = function (token) {
  const encrypted = cryptoLib
    .createHmac("sha256", process.env.CRYPTO_SECRET)
    .update(token)
    .digest("hex");

  return encrypted;
};
