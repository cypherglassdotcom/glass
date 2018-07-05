import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Level from '../components/Level'
import LevelItem from '../components/LevelItem'
import LevelLeft from '../components/LevelLeft'
import LevelRight from '../components/LevelRight'
import Box from '../components/Box'
import './BpTopMenu.css'

class BpTopMenu extends Component {

  menuItem(type, text, action) {
    const { filter, position } = this.props

    const value = type === 'filter' ? filter : position
    const link = type === 'filter' ?
      `/map/${action}/${position}` :
      `/map/${filter}/${action}`

    return (
      <LevelItem>
        { value === action ? <strong>{text}</strong>
          : <Link to={link}>{text}</Link> }
      </LevelItem>
    )
  }

  renderFilterMenu() {
    const menu = [
      this.menuItem('filter', 'Main Location', 'main'),
      this.menuItem('filter', 'Producer Nodes', 'bp'),
      this.menuItem('filter', 'All Nodes', 'all')
    ]

    return menu
  }

  renderPositionMenu() {
    const menu = [
      this.menuItem('position', 'Active BPs', 'abp'),
      this.menuItem('position', 'Top 50', 'top50'),
      this.menuItem('position', 'Top 100', 'top100'),
      this.menuItem('position', 'All', 'all')
    ]

    return menu
  }

  render() {
    return (
      <Box className="BpTopMenu">
        <Level>
          <LevelLeft>
            <LevelItem><p><strong>221</strong> Block Producers</p></LevelItem>
            <LevelItem>
              <div className="field has-addons">
                <p className="control">
                  <input className="input is-small" type="text" placeholder="Find a Producer" />
                </p>
                <p className="control">
                  <button className="button is-small">
                    Search
                  </button>
                </p>
              </div>
            </LevelItem>
            {this.renderFilterMenu()}
          </LevelLeft>
          <LevelRight>
            {this.renderPositionMenu()}
          </LevelRight>
        </Level>
      </Box>
    );
  }
}

export default BpTopMenu
