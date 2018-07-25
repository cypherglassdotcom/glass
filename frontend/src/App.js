import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import {
  isMobile
} from 'react-device-detect'
import Navbar from './layout/Navbar'
import BpMain from './bp/BpMain'
import BpDetails from './bp/BpDetails'
import About from './misc/About'
import logo from './assets/logo.svg'

class App extends Component {

  render() {
    return isMobile ?
      <div className="mobile-coming-soon">
        <div className="mobile-coming-soon-container">
          <img src={logo} alt="Cypherglass GLASS" />
          <h1>GLASS</h1>
          <p>Mobile Version Coming Soon...</p>
        </div>
      </div> :
      <Router>
        <div>
          <Navbar />

          <Route exact path="/" render={()=> <Redirect to="/map/main/top50" />} />
          <Route path="/bp/:account" component={BpDetails} />
          <Route path="/map/:filter(main|bp|all)/:position(all|abp|top50|top100)" component={BpMain} />
          <Route path="/about" component={About} />
        </div>
      </Router>

  }
}

export default App;
