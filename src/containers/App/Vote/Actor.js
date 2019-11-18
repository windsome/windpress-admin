import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

import { meSelect } from 'selectors/user';
import { get as getOption, add as hitHeart } from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as getOptionSelect
} from 'selectors/voteOption';
import _key from 'modules/u_key';

import { strError } from './utils';

import './List.css';
let xdebug = window.myDebug('app:vote:Actor');

export class Page extends React.Component {
  state = {};
  constructor() {
    super();
    this.initFetchData = this.initFetchData.bind(this);
  }

  componentDidMount() {
    this.initFetchData(this.props).then(ret => {
      xdebug('initFetchData: ', ret);
    });
  }

  async initFetchData(props) {
    let { match, dbOption, getOption } = props;
    let id = match.params && match.params.id;
    let optionId = match.params && match.params.optionId;
    // get option.
    let item = dbOption && dbOption[optionId];
    if (!item) {
      try {
        item = await getOption(optionId);
        xdebug('initFetchData getOption: ', item);
      } catch (error) {
        xdebug('error! ', error);
        return false;
      }
    }
    if (!item) {
      console.log('error! no product found! id=' + id);
      return false;
    }
    return true;
  }

  render() {
    let { match, dbOption, getOption, hitHeart } = this.props;
    //let id = match.params && match.params.id;
    let optionId = match.params && match.params.optionId;
    // get option.
    let item = dbOption && dbOption[optionId];
    if (!item) {
      return <div>正在加载信息...</div>;
    }

    let { id, desc, reserved1 = 0 } = item;
    let { name, content, phone, images } = desc || {};

    let uiImages =
      images &&
      images.map((item, index) => {
        let url = item && item.url;
        if (url) {
          return (
            <div key={index}>
              <img className="img-fluid" src={url} />
            </div>
          );
        } else {
          return null;
        }
      });

    let doVote = () => {
      hitHeart({ optionId: id })
        .then(ret => {
          toast('投票成功');
        })
        .catch(error => {
          toast(strError(error));
        });
    };

    return (
      <div className="p-3 m-3 bg-user1">
        <div>
          <div className="text-white">{optionId + '号 ' + name}</div>
          <div className="text-white p-2">{'参赛编码: ' + optionId}</div>
          {uiImages}
          <div className="text-white">{content}</div>
        </div>
        <div className="text-center">
          <button className="btn btn-warning" onClick={doVote}>
            我要投票
          </button>
          <p className="text-center text-white">
            票数:<span className="piao">{reserved1}</span>
          </p>
          <ToastContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbOption: dbOptionSelect(state)
});
const mapActionsToProps = {
  push,
  hitHeart
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
