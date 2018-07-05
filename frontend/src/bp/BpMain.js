import React, { Component } from 'react'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import BpTopMenu from './BpTopMenu'
import './BpMain.css';
import markerImg from '../assets/pin.svg'

const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'
});

const MAPBOX_STYLE = 'mapbox://styles/leordev/cjj79weva26sv2rn2oq6yz161'

const MAP_STYLE = {
  height: 'calc(100vh - 114px)',
  width: "100vw"
}

const DATA = {
  bps: [
    {
      owner: "bitfinexeos1",
      is_active: 1,
      logo: "https://www.bitfinex.com/assets/bfx-stacked.png",
      locations: [
        {
          type: "main",
          name: "British Virgin Islands",
          country: "VG",
          latitude: 18.4206944,
          longitude: -64.6399689
        },
        {
          type: "bp",
          name: "London",
          country: "GB",
          latitude: 51.509865,
          longitude: -0.118092
        },
        {
          type: "fn",
          name: "London",
          country: "GB",
          latitude: 51.509865,
          longitude: -0.118092
        }
      ]
    },
    {
      owner: "eosnewyorkio",
      is_active: 1,
      logo: "https://bp.eosnewyork.io/Logo_256.jpg",
      locations: [
        {
          type: "main",
          name: "Cook Islands",
          country: "CK",
          latitude: -18.857952,
          longitude: -159.785278
        },
        {
          type: "bp",
          name: "primary",
          country: "BR",
          latitude: -23.5505,
          longitude: -46.6333
        }
      ]
    },
    {
      owner: "eoscanadacom",
      is_active: 1,
      logo: "https://cdn2.hubspot.net/hubfs/4518039/eos-canada-logo-square-256px.png",
      locations: [
        {
          type: "main",
          name: "Montreal, Quebec",
          country: "CA",
          latitude: 45.50884,
          longitude: -73.58781
        },
        {
          type: "bp",
          name: "Montreal, Canada",
          country: "Canada",
          latitude: 45.50884,
          longitude: -73.58781
        },
        {
          type: "fn",
          name: "Montreal, Canada",
          country: "Canada",
          latitude: 45.50884,
          longitude: -73.58781
        }
      ]
    },
    {
      owner: "cypherglasss",
      is_active: 1,
      logo: "https://www.cypherglass.com/Cypherglass_symbol_256.png",
      locations: [
        {
          type: "main",
          name: "Missouri",
          country: "US",
          latitude: 39.099722,
          longitude: -94.578333
        },
        {
          type: "bp",
          name: "Kansas City, MO",
          country: "US",
          latitude: 39.099722,
          longitude: -94.578333
        },
        {
          type: "fn",
          name: "Minneapolis, MN",
          country: "US",
          latitude: 44.989618,
          longitude: -93.269376
        }
      ]
    }
  ]
}

class BpMain extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bps: DATA.bps,
      selectedBp: null,
      mapCenter: [0,50]
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
    const { mapCenter } = this.state

    return (
      <section>
        <BpTopMenu />
        <Map
          // eslint-disable-next-line
          style={MAPBOX_STYLE}
          zoom={[1]}
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
