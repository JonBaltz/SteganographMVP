# SteganographMVP

A small MVP/prototype of the larger steganography website that I am working on. 

This is a fullstack website will take a message, image, and password as initial input from the user and will encrypt the message and hide it inside the photo.
The message is converted to binary and a handfule a bits is inserted into the brightness value of each pixel's blue color. 
The user's password is salted and hashed then stored on the database and an id numbers is added to the message stored inside the photo.

A user can reveal the message from the image by inputting the immage and a correct password.

## Running this Repo

* Ensure mongoDB is downloaded on your device.
* In mongoDB, create a database named steganography
* $ npm install
* $ npm run build-dev
* $ npm run start-dev
* Visit http://localhost:9000/ in a browser
