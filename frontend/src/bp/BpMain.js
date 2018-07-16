import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import BpTopMenu from './BpTopMenu'
import './BpMain.css';
import markerImg from '../assets/pin.svg'
import { listBps, countBps } from '../lib/bpsApi'

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN
});

const MAPBOX_STYLE = process.env.REACT_APP_MAPBOX_STYLE

const MAP_STYLE = {
  height: 'calc(100vh - 114px)',
  width: "100vw"
}

class BpMain extends Component {

  constructor(props) {
    super(props)
    this.refreshData = this.refreshData.bind(this)
    this.state = {
      bps: [],
      totalBps: 0,
      search: null,
      selectedBp: null,
      mapCenter: [0,50],
      mapZoom: [1]
    }
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { position: prevPosition, filter: prevFilter } } } = prevProps
    const { match: { params: { position: currentPosition, filter: currentFilter } } } = this.props

    if (prevPosition !== currentPosition || prevFilter !== currentFilter) {
      console.log('new position route')
      this.refreshData()
    }
  }

  componentDidMount() {
    this.refreshData()
  }

  refreshData(search) {
    const { match: {params: { position } } } = this.props
    this.setState({isLoading: true, selectedBp: null})

    let limit = 0
    switch (position) {
      case 'abp': limit = 21; break
      case 'top50': limit = 50; break
      case 'top100': limit = 100; break
      case 'all': limit = 9999; break
      default: limit = 50
    }

    listBps(limit, search)
      .then(data => {
        this.setState({bps: data, isLoading: false})
      }).catch(err => {
        alert((err && err.error && err.error.message) || err || 'Uknown error listing bps')
      })

    countBps()
      .then(data => {
        this.setState({totalBps: data})
      }).catch(err => {
        console.error('Fail to get total bps')
      })
  }

  renderPopup() {
    const { selectedBp } = this.state

    if (!selectedBp)
      return null

    console.log(selectedBp)

    const { bp: { json: { org, nodes } }, name, country } = selectedBp

    return (
      <Popup
        key={selectedBp.key}
        coordinates={[selectedBp.lon, selectedBp.lat]}
        offset={{
          'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
        }}>
        <div className="map-popup">
          <h1 className="title is-5">
            {(org && org.candidate_name) || selectedBp.bp.owner}
          </h1>
          <div className="columns">
            <div className="column img-col">
              {(org && org.branding && org.branding.logo_256 &&
              <img src={org && org.branding && org.branding.logo_256} />) || "No Logo Image" }
            </div>
            <div className="column is-two-thirds">
              { name && country && <p>{name}, {country}</p> }
              <p><strong>EOS Account:</strong> {selectedBp.bp.owner}</p>
              {org && org.website &&
                <p>
                  <strong>Website:</strong>
                  {' '}
                  <a href={org.website} target="_blank">
                    {org.website}
                  </a>
                </p>}
              <p className="has-margin-top">
                <Link to={`/bp/${selectedBp.bp.owner}`}>View Details</Link>
              </p>
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  renderMarker(key, bp, name, country, lat, lon) {
    const coordinates = [lon, lat]

    return (
      <Marker
        key={key}
        onClick={() => this.setState({selectedBp: {bp, name, country, lat, lon, key}, mapCenter: coordinates})}
        anchor="bottom"
        style={{cursor: 'pointer'}}
        coordinates={coordinates}>
        <img src={markerImg} alt={bp.owner} />
      </Marker>
    )
  }

  renderMarkers() {

    const { match: {params: { filter } } } = this.props

    const currentFilter = filter || 'main'

    const markers = []

    this.state.bps
      .filter(bp => bp.json && bp.json.org && bp.json.nodes)
      .forEach(bp => {

        const locations = []
        switch(currentFilter) {
          case 'bp':
            // add bp nodes
            const { json: { nodes } } = bp
            if (nodes && nodes.length) {
              nodes.filter(n => n.is_producer || n.node_type === 'producer')
                .map(n => n.location)
                .forEach(location => {
                  if (location && location.latitude && location.longitude) {
                    locations.push(location)
                  }
                })
            }
            break;
          case 'all':
            // add main location
            const { json: { org: { location: mainLocation } } } = bp
            if (mainLocation && mainLocation.latitude && mainLocation.longitude) {
              locations.push(mainLocation)
            }

            // add all nodes
            const { json: { nodes: allNodes } } = bp
            if (allNodes && allNodes.length) {
              allNodes.map(n => n.location)
                .forEach(location => {
                  if (location && location.latitude && location.longitude) {
                    locations.push(location)
                  }
                })
            }
            break;
          default:

            // add main location
            const { json: { org: { location } } } = bp
            if (location && location.latitude && location.longitude) {
              locations.push(location)
            }
        }

        locations.forEach((location, index) => {

          // fix latitude/longitude for wrongly bps data :P
          const newLocation = {
            ...location,
            longitude: Number(location.longitude),
            latitude: Number(location.latitude)
          }
          if (newLocation.latitude > 90) {
            newLocation.latitude = location.longitude
            newLocation.longitude = location.latitude
          }

          if (newLocation.latitude > 90 || isNaN(newLocation.latitude) ||
            isNaN(newLocation.longitude)) {
            console.error(`BP ${bp.owner} - Invalid Location >>> `, location)
          } else {
            const key = `${bp.owner}-${index}`
            markers.push(this.renderMarker(key, bp, newLocation.name, newLocation.country, newLocation.latitude, newLocation.longitude))
          }
        })
      })

    return markers
  }

  render() {
    const { mapCenter, mapZoom, totalBps, bps } = this.state
    const { match } = this.props

    return (
      <section>
        <BpTopMenu
          totalBps={totalBps}
          countBps={bps.length}
          doSearch={this.refreshData}
          position={match.params.position || 'top50' }
          filter={match.params.filter || 'main' } />
        <Map
          // eslint-disable-next-line
          style={MAPBOX_STYLE}
          zoom={mapZoom}
          center={mapCenter}
          containerStyle={MAP_STYLE}>
            {this.renderMarkers()}
            {this.renderPopup()}
        </Map>
      </section>
    );
  }
}

export default BpMain
