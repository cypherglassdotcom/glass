import React, { Component } from 'react'
import logo from '../logo.svg'
import './Navbar.css'

class Navbar extends Component {
  render() {
    return (
      <nav aria-label="main navigation" className="navbar NavbarCg">
        <div className="navbar-brand logo">
          <img className="logo-img" src={logo} alt="Cypherglass GLASS" />
          <span className="title-span">GLASS</span>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <a className="navbar-item ">
              <span className="icon">
                <i className="fas fa-question-circle"></i>
              </span>
              <span className="navbar-item-text">About</span>
            </a>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
