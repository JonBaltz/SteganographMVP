import React, { Component } from 'react';
import $ from 'jquery';

// Maybe refactor to use hooks

// Definently refactor to multiple react components
// ie: information section, form, buttons, photos

// Add additional information to the title and description

// Refactor hide and reval to use either hex, binary, or individual digits for color to hold more characters in a photo

// Clean up!!!!
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: null,
			alert: '',
			message: 'Enter Message Here',
			password: 'Password',
			decoded: ''
		}
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.hide = this.hide.bind(this);
		this.reveal = this.reveal.bind(this);
		this.padString = this.padString.bind(this);
		this.string2Binary = this.string2Binary.bind(this);
		this.binary2String = this.binary2String.bind(this);
	}
	handleImageChange(event) {
		const image = event.target.files[0];
		if (image.type === 'image/jpeg' || image.type === 'image/png') {
			this.setState({
				file: URL.createObjectURL(event.target.files[0]),
				alert: ''
			});
		} else {
			this.setState({
				file: null,
				alert: 'Please input a png or jpeg image'
			});
		}
	}
	handleMessageChange(event) {
		this.setState({
			message: event.target.value
		});
	}

	handlePasswordChange(event) {
		this.setState({
			password: event.target.value
		});
	}

	padString(n, w = 7) {
		return n.length >= w ? n : new Array(w - n.length + 1).join('0') + n;
	}

	dec2Binary(dec) {
		return this.padString((dec >>> 0).toString(2));
	}

	string2Binary(string) {
		const that = this;
		return string.split('').map(function (char) {
			return that.padString(char.charCodeAt(0).toString(2));
		}).join(' ');
	}

	binary2String(binary) {
		return binary.split(' ').map(function (val) {
			return String.fromCharCode(parseInt(val, 2));
		}).join('');
	}

	hide() {
		const hData = {
			password: this.state.password,
			message: this.state.message
		}
		$.ajax({
			url: '/password',
			type: 'POST',
			contentType: 'application/json',
			datatype: 'json',
			data: JSON.stringify(hData)
		}).done(({ err, response }) => {
			if (err) {
				this.setState({
					alert: "There was a problem, please try again."
				});
			} else {
				const c = document.getElementById('altered');
				const context = c.getContext("2d");
				const img = document.getElementById('original');
				context.drawImage(img, 0, 0);
				const imageData = context.getImageData(0, 0, img.width, img.height);
				const data = imageData.data;
				let message = response.id + this.dec2Binary(response.coded.length) + this.string2Binary(response.coded).split(' ').join('');
				let count = 0;
				for (var i = 0; i < data.length; i += 4) {
					if (data[i + 2] < 5 && count < message.length) {
						data[i + 2] = message[count];
						count++;
					}
				}
				context.putImageData(imageData, 0, 0);
			}
		});
	}

	reveal() {
		const c = document.getElementById('altered');
		const context = c.getContext("2d");
		const img = document.getElementById('original');
		context.drawImage(img, 0, 0);
		const imageData = context.getImageData(0, 0, img.width, img.height);
		const data = imageData.data;
		let revealed = '';
		let space = 0;
		for (var i = 0; i < data.length; i += 4) {
			if (data[i + 2] === 1 || data[i + 2] === 0) {
				if (space === 7) {
					revealed += ' ';
					space = 0;
				}
				revealed += data[i + 2];
				space++;
			}
		}
		revealed = revealed.split(' ');
		const rId = revealed.shift();
		const rLength = parseInt(revealed.shift(), 2);
		const rData = {
			password: this.state.password,
			id: rId,
			message: this.binary2String(revealed.slice(0, rLength).join(' '))
		}
		$.ajax({
			url: '/auth',
			type: 'Post',
			contentType: 'application/json',
			datatype: 'json',
			data: JSON.stringify(rData)
		}).done(({ err, decoded }) => {
			if (err) {
				this.setState({
					alert: "There was a problem, please try again."
				});
			} else {
				this.setState({
					decoded
				});
			}
		})
	}

	render() {
		return (
			<div className="app">
				<h1 className="title">Steganography</h1>
				<p className="info">Steganography is the act of hiding some sort of information in an image. This website acomplishes this by altering the brightnes of individual pixels in the image by a tiny amount. Your message is encrypted before being hidden, as well as your password, so noone can see your secret information without using this website and being given your password.</p>
				<div className="interaction">
					<div className="file">
						<label htmlFor="file" accept="image/*, .png">Insert a .png/.jpeg file </label>
						<input onChange={this.handleImageChange} type="file"></input>
					</div>
					<div className="smalls">
						<input className="password" id="password" onChange={this.handlePasswordChange} type="text" defaultValue="Password"></input>
						<button onClick={this.hide}>Hide</button>
						<button onClick={this.reveal}>Reveal</button>
						<textarea id="message" onChange={this.handleMessageChange} rows="6" cols="84" defaultValue="Enter Message Here"></textarea>
					</div>
					<div>
						<img id="original" src={this.state.file} width="220" height="277" />
						<canvas id="altered" width="220" height="277">Your Browser doesn't support canvas</canvas>
					</div>
					<p className="convey">{this.state.alert + this.state.decoded}</p>
				</div>
			</div>
		);
	}
};

export default App;