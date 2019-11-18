import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import ReactModal from 'react-modal';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Map, Marker } from 'react-amap';
import _ from 'lodash';

const ZoomCtrl = props => {
  const map = props.__map__;
  if (!map) {
    console.log('组件必须作为 Map 的子组件使用');
    return;
  }
  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  return (
    <div className="zoom-ctrl">
      <span onClick={zoomIn}>+</span>
      <span onClick={zoomOut}>-</span>
    </div>
  );
};

export class App extends Component {
  state = {
    isOpen: true,
    mapInstance: null,
    geocoder: null,
    geolocation: null,
    zoom: 13
  };
  constructor() {
    super();
    this.changeAddress = this.changeAddress.bind(this);
    this.initMap();
  }

  initMap() {
    this.mapEvents = {
      created: map => {
        let standard = new window.AMap.TileLayer({
          zooms: [3, 20], //可见级别
          visible: true, //是否可见
          opacity: 1, //透明度
          zIndex: 0 //叠加层级
        });
        let roadNet = new window.AMap.TileLayer.RoadNet();
        let satellite = new window.AMap.TileLayer.Satellite();
        let traffic = new window.AMap.TileLayer.Traffic({
          autoRefresh: true, //是否自动刷新，默认为false
          interval: 180 //刷新间隔，默认180s
        });

        this.setState({
          mapInstance: map,
          standard,
          roadNet,
          satellite,
          traffic
        });
        window.AMap.plugin('AMap.Geocoder', () => {
          let geocoder = new window.AMap.Geocoder({
            //city: "010"//城市，默认：“全国”
          });
          this.setState({ geocoder });
        });
        window.AMap.plugin('AMap.Geolocation', () => {
          let geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 2000, //超过10秒后停止定位，默认：无穷大
            showMarker: true,
            buttonOffset: new window.AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            //zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          });
          //map.addControl(geolocation);
          //geolocation.getCurrentPosition();
          window.AMap.event.addListener(geolocation, 'complete', data => {
            console.log('data:', data);
            //let center = {}
            ///this.setState({center:data.position, gps:data.position});
            this.setState({ center: data.position });
          }); //返回定位信息
          window.AMap.event.addListener(geolocation, 'error', error => {
            console.log('error:', error);
          }); //返回定位出错信息
          this.setState({ geolocation });
          console.log('center:', this.state.center);
          let center = this.state.center;
          if (!center) {
            geolocation.getCurrentPosition();
          }
        });
        //this.showCenter();
      },
      click: mapevt => {
        //console.log('mapevt:', mapevt);
        let gps = mapevt.lnglat;
        this.getAddressByGps(gps)
          .then(retAddr => this.setState({ ...retAddr }))
          .catch(error => {
            console.log('error!', error);
          });
        this.setState({ gps });
      },
      moveend: () => {
        let { mapInstance } = this.state;
        if (!mapInstance) {
          console.log('error! mapInstance is null!');
          return;
        }
        let center = mapInstance.getCenter();
        let zoom = mapInstance.getZoom();
        this.setState({ center, zoom });
        console.log('center:', center, ', zoom:', zoom);
        //this.showCenter();
      }
    };
  }

  initCenter() {
    let { geolocation } = this.state;
    geolocation.getCurrentPosition();
    //this.setState({address, gps, region, center:gps});
  }

