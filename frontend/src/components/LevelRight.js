import React, { Component } from 'react'

class LevelRight extends Component {

  render() {
    return (
      <div className="level-right">
        {this.props.children}
      </div>
    )
  }
}

export default LevelRight
