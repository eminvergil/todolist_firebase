import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newNote: "",
      noteList: [],
      idList: [33, 55],
    };
  }

  updateInput(key, value) {
    this.setState({
      [key]: value,
    });
  }

  addItem() {
    const newNote = {
      id: 1 + Math.random(),
      value: this.state.newNote.slice(),
    };

    const noteList = [...this.state.noteList];

    noteList.push(newNote);

    this.setState({
      newNote: "",
      noteList,
    });
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
          return <li key={note.id}>{note.value}</li>;
        })}
      </div>
    );
  }
}

export default App;
