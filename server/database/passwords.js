const mongoose = require('mongoose');
const db = require('./index.js');

const reviewSchema = new mongoose.Schema({
	id: String,
	salt: String,
	hashed: String,
});

module.exports = mongoose.model('Passwords', reviewSchema);