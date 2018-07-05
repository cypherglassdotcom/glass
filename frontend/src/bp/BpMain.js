import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import Level from '../components/Level'
import LevelItem from '../components/LevelItem'
import LevelLeft from '../components/LevelLeft'
import LevelRight from '../components/LevelRight'
import Box from '../components/Box'
import './BpMain.css';
import markerImg from '../assets/pin.png'

class BpMain extends Component {

  render() {
    const Map = ReactMapboxGl({
      accessToken: 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'
    });

    return (
      <section>
        <Box className="NavigatorCg">
          <Level>
            <LevelLeft>
              <LevelItem><p><strong>221</strong> Block Producers</p></LevelItem>
              <LevelItem>
                <div className="field has-addons">
                  <p className="control">
                    <input className="input is-small" type="text" placeholder="Find a Producer" />
                  </p>
                  <p className="control">
                    <button className="button is-small">
                      Search
                    </button>
                  </p>
                </div>
              </LevelItem>
              <LevelItem><strong>Main Location</strong></LevelItem>
              <LevelItem><a>Producer Nodes</a></LevelItem>
              <LevelItem><a>All Nodes</a></LevelItem>
            </LevelLeft>
            <LevelRight>
              <LevelItem><a>Active BPs</a></LevelItem>
              <LevelItem><strong>Top 50</strong></LevelItem>
              <LevelItem><a>Top 100</a></LevelItem>
              <LevelItem><a>All</a></LevelItem>
            </LevelRight>
          </Level>
        </Box>
        <div className="columns">
          <div className="column">
            <Map
              // eslint-disable-next-line
              style="mapbox://styles/leordev/cjj79weva26sv2rn2oq6yz161"
              zoom={[1]}
              center={[0,50]}
              containerStyle={{
                height: 'calc(100vh - 114px)',
                width: "100vw"
              }}>
                <Layer
                  type="symbol"
                  layout={{ "icon-image": "marker-editor" }}
                  id="marker">
                  <Feature coordinates={[0, 0]}/>
                  <Feature coordinates={[-25, -25]}/>
                  <Feature coordinates={[25, 25]}/>
                </Layer>
                <Marker
                  style={{width: 16, height: 10, cursor: 'pointer'}}
                  coordinates={[-0.2416815, 51.5285582]}
                  anchor="bottom">
                  <img src={markerImg} alt="Cypherglass BP" />
                </Marker>
            </Map>
          </div>
        </div>
      </section>
    );
  }
}

export default BpMain
