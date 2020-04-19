const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();

const vigenere = require('./helpers/vigenere.js');
const cryptoUtils = require('./helpers/cryptoUtils.js');

const db = require('./database/index.js');
const Passwords = require('./database/passwords.js');

const port = 9000;

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.post('/password', (req, res) => {
	const genUniId = function (callback) {
		const tryId = cryptoUtils.createId();
		Passwords.find({ id: tryId }, (err, response) => {
			if (err) {
				res.json({ err, response });
			} else {
				if (response.length === 0) {
					callback(tryId);
				} else {
					genUniId(callback);
				}
			}
		});
	}
	genUniId((goodId) => {
		const current = {
			id: goodId,
			salt: cryptoUtils.createSalt(),
		}
		current.hashed = cryptoUtils.createHash(req.body.password, current.salt);
		Passwords.create(current, (err, response) => {
			if (err) {
				res.json({ err, response });
			} else {
				// encrypt the message with the hashed password and return it and the id
				const coded = vigenere.encode(req.body.message, response.hashed);
				res.json({ id: goodId, coded });
			}
		})
	});
});

app.get('/auth', (req, res) => {
	res.send('hello');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));