  getAddressByGps(gps) {
    return new Promise((resolve, reject) => {
      let { geocoder } = this.state;
      if (!geocoder) {
        reject(new Error('error! geocode is null!'));
      }
      if (!gps) {
        reject(new Error('error! no gps!'));
      }

      let pos = null;
      if (gps.N && gps.Q) pos = [gps.N, gps.Q];
      else if (gps.lng && gps.lat) pos = [gps.lng, gps.lat];
      if (!pos) {
        reject(new Error('error! no pos!'));
      }

      console.log('getAddressByGps:', pos);
      geocoder.getAddress(pos, (status, result) => {
        let errMsg = '';
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息:
          //即，result.regeocode.formattedAddress
          console.log('result:', result, ', status:', status);
          let regeocode = result.regeocode;
          if (regeocode) {
            let address = regeocode.formattedAddress;
            let addressComponent = regeocode.addressComponent;
            let { businessAreas, province, city, district } =
              addressComponent || {};
            let region =
              businessAreas &&
              businessAreas.map(area => {
                return area.name;
              });
            resolve({ address, region, province, city, district });
          } else {
            errMsg = 'no regeocode!';
          }
        } else {
          errMsg = result.info;
        }
        //获取地址失败
        reject(new Error(errMsg));
      });
    });
  }
  changeAddress() {
    let { mapInstance, geocoder, address } = this.state;
    if (!mapInstance) {
      console.log('error! mapInstance is null!');
      return;
    }
    if (!geocoder) {
      console.log('error! geocode is null!');
      return;
    }
    geocoder.getLocation(address, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        //TODO:获得了有效经纬度，可以做一些展示工作
        //比如在获得的经纬度上打上一个Marker
        console.log('status:', status, ', result:', result);
        let geo1 =
          result.geocodes && result.geocodes[0] && result.geocodes[0].location;
        if (geo1) {
          this.getAddressByGps(geo1)
            .then(retAddr => this.setState({ ...retAddr }))
            .catch(error => {
              console.log('error!', error);
            });
          this.setState({ center: geo1, gps: geo1 });
        }
      } else {
        //获取经纬度失败
      }
    });
  }

  componentDidMount() {
    let { address, gps, region } = this.props;
    let nextGps =
      (gps && gps.lng && gps.lat && { ...gps, N: gps.lng, Q: gps.lat }) || null;
    this.setState({ address, gps: nextGps, region, center: nextGps });
  }

  componentWillReceiveProps(nextProps) {
    let { address: currAddress, gps: currGps, region: currRegion } = this.props;
    let { address: nextAddress, gps: nextGps, region: nextRegion } = nextProps;
    if (
      currAddress != nextAddress ||
      currGps != nextGps ||
      currRegion != nextRegion
    ) {
      let nextGps2 =
        (nextGps &&
          nextGps.lng &&
          nextGps.lat && { ...nextGps, N: nextGps.lng, Q: nextGps.lat }) ||
        null;
      this.setState({
        address: nextAddress,
        gps: nextGps2,
        center: nextGps2,
        region: nextRegion
      });
    }
  }

  render() {
    let { onRequestClose = null, title = '标题', func = null } = this.props;

    let {
      address,
      center,
      zoom,
      gps,
      region,
      province,
      city,
      district,

      standard,
      roadNet,
      satellite,
      traffic
    } = this.state;
    let layers = [];

    if (standard) layers = [...layers, standard];
    //if (roadNet) layers = [...layers, roadNet];
    //if (satellite) layers = [...layers, satellite];
    if (traffic) layers = [...layers, traffic];
    let mapAttrs = {};
    if (layers.length > 0) mapAttrs = { ...mapAttrs, layers };

    //console.log('state:', this.state, ', props:', this.props);
    return (
      <div className="bg-white">
        <ReactModal
          isOpen={this.state.isOpen}
          overlayClassName="modalOverlay"
          className="modal-dialog modalContentFull"
          onRequestClose={() => this.setState({ isOpen: !this.state.isOpen })}
        >
          <div className="modal-content modal-content-full">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="close"
                onClick={() => this.setState({ isOpen: !this.state.isOpen })}
              >
                <span aria-hidden="true">&times;</span>
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="modal-body media flex-column">
              <div className="input-group">
                <input
                  type="text"
                  value={address}
                  onChange={evt => {
                    this.setState({ address: evt.target.value });
                  }}
                  className="form-control"
                  placeholder="输入地点进行查找..."
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={this.changeAddress}
                  >
                    查找!
                  </button>
                </span>
              </div>
              <div
                className="media-body"
                style={{ width: '100%', marginTop: 2 }}
              >
                <AutoSizer>
                  {({ height, width }) => (
                    <div style={{ width, height }}>
                      <Map
                        amapkey="0325e3d6d69cd56de4980b4f28906fd8"
                        center={center}
                        zoom={zoom}
                        resizeEnable={true}
                        events={this.mapEvents}
                        {...mapAttrs}
                      >
                        <ZoomCtrl />
                        {gps && <Marker position={gps} />}
                      </Map>
                    </div>
                  )}
                </AutoSizer>
              </div>
            </div>
            <div className="modal-footer">
              <div
                style={{
                  backgroundColor: '#db3652',
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 20,
                  padding: 5
                }}
                onClick={() =>
                  func({ gps, address, region, province, city, district })
                }
              >
                <span>确定</span>
              </div>
            </div>
          </div>
        </ReactModal>
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
