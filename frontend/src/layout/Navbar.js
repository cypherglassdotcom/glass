import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import './Navbar.css'

class Navbar extends React.Component {

  render() {

    const { location } = this.props

    const mapActive = location.pathname === '/' ? 'is-active' : ''
    const aboutActive = location.pathname === '/about' ? 'is-active' : ''

    return (
      <nav aria-label="main navigation" className="navbar NavbarCg">
        <div className="navbar-brand logo">
          <img className="logo-img" src={logo} alt="Cypherglass GLASS" />
          <span className="title-span">GLASS</span>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/" className={`navbar-item ${mapActive}`}>
              <span className="icon">
                <i className="fas fa-map"></i>
              </span>
              <span className="navbar-item-text">Map</span>
            </Link>
            <Link to="/about" className={`navbar-item ${aboutActive}`}>
              <span className="icon">
                <i className="fas fa-question-circle"></i>
              </span>
              <span className="navbar-item-text">About</span>
            </Link>
          </div>
        </div>
      </nav>
    )

  }
}

export default withRouter(Navbar)
