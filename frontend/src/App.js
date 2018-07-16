import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import BpMain from './bp/BpMain'
import BpDetails from './bp/BpDetails'
import About from './misc/About'

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Navbar />

          <Route exact path="/" component={BpMain} />
          <Route path="/bp/:account" component={BpDetails} />
          <Route path="/map/:filter(main|bp|all)/:position(all|abp|top50|top100)" component={BpMain} />
          <Route path="/about" component={About} />
        </div>
      </Router>
    );
  }
}

export default App;
