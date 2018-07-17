import React, { Component } from 'react'
import Box from '../components/Box'
import { getBp } from '../lib/bpsApi'
import SocialButton from '../components/SocialButton'
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

  renderSocial(social) {
    if (!social)
      return null

    return (
      <div>
        <p><strong>Social Media:</strong></p>
        <p className="buttons">
          {social.telegram && <SocialButton type='telegram' handle={social.telegram} />}
          {social.steemit && <SocialButton type='steemit' handle={social.steemit} />}
          {social.twitter && <SocialButton type='twitter' handle={social.twitter} />}
          {social.youtube && <SocialButton type='youtube' handle={social.youtube} />}
          {social.github && <SocialButton type='github' handle={social.github} />}
          {social.facebook && <SocialButton type='facebook' handle={social.facebook} />}
          {social.reddit && <SocialButton type='reddit' handle={social.reddit} />}
          {social.keybase && <SocialButton type='keybase' handle={social.keybase} />}
          {social.wechat && <SocialButton type='wechat' handle={social.wechat} />}
          {!social.telegram && !social.facebook && !social.twitter && !social.youtube &&
            !social.github && !social.steemit && !social.reddit && !social.keybase && !social.wechat ?
            'No Social Media presence' : null}
        </p>
      </div>
    )
  }

  render() {
    const { match: {params: { account }} } = this.props
    const { bpData } = this.state
    const { json } = bpData

    console.log('this is json', json)

    const { org, nodes } = json || {}

    const lastUpdatedAt = moment(bpData.updatedAt).format('MMMM Do YYYY, h:mm:ss a')

    const bpTitle = (org && org.candidate_name) || account

    console.log(bpTitle)

    return (
      <section className="container has-margin-top">
        <div>
          { org && org.branding && org.branding.logo_256 &&
            <img className="img-logo" src={org.branding.logo_256} alt={bpTitle} /> }
          <div className="details-header">
            <h1 className="title is-4">{bpTitle}</h1>
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
          : <div>
              <div className="columns">
                <div className="column">
                  {org.location &&
                    <p><strong>Main Location:</strong><br/> {org.location.name}, {org.location.country}</p>}
                  {org.email &&
                    <p><strong>Email:</strong><br/> <a href={`mailto:${org.email}`}>{org.email}</a></p>}
                  {org.website &&
                    <p><strong>Website:</strong><br/> <a href={org.website} target="_blank">{org.website}</a></p>}
                </div>
                <div className="column">
                  {org.code_of_conduct &&
                    <p><strong>Code of Conduct:</strong><br/> <a href={org.code_of_conduct} target="_blank">{org.code_of_conduct}</a></p>}
                  {org.ownership_disclosure &&
                    <p><strong>Ownership Disclosure:</strong><br/> <a href={org.ownership_disclosure} target="_blank">{org.ownership_disclosure}</a></p>}
                  {this.renderSocial(org.social)}
                </div>
              </div>
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
