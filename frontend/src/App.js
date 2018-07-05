import React, { Component } from 'react'
import Navbar from './layout/Navbar'
import BpMain from './bp/BpMain'
import './App.css';


class App extends Component {

  render() {
    return (
      <div className="App">
        <Navbar />
        <BpMain />
      </div>
    );
  }
}

export default App;
