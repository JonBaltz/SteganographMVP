// Research and change to a better encryption method
// Alter so it can handle more characters
// If a unusable character is entered, handle it gracefully

const vigenere = {};

vigenere.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

vigenere.encode = function (message, key) {
	// the code is the remainder of the message index plus the key index divided by 26
	let result = '';
	let mPointer = 0;
	let kPointer = 0;
	while (mPointer < message.length) {
		if (message[mPointer] === ' ') {
			mPointer++;
			result += ' ';
		} else {
			result += this.letters[(this.letters.indexOf(message[mPointer]) + this.letters.indexOf(key[kPointer % key.length])) % this.letters.length];
			mPointer++;
			kPointer++;
		}
	}
	return result;
}

vigenere.decode = function (encrypted, key) {
	// the message is the remainder of the code index minus the key index divided by 26}
	let result = '';
	let ePointer = 0;
	let kPointer = 0;
	while (ePointer < encrypted.length) {
		if (encrypted[ePointer] === ' ') {
			ePointer++;
			result += ' ';
		} else {
			const currentDex = (this.letters.indexOf(encrypted[ePointer]) - this.letters.indexOf(key[kPointer % key.length])) % this.letters.length;
			if (currentDex >= 0) {
				result += this.letters[currentDex];
			} else {
				result += this.letters[currentDex + this.letters.length];
			}
			ePointer++;
			kPointer++;
		}
	}
	return result;
}

module.exports = vigenere;

// console.log(vigenere.decode(vigenere.encode('hello world', 'secrets'), 'secrets'));