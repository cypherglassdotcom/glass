import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import './Navbar.css'

class Navbar extends React.Component {

  render() {

    const { location } = this.props

    console.log(location.pathname)

    const mapActive = location.pathname === '/' ||
      location.pathname.indexOf('/map') === 0 ? 'is-active' : ''
    const listActive = location.pathname === '/list' ? 'is-active' : ''
    const aboutActive = location.pathname === '/about' ? 'is-active' : ''

    return (
      <nav aria-label="main navigation" className="navbar NavbarCg">
        <div className="navbar-brand logo">
          <Link to='/'>
            <img className="logo-img" src={logo} alt="Cypherglass GLASS" />
            <span className="title-span">GLASS</span>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/" className={`navbar-item ${mapActive}`}>
              <span className="icon">
                <i className="fas fa-map"></i>
              </span>
              <span className="navbar-item-text">Map View</span>
            </Link>
            {/* <Link to="/" className={`navbar-item ${listActive}`}>
              <span className="icon">
                <i className="fas fa-list"></i>
              </span>
              <span className="navbar-item-text">List View</span>
            </Link> */}
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
