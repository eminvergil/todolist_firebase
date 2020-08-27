import React from "react";
import logo from "./logo.svg";

import { DB_CONFIG } from "./Config/config";
import firebase from "firebase/app";
import "firebase/database";

import "./App.css";

var app = firebase.initializeApp(DB_CONFIG);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateInput = this.updateInput.bind(this);
    this.addItem = this.addItem.bind(this);

    // this.app = firebase.initializeApp(DB_CONFIG);
    this.database = app.database().ref().child("noteList");

    this.state = {
      newNote: "",
      noteList: [],
    };
  }

  updateInput(key, value) {
    this.setState({
      [key]: value,
    });
  }

  componentWillMount() {
    const prevNotes = this.state.noteList;

    this.database.on("child_added", (snap) => {
      prevNotes.push({
        id: snap.key,
        value: snap.val().noteList.value,
      });

      this.setState({
        noteList: prevNotes,
      });
    });

    this.database.on("child_removed", (snap) => {
      for (let i = 0; i < this.state.noteList.length; i++) {
        if (prevNotes[i].id == snap.key) {
          prevNotes.slice(i, 1);
        }
      }

      this.setState({
        noteList: prevNotes,
      });
    });
  }

  addItem() {
    const newNote = {
      id: 1 + Math.random(),
      value: this.state.newNote.slice(),
    };
    // const noteList = [...this.state.noteList];
    // noteList.push(newNote);
    // this.setState({
    //   newNote: "",
    //   noteList,
    // });

    this.database.push().set({ noteList: newNote });
  }

  romeveItem(id) {
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
          onChange={(e) => this.updateInput("newNote", e.target.value)}
        ></input>
        <button onClick={() => this.addItem()}>Add TODO</button>
        {this.state.noteList.map((note) => {
          return (
            <li key={note.id}>
              {note.value}{" "}
              <button onClick={() => this.romeveItem(note.id)}>X</button>
            </li>
          );
        })}
      </div>
    );
  }
}

export default App;
