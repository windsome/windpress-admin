import React, { Component, PropTypes } from 'react';
import Cropper from '../Cropper';

export class CropperDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: null
    };
  }

  render() {
    var dataurl = this.state.canvas && this.state.canvas.toDataURL();
    //console.log ("canvas:", this.state.canvas, ", dataurl:", dataurl);
    return (
      <div>
        <Cropper
          src="/ysj/images/slide1.jpg"
          style={{ maxWidth: 840, float: 'left' }}
          getCanvas={e => this.setState({ canvas: e })}
        />
        <div style={{ float: 'left', margin: 10, border: '2px solid #ff8400' }}>
          <img src={dataurl} />
        </div>
      </div>
    );
  }
}

export default CropperDemo;
