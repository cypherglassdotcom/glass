import React, { Component } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import BpTopMenu from './BpTopMenu'
import './BpMain.css';
import markerImg from '../assets/pin.svg'
import mockData from './BpMain.mock'
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

  componentDidMount() {
    this.refreshData()
  }

  refreshData(search) {
    const { match: {params: { position } } } = this.props
    this.setState({isLoading: true})

    listBps(50, search)
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

    return (
      <Popup
        key={selectedBp.key}
        coordinates={[selectedBp.lon, selectedBp.lat]}
        offset={{
          'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
        }}>
        <h1>{selectedBp.bp.owner}</h1>
      </Popup>
    )
  }

  renderMarker(key, bp, lat, lon) {
    const coordinates = [lon, lat]

    return (
      <Marker
        key={key}
        onClick={() => this.setState({selectedBp: {bp, lat, lon, key}, mapCenter: coordinates})}
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
            break;
          case 'all':
            break;
          default:
            const { json: { org: { location } } } = bp
            if (location && location.latitude && location.longitude) {
              locations.push(location)
            }
        }

        locations.forEach((location, index) => {

          // fix latitude/longitude for wrongly bps data :P
          const newLocation = {...location}
          if (newLocation.latitude > 90) {
            newLocation.latitude = location.longitude
            newLocation.longitude = location.latitude
          }

          if (newLocation.latitude > 90) {
            console.error(`BP ${bp.owner} - Invalid Location >>> `, location)
          } else {
            const key = `${bp.owner}-${index}`
            markers.push(this.renderMarker(key, bp, newLocation.latitude, newLocation.longitude))
          }
        })
      })

    return markers
  }

  render() {
    const { mapCenter, mapZoom, totalBps } = this.state
    const { match } = this.props

    return (
      <section>
        <BpTopMenu
          totalBps={totalBps}
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
