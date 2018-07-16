import React, { Component } from 'react'
import Box from '../components/Box'
import { getBp } from '../lib/bpsApi'
import moment from 'moment'

import './BpDetails.css'

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
    const { bpData } = this.state
    const { json: { org, nodes } } = bpData

    const lastUpdatedAt = moment(bpData.updatedAt).format('MMMM Do YYYY, h:mm:ss a')

    return (
      <section className="container has-margin-top">
        <div>
          { org && org.branding && org.branding.logo_256 &&
            <img className="img-logo" src={org.branding.logo_256} /> }
          <div className="details-header">
            <h1 className="title is-4">{(org && org.candidate_name) || account}</h1>
            <span><strong>EOS Account:</strong> {bpData.owner}</span>
            <span><strong>URL:</strong>
              {' '}
              <a href={bpData.url} target="_blank">{bpData.url}</a>
            </span>
            <span><strong>Last Updated At:</strong> {lastUpdatedAt}</span>
            <br/>
            <span><strong>EOS Public Key:</strong> {bpData.producer_key}</span>
          </div>
        </div>
        <Box className="details-info">
          <h2 className="title is-5">Block Producer Info</h2>
          {!org ? <p>This block producer has no further details information. (Fail to retrieve bp.json file)</p>
          : <div className="columns">
              <div className="column is-two-thirds">
                {org.location &&
                  <p><strong>Main Location:</strong><br/> {org.location.name}, {org.location.country}</p>}
                {org.email &&
                  <p><strong>Email:</strong><br/> <a href={`mailto:${org.email}`}>{org.email}</a></p>}
                {org.website &&
                  <p><strong>Website:</strong><br/> <a href={org.website} target="_blank">{org.website}</a></p>}
                {org.code_of_conduct &&
                  <p><strong>Code of Conduct:</strong><br/> <a href={org.code_of_conduct} target="_blank">{org.code_of_conduct}</a></p>}
                {org.ownership_disclosure &&
                  <p><strong>Ownership Disclosure:</strong><br/> <a href={org.ownership_disclosure} target="_blank">{org.ownership_disclosure}</a></p>}
              </div>
              {org.social ?
                <div className="column">
                    {org.social.telegram &&
                      <p><strong>Telegram:</strong><br/> <a href={`https://t.me/${org.social.telegram}`} target="_blank">{org.social.telegram}</a></p>}
                    {org.social.facebook &&
                      <p><strong>Facebook:</strong><br/> <a href={`https://www.facebook.com/${org.social.facebook}`} target="_blank">{org.social.facebook}</a></p>}
                    {org.social.twitter &&
                      <p><strong>Twitter:</strong><br/> <a href={`https://twitter.com/${org.social.twitter}`} target="_blank">{org.social.twitter}</a></p>}
                    {org.social.youtube &&
                      <p><strong>YouTube:</strong><br/> <a href={`https://www.youtube.com/${org.social.youtube}`} target="_blank">{org.social.youtube}</a></p>}
                    {org.social.github &&
                      <p><strong>GitHub:</strong><br/> <a href={`https://github.com/${org.social.github}`} target="_blank">{org.social.github}</a></p>}
                    {org.social.steemit &&
                      <p><strong>Steemit:</strong><br/> <a href={`https://steemit.com/@${org.social.steemit}`} target="_blank">{org.social.steemit}</a></p>}
                    {org.social.reddit &&
                      <p><strong>Reddit:</strong><br/> <a href={`https://reddit.com/u/${org.social.reddit}`} target="_blank">{org.social.reddit}</a></p>}
                    {org.social.keybase &&
                      <p><strong>Keybase:</strong><br/> <a href={`https://keybase.io/${org.social.keybase}`} target="_blank">{org.social.keybase}</a></p>}
                    {org.social.wechat &&
                      <p><strong>WeChat:</strong><br/> <a href={`https://www.wechat.com/${org.social.wechat}`} target="_blank">{org.social.wechat}</a></p>}
                </div>
                : null}
            </div> }
        </Box>

        <div className="has-margin-top">
          <h2 className="title is-5">Nodes List</h2>
          {!nodes || !nodes.length ? <p>This Block Producer has no listed nodes</p> :
            <table className="table is-striped is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>API Endpoint</th>
                  <th>SSL Endpoint</th>
                  <th>P2P Endpoint</th>
                </tr>
              </thead>
              <tbody>
                { nodes.map((node, index) => {
                  return <tr key={`node-${index}`}>
                    <td>
                      {node.is_producer || node.node_type === 'producer' ?
                      'Producer' :
                      (node.node_type === 'full' || node.is_producer === false) ?
                      'Full' : node.node_type || 'Unknown'}
                    </td>
                    <td>
                      {node.location && node.location.name ?
                      node.location.name + ', ' + node.location.country :
                      'Unknown Location'}
                    </td>
                    <td>
                      {node.api_endpoint ?
                        <a href={`${node.api_endpoint}/v1/chain/get_info`} target="_blank">
                          {node.api_endpoint}
                        </a>
                      : '-' }
                    </td>
                    <td>
                      {node.ssl_endpoint ?
                        <a href={`${node.ssl_endpoint}/v1/chain/get_info`} target="_blank">
                          {node.ssl_endpoint}
                        </a>
                      : '-' }
                    </td>
                    <td>
                      {node.p2p_endpoint || '-'}
                    </td>
                  </tr>
                }) }
              </tbody>
            </table>
          }
        </div>

        <div className="has-margin-top">
          {' '}
        </div>
      </section>
    );
  }
}

export default BpDetails
