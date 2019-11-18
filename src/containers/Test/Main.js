import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { increment, decrement } from 'modules/counter';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import counterSelect from 'selectors/counter';
import { Switch, Route, Link } from 'react-router-dom';

import FileInput, { FileInputPreview } from 'components/widgets/FileInput';
import { uploadFileInput, hash$UploadDataURLs } from 'utils/upload';
import { imageFileListScale } from 'utils/imageScale';
import _sleep from 'utils/sleep';
import './App.css';
import logo from './logo.svg';

export class App extends Component {
  static propTypes = {
    counter: PropTypes.number,
    increment: PropTypes.func,
    decrement: PropTypes.func
  };

  state = {
    value: 5,
    imageList2: []
  };

  async asyncIncrement() {
    console.log('asyncIncrement 1');
    await _sleep(20000);
    await this.props.increment({
      value: this.state.value
    });
    console.log('asyncIncrement 2');
  }

  increment = () => {
    this.props.increment({
      value: this.state.value
    });
  };

  decrement = () => {
    this.props.decrement({
      value: this.state.value
    });
  };

  handleRangeChange = e => {
    this.setState({
      value: parseInt(e.target.value, 10)
    });
  };

  async asyncScaleUpload(evt) {
    //let scaledList = await imageFileListScale(evt.target.files);
    //let scaledList = await imageFileListScale(evt.target.files, {maxWidth:800, maxHeight: 800});
    let scaledList = await imageFileListScale(evt.target.files, {
      maxWidth: null,
      maxHeight: null
    });
    console.log('after scale: ', scaledList);
    let uploadResult = await hash$UploadDataURLs({
      dataUrls: scaledList,
      onprogress: progitem => {
        console.log('progress:', progitem);
        var { action, percent } = progitem;
      }
    });
    this.setState({ imageList2: uploadResult });
    console.log('upload result: ', uploadResult);
  }
  removeScaleUpload() {
    this.setState({ imageList2: [] });
  }

  render() {
    const { value, imageList2 } = this.state;
    let imagePreview2 =
      (imageList2 && imageList2.length > 0 && imageList2[0]) || {};
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col">
              <Link to="/">Home</Link>
            </div>
            <div className="col">
              <Link to="/about-us">About</Link>
            </div>
          </div>
        </div>
        <div>
          <h1>{this.props.counter}</h1>
          <p className="App-intro">
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={this.handleRangeChange}
            />
          </p>
          <p>
            <button onClick={this.asyncIncrement.bind(this)}>+ {value}</button>
            <button onClick={this.decrement}>- {value}</button>
          </p>
          <p className="App-intro">{process.env.NODE_ENV}</p>
          <p className="App-intro">
            {'REACT_APP_ENV:' + process.env.REACT_APP_ENV}
          </p>
          <p className="App-intro">
            {'REACT_APP_ENV_PRODUCTION:' + process.env.REACT_APP_ENV_PRODUCTION}
          </p>
          <p className="App-intro">
            {'REACT_APP_ENV_DEVELOPMENT:' +
              process.env.REACT_APP_ENV_DEVELOPMENT}
          </p>
          <p className="App-intro">
            {'REACT_APP_INITIAL_COUNTER:' +
              process.env.REACT_APP_INITIAL_COUNTER}
          </p>
          <div className="bd-example">
            <button type="button" className="btn btn-primary">
              Primary
            </button>{' '}
            <button type="button" className="btn btn-secondary">
              Secondary
            </button>{' '}
            <button type="button" className="btn btn-success">
              Success
            </button>{' '}
            <button type="button" className="btn btn-danger">
              Danger
            </button>{' '}
            <button type="button" className="btn btn-warning">
              Warning
            </button>{' '}
            <button type="button" className="btn btn-info">
              Info
            </button>{' '}
            <button type="button" className="btn btn-light">
              Light
            </button>{' '}
            <button type="button" className="btn btn-dark">
              Dark
            </button>{' '}
          </div>
        </div>
        <div>
          <div>测试分块上传大文件</div>
          <div className="col-4 col-sm-2">
            <FileInputPreview
              onChange={evt => {
                uploadFileInput(evt);
              }}
            />
          </div>
        </div>
        <div>
          <div>测试压缩并上传图片文件</div>
          <div className="col-4 col-sm-2">
            <FileInputPreview
              multiple={true}
              src={imagePreview2.src}
              onChange={this.asyncScaleUpload.bind(this)}
              onRemove={this.removeScaleUpload.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(counterSelect, counter => ({
  counter: counter.value
}));

const mapActionsToProps = {
  increment,
  decrement
};

export default connect(mapStateToProps, mapActionsToProps)(App);
