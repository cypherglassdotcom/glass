import React, { Component } from 'react'
import Level from '../components/Level'
import LevelItem from '../components/LevelItem'
import LevelLeft from '../components/LevelLeft'
import LevelRight from '../components/LevelRight'
import Box from '../components/Box'
import './BpTopMenu.css'

class BpTopMenu extends Component {

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
            <LevelItem><strong>Main Location</strong></LevelItem>
            <LevelItem><a>Producer Nodes</a></LevelItem>
            <LevelItem><a>All Nodes</a></LevelItem>
          </LevelLeft>
          <LevelRight>
            <LevelItem><a>Active BPs</a></LevelItem>
            <LevelItem><strong>Top 50</strong></LevelItem>
            <LevelItem><a>Top 100</a></LevelItem>
            <LevelItem><a>All</a></LevelItem>
          </LevelRight>
        </Level>
      </Box>
    );
  }
}

export default BpTopMenu
