import React from 'react';

import { DB_CONFIG } from './Config/config';
import firebase from 'firebase/app';
import 'firebase/database';

import './App.css';

var app = firebase.initializeApp(DB_CONFIG);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.updateInput = this.updateInput.bind(this);
		this.addItem = this.addItem.bind(this);
		this.romeveItem = this.romeveItem.bind(this);

		// this.app = firebase.initializeApp(DB_CONFIG);
		this.database = app.database().ref().child('noteList');

		this.state = {
			newNote: '',
			noteList: []
		};
	}

	updateInput(key, value) {
		this.setState({
			[key]: value
		});
	}

	componentWillMount() {
		const prevNotes = this.state.noteList;

		this.database.on('child_added', (snap) => {
			prevNotes.push({
				id: snap.key,
				value: snap.val().noteList.value
			});

			this.setState({
				noteList: prevNotes
			});
		});

		console.log(prevNotes);

		// this.database.on('child_removed', (snap) => {
		// 	for (let i = 0; i < prevNotes.length; i++) {
		// 		if (prevNotes[i].id === snap.key) {
		// 			prevNotes.slice(i, 1);
		// 		}
		// 	}

		// 	this.setState({
		// 		noteList: prevNotes
		// 	});
		// });
	}

	componentDidMount() {
		const prevNotes = this.state.noteList;
		this.database.on('child_removed', (snap) => {
			for (let i = 0; i < prevNotes.length; i++) {
				if (prevNotes[i].id === snap.key) {
					prevNotes.splice(i, 1);
				}
			}

			this.setState({
				noteList: prevNotes
			});
		});
	}

	addItem() {
		const newNote = {
			id: 1 + Math.random(),
			value: this.state.newNote.slice()
		};

		this.database.push().set({ noteList: newNote });
	}

	romeveItem(id) {
		console.log('from removi item: ' + id);

		this.database.child(id).remove();
	}

	render() {
		return (
			<div className="App">
				<h1>Todo List App Made With Firebase</h1>
				<input
					type="text"
					placeholder="Add your todo item"
					value={this.state.newNote}
					onChange={(e) => this.updateInput('newNote', e.target.value)}
				/>
				<button onClick={() => this.addItem()}>Add TODO</button>
				{this.state.noteList.map((note) => {
					return (
						<li key={note.id}>
							{note.value} <button onClick={() => this.romeveItem(note.id)}>X</button>
						</li>
					);
				})}
			</div>
		);
	}
}

export default App;
