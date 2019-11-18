import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import withResource from '../hoc/withResource';

import Editor from 'components/editor';
import './NewsEditor.css';

import { meSelect } from 'selectors/user';

const WrappedEditor = withResource()(Editor);

export class App extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    rawContent: null
  };

  handleRangeChange = e => {
    this.setState({
      value: parseInt(e.target.value, 10)
    });
  };

  render() {
    const { rawContent } = this.state;

    return (
      <div className="bg-white">
        <h1 className="title">
          <textarea
            maxLength="20"
            placeholder="标题"
            rows="1"
            style={{ height: 37 }}
          />
        </h1>
        <WrappedEditor />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props)
});

const mapActionsToProps = {
  push
};

export default connect(mapStateToProps, mapActionsToProps)(App);
