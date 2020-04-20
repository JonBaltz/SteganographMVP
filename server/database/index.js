const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/steganography', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

module.exports = mongoose.connection;