import React, { Component } from 'react'

class Box extends Component {

  render() {
    return (
      <div className={`box ${this.props.className || ''}`}>
        {this.props.children}
      </div>
    )
  }
}

export default Box
