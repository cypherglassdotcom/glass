import React, { Component } from 'react'

class LevelLeft extends Component {

  render() {
    return (
      <div className="level-left">
        {this.props.children}
      </div>
    )
  }
}

export default LevelLeft
