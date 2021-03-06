import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Level from '../components/Level'
import LevelItem from '../components/LevelItem'
import LevelLeft from '../components/LevelLeft'
import LevelRight from '../components/LevelRight'
import Box from '../components/Box'
import './BpTopMenu.css'

class BpTopMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      search: ''
    }
  }

  componentDidUpdate(prevProps) {
    const { filter: prevFilter, position: prevPosition } = prevProps
    const { filter: currentFilter, position: currentPosition } = this.props

    if (prevPosition !== currentPosition || prevFilter !== currentFilter) {
      this.setState({search: ''})
    }
  }

  menuItem(type, text, action) {
    const { filter, position } = this.props

    const value = type === 'filter' ? filter : position
    const link = type === 'filter' ?
      `/map/${action}/${position}` :
      `/map/${filter}/${action}`

    return (
      <LevelItem key={link}>
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
    const { totalBps, countBps, doSearch, clearSearch, search: searchTxt, mobileClose } = this.props
    const { search } = this.state

    return (
      <Box className="BpTopMenu">
        <Level>
          <LevelLeft>
            <LevelItem>
              {searchTxt ?
                <p>Searching for <strong>{searchTxt}</strong> <a onClick={clearSearch}><i className="fa fa-times"></i></a></p> :
                <p>{countBps} of {totalBps} Reg. Block Producers</p>
              }
            </LevelItem>
            { !searchTxt &&
              <LevelItem>
                <div className="field has-addons">
                  <p className="control">
                    <input
                      className="input is-small"
                      value={search}
                      onChange={(e) => this.setState({search: e.target.value})}
                      onKeyPress={({key}) => key === 'Enter' ? doSearch(search) : null}
                      type="text"
                      placeholder="Find a Producer" />
                  </p>
                  <p className="control">
                    <button onClick={() => doSearch(search)} className="button is-small">
                      Search
                    </button>
                  </p>
                </div>
              </LevelItem>
            }
            {this.renderFilterMenu()}
          </LevelLeft>
          <LevelRight>
            {this.renderPositionMenu()}
          </LevelRight>
        </Level>
        { mobileClose ? <p>
          <a onClick={() => mobileClose()}>Close</a>
        </p> : null }
      </Box>
    );
  }
}

export default BpTopMenu
