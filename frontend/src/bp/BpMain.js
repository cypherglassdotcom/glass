import React, { Component } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import BpTopMenu from './BpTopMenu'
import './BpMain.css';
import markerImg from '../assets/pin.svg'
import mockData from './BpMain.mock'

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
    this.state = {
      bps: mockData.bps,
      selectedBp: null,
      mapCenter: [0,50],
      mapZoom: [1]
    }
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

    const markers = []

    this.state.bps.forEach(bp => {
      bp.locations.forEach((location, index) => {
        const key = `${bp.owner}-${index}`
        markers.push(this.renderMarker(key, bp, location.latitude, location.longitude))
      })
    })

    return markers
  }

  render() {
    const { mapCenter, mapZoom } = this.state
    const { match } = this.props

    return (
      <section>
        <BpTopMenu
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
