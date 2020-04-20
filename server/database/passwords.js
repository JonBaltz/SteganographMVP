const mongoose = require('mongoose');
const db = require('./index.js');

// Try to find a seperate way to store an id thats bigger
const reviewSchema = new mongoose.Schema({
	id: String,
	salt: String,
	hashed: String,
});

module.exports = mongoose.model('Passwords', reviewSchema);