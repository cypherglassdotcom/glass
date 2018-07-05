import React, { Component } from 'react'

class Level extends Component {

  render() {
    return (
      <div className="level">
        {this.props.children}
      </div>
    )
  }
}

export default Level
