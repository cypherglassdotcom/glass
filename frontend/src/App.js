import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl'
import Navbar from './layout/Navbar'
import BpMain from './bp/BpMain'
import './App.css';


class App extends Component {

  render() {
    // const mapToken = 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'

    const Map = ReactMapboxGl({
      accessToken: 'pk.eyJ1IjoibGVvcmRldiIsImEiOiJjamo3NHprazEyZzcxM3NvZ29xMTBiOHFrIn0.ZhGU0HpEgKIDyLqNim1Hnw'
    });

    return (
      <div className="App">
        <Navbar />
        <BpMain />
      </div>
    );
  }
}

export default App;
