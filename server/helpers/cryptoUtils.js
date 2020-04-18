const crypto = require('crypto');

const cryptoUtils = {};

cryptoUtils.createSalt = function () {
	return crypto.randomBytes(32).toString('hex');
}

cryptoUtils.createId = function () {
	let string = '';
	for (let i = 0; i < 7; i++) {
		string += Math.round(Math.random());
	}
	return string;
}

cryptoUtils.createHash = function (password, salt) {
	const hash = crypto.createHash('sha256');
	hash.update(password + salt);
	return hash.digest('hex');
}

cryptoUtils.compareHash = function (hash, input, salt) {
	return hash === this.createHash(input, salt);
}

// const salt1 = cryptoUtils.createSalt()
// console.log(salt1);
// console.log(cryptoUtils.createId());
// console.log(cryptoUtils.compareHash(cryptoUtils.createHash('1234', salt1), '1234', salt1));