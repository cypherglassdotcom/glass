import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import Navbar from './layout/Navbar'
import './App.css';
import markerImg from './pin.png'

class App extends Component {

  render() {
    // const mapToken = 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'

    const Map = ReactMapboxGl({
      accessToken: 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'
    });

    return (
      <div className="App">
        <Navbar />
        <div className="columns">

          <div className="column is-three-quarters">
            <Map
              style={"mapbox://styles/leordev/cjj79weva26sv2rn2oq6yz161"}
              zoom={[0.5]}
              center={[0,0]}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Layer
                  type="symbol"
                  layout={{ "icon-image": "marker-15" }}
                  id="marker">
                  <Feature coordinates={[0, 0]}/>
                  <Feature coordinates={[-25, -25]}/>
                  <Feature coordinates={[25, 25]}/>
                </Layer>
                <Marker
                  style={{width: 16, height: 10, cursor: 'pointer'}}
                  coordinates={[-0.2416815, 51.5285582]}
                  anchor="bottom">
                  <img src={markerImg}/>
                </Marker>
            </Map>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
