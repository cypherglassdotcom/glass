import React, { Component } from 'react'
// import './BpMain.css'
import Box from '../components/Box'
import { getBp } from '../lib/bpsApi'

class BpDetails extends Component {

  constructor(props) {
    super(props)
    this.refreshData = this.refreshData.bind(this)
    this.state = {
      bpData: { json: {} },
      isLoading: false
    }
  }

  componentDidMount() {
    this.refreshData()
  }

  refreshData() {
    const { match: {params: { account } } } = this.props
    this.setState({isLoading: true, bpData: { json: {} }})

    getBp(account)
      .then(data => {
        this.setState({bpData: data, isLoading: false})
      }).catch(err => {
        alert((err && err.error && err.error.message) || err || `Fail to get ${account} BP Data`)
      })
  }

  render() {
    const { match: {params: { account }} } = this.props
    const { bpData: { json: { org, nodes } } } = this.state

    return (
      <section className="container has-margin-top">
        <h1 className="title">{(org && org.candidate_name) || account} details</h1>
        <Box>
          <div className="columns">
            <div className="column">
              {org && org.candidate_name}
            </div>
            <div className="column">
              {org && org.candidate_name}
            </div>
          </div>
        </Box>
      </section>
    );
  }
}

export default BpDetails
