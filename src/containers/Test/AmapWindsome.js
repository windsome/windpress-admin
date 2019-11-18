import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import { loadMap } from '../../utils/amap/api';
import Map from '../../utils/amap/Map';
import Marker from '../../utils/amap/Marker';

export class App extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    loadMap('0325e3d6d69cd56de4980b4f28906fd8').then(AMap => {
      let satellite = new AMap.TileLayer.Satellite();
      let roadNet = new AMap.TileLayer.RoadNet();
      let traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 5 //刷新间隔，默认180s
      });
      this.setState({ AMap, layers: [satellite, roadNet, traffic] });
    });
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div className="bg-white">
        <div className="m-1">
          <span>改Map位置:</span>
          <span onClick={() => this.setState({ center: [116.39, 39.9] })}>
            北京
          </span>
          <span onClick={() => this.setState({ center: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ center: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <div className="m-1">
          <span>改Marker位置:</span>
          <span onClick={() => this.setState({ position: [116.39, 39.9] })}>
            北京
          </span>
          <span onClick={() => this.setState({ position: [115.39, 38.9] })}>
            北京-1
          </span>
          <span onClick={() => this.setState({ position: [114.39, 37.9] })}>
            北京-2
          </span>
        </div>
        <Map
          AMap={this.state.AMap}
          options={{ center: this.state.center, layers: this.state.layers }}
          style={{ width: 700, height: 800 }}
        >
          <Marker
            AMap={this.state.AMap}
            options={{
              icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              position: this.state.position || [116.405467, 39.907761]
            }}
          />
        </Map>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({});

const mapActionsToProps = {
  push
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
