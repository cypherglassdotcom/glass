import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactMapboxGl, { Marker, Popup } from 'react-mapbox-gl'
import BpTopMenu from './BpTopMenu'
import './BpMain.css';
import markerMainImg from '../assets/marker-main.svg'
import markerProducerImg from '../assets/marker-producer.svg'
import markerOtherImg from '../assets/marker-other.svg'
import { listBps, countBps } from '../lib/bpsApi'
import qs from 'query-string'

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
      selectedBp: null,
      hoveredBp: null,
      mapCenter: [0,50],
      mapZoom: [1],
      isLoading: false
    }
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { position: prevPosition, filter: prevFilter } } } = prevProps
    const { match: { params: { position: currentPosition, filter: currentFilter } } } = this.props

    if (prevPosition !== currentPosition || prevFilter !== currentFilter) {
      this.refreshData()
    }
  }

  componentDidMount() {
    const { location } = this.props
    const query = location.search ? qs.parse(location.search) : {}
    this.refreshData(query.search)
  }

  refreshData(search) {
    const { match: {params: { position } }, history, location } = this.props

    if (search)
      history.push(`${location.pathname}?search=${search}`, this.state)

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

  parseBpLocations(bp) {

    const { match: {params: { filter } } } = this.props

    const currentFilter = filter || 'main'

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
                locations.push({...location, type: 'producer'})
              }
            })
        }
        break;

      case 'all':
        // add all nodes
        const { json: { nodes: allNodes } } = bp
        if (allNodes && allNodes.length) {
          allNodes.forEach(node => {
              if (node.location && node.location.latitude && node.location.longitude) {
                locations.push({...node.location,
                  type: node.is_producer || node.node_type === 'producer'
                  ? 'producer' : 'other'})
              }
            })
        }

        // add main location
        const { json: { org: { location: mainLocation } } } = bp
        if (mainLocation && mainLocation.latitude && mainLocation.longitude) {
          locations.push({...mainLocation, type: 'main'})
        }
        break;

      default:
        // add main location
        const { json: { org: { location } } } = bp
        if (location && location.latitude && location.longitude) {
          locations.push({...location, type: 'main'})
        }
    }

    const finalLocations = []

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

      if (newLocation.latitude > 90 ||
        isNaN(newLocation.latitude) || isNaN(newLocation.longitude) ||
        (newLocation.latitude === 0 && newLocation.longitude === 0)) {
        console.error(`BP ${bp.owner} - Invalid Location >>> `, location)
      } else {
        finalLocations.push(newLocation)
      }
    })

    return finalLocations
  }

  renderHoverPopup() {
    const { hoveredBp } = this.state

    if (!hoveredBp)
      return null

    return (
      <Popup
        key={`hoveredbp-${hoveredBp.key}`}
        coordinates={[hoveredBp.lon, hoveredBp.lat]}
        offset={{
          'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
        }}>
        <p>{hoveredBp.bp.owner}</p>
      </Popup>
    )
  }

  renderPopup() {
    const { selectedBp } = this.state

    if (!selectedBp)
      return null

    const { bp: { json: { org } }, name, country } = selectedBp

    const bpTitle = (org && org.candidate_name) || selectedBp.bp.owner

    return (
      <Popup
        key={selectedBp.key}
        coordinates={[selectedBp.lon, selectedBp.lat]}
        offset={{
          'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
        }}>
        <div className="map-popup">
          <div className="map-popup-close">
            <a onClick={()=>this.setState({selectedBp: null})}>
              <i className="fas fa-times"></i>
            </a>
          </div>
          <h1 className="title is-5">{bpTitle}</h1>
          <div className="columns">
            <div className="column img-col">
              {(org && org.branding && org.branding.logo_256 &&
              <img src={org && org.branding && org.branding.logo_256} alt={bpTitle} />) || "No Logo Image" }
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

  renderMarker(key, bp, name, country, lat, lon, type) {
    const coordinates = [lon, lat]

    const markerImg = type === 'main' ? markerMainImg
      : type === 'producer' ? markerProducerImg
      : markerOtherImg

    return (
      <Marker
        key={key}
        onMouseEnter={() => this.setState({hoveredBp: {bp, name, country, lat, lon, key}})}
        onMouseLeave={() => this.setState({hoveredBp: null})}
        onClick={() => this.setState({selectedBp: {bp, name, country, lat, lon, key}, mapCenter: coordinates})}
        anchor="bottom"
        style={{cursor: 'pointer'}}
        coordinates={coordinates}>
        <img src={markerImg} alt={bp.owner} />
      </Marker>
    )
  }

  renderMarkers() {

    const markers = []

    this.state.bps
      .filter(bp => bp.json && bp.json.org && bp.json.nodes)
      .forEach(bp => {
        const locations = this.parseBpLocations(bp)

        locations.forEach((newLocation, index) => {
          const key = `${bp.owner}-${index}`
          markers.push(this.renderMarker(key, bp,
            newLocation.name, newLocation.country,
            newLocation.latitude, newLocation.longitude,
            newLocation.type
          ))
        })
      })

    return markers
  }

  mapKeysInfo() {
    return (
      <div className="box map-keys">
        <ul>
          <li><img src={markerMainImg} alt={"Main Location"} /> Main Location</li>
          <li><img src={markerProducerImg} alt={"Producer Node"} /> Producer Node</li>
          <li><img src={markerOtherImg} alt={"Others Nodes"} /> Others Nodes</li>
        </ul>
      </div>
    )
  }

  unknownBps() {

    const producers = []

    this.state.bps.forEach(bp => {
      if (!bp.json) {
        producers.push(bp)
      } else {
        const locations = this.parseBpLocations(bp)
        if (!locations.length) {
          producers.push(bp)
        }
      }
    })

    return producers.length > 0 ? (
      <div className="box unknown-bps">
        <p><strong className="has-text-danger">Producers Not Located</strong></p>
        <ul>
          {producers.map((bp, index) => (
            <li key={`unknown-bp-${index}`}>
              <Link to={`/bp/${bp.owner}`}>{bp.owner}</Link>
            </li>
          ))}
        </ul>
      </div>
    ) : null
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
        {this.mapKeysInfo()}
        {this.unknownBps()}
        <Map
          // eslint-disable-next-line
          style={MAPBOX_STYLE}
          zoom={mapZoom}
          center={mapCenter}
          containerStyle={MAP_STYLE}>
            {this.renderMarkers()}
            {this.renderHoverPopup()}
            {this.renderPopup()}
        </Map>
      </section>
    );
  }
}

export default BpMain
