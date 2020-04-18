import React, { Component } from 'react';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file: null,
			alert: '',
			message: 'Enter Message Here'
		}
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleMessageChange = this.handleMessageChange.bind(this);
		this.hide = this.hide.bind(this);
		this.reveal = this.reveal.bind(this);
	}
	handleImageChange(event) {
		const image = event.target.files[0];
		if (image.type === "image/png") {
			this.setState({
				file: URL.createObjectURL(event.target.files[0])
			});
		} else {
			this.setState({
				file: null,
				alert: 'Please input a png image'
			});
		}
	}
	handleMessageChange(event) {
		console.log(event.target.value);
		this.setState({
			message: event.target.value
		});
	}

	hide() {
		var c = document.getElementById('altered');
		var context = c.getContext("2d");
		var img = document.getElementById('original');
		context.drawImage(img, 0, 0);
		var imageData = context.getImageData(0, 0, img.width, img.height);
		var data = imageData.data;
	}

	reveal() {
		console.log('revealed');
	}

	render() {
		return (
			<div>
				<h1>Steganopgraphy</h1>
				<p>Explainer Paeragraph</p>
				<label htmlFor="file" accept="image/*, .png">Insert a .png file </label>
				<input onChange={this.handleImageChange} type="file"></input>
				<p className="alert">{this.state.alert}</p>
				<button onClick={this.hide}>Hide</button>
				<button onClick={this.reveal}>Reveal</button>
				<textarea id="message" onChange={this.handleMessageChange} rows="4" cols="50" defaultValue="Enter Message Here"></textarea>
				<img id="original" src={this.state.file} width="220" height="230" />
				<canvas id="altered" width="220" height="230">Your Browser doesn't support canvas</canvas>
			</div>
		);
	}
};

export default App;