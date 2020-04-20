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
				file: URL.createObjectURL(event.target.files[0])
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
		const data = {
			password: this.state.password,
			message: this.state.message
		}
		$.ajax({
			url: '/password',
			type: 'POST',
			contentType: 'application/json',
			datatype: 'json',
			data: JSON.stringify(data)
		}).done(({ err, response }) => {
			if (err) {
				this.setState({
					alert: "There was a problem, please try again."
				});
			} else {
				console.log(response);
				const c = document.getElementById('altered');
				const context = c.getContext("2d");
				const img = document.getElementById('original');
				context.drawImage(img, 0, 0);
				const imageData = context.getImageData(0, 0, img.width, img.height);
				const data = imageData.data;
				let message = response.id + this.string2Binary(response.coded).split(' ').join('');
				let count = 0;
				for (var i = 0; i < data.length; i += 4) {
					if (data[i + 2] < 5 && count < message.length) {
						data[i + 2] = message[count];
						count++;
					}
				}
				context.putImageData(imageData, 0, 0);
			}
		})
	}

	reveal() {
		const c = document.getElementById('altered');
		const context = c.getContext("2d");
		const img = document.getElementById('original');
		context.drawImage(img, 0, 0);
		const imageData = context.getImageData(0, 0, img.width, img.height);
		const data = imageData.data;
		let decoded = '';
		let space = 0;
		for (var i = 0; i < data.length; i += 4) {
			if (data[i + 2] === 1 || data[i + 2] === 0) {
				if (space === 7) {
					decoded += ' ';
					space = 0;
				}
				decoded += data[i + 2];
				space++;
			}
		}
		decoded = this.binary2String(decoded);
		this.setState({
			decoded
		});
	}

	render() {
		return (
			<div>
				<h1>Steganography</h1>
				<p>Explanation paragraph.</p>
				<label htmlFor="file" accept="image/*, .png">Insert a .png/.jpeg file </label>
				<input onChange={this.handleImageChange} type="file"></input>
				<p className="alert">{this.state.alert}</p>
				<button onClick={this.hide}>Hide</button>
				<button onClick={this.reveal}>Reveal</button>
				<textarea id="message" onChange={this.handleMessageChange} rows="4" cols="50" defaultValue="Enter Message Here"></textarea>
				<input id="password" type="text" defaultValue="Password"></input>
				<img id="original" src={this.state.file} width="220" height="277" />
				<canvas id="altered" width="220" height="277">Your Browser doesn't support canvas</canvas>
				<p className="decoded">{this.state.decoded}</p>
			</div>
		);
	}
};

export default App;