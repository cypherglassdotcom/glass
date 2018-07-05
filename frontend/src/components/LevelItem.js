import React, { Component } from 'react'

class LevelItem extends Component {

  render() {
    return (
      <div className="level-item">
        {this.props.children}
      </div>
    )
  }
}

export default LevelItem
