import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

import { meSelect } from 'selectors/user';
import {
  retrieve as retrieveOptions,
  add as hitHeart
} from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as getOptionSelect,
  retrieveSelect as dataOptionRetrieveSelect
} from 'selectors/voteOption';
import _key from 'modules/u_key';

import { strError } from './utils';

import './List.css';
let xdebug = window.myDebug('app:vote:List');

const Participant = ({ data, doVote }) => {
  let { id, actorLink = '/app/vote', images, name, content, reserved1 = 0 } =
    data || {};
  let coverImage = (images && images[0] && images[0].url) || '/ysj/vote/1.jpg';
  return (
    <div className="participant">
      <span className="user-number py-0 px-2 text-white">{id + '号'}</span>
      <Link
        className="user-img d-flex align-items-center justify-content-center"
        to={actorLink}
      >
        <img className="img-fluid" src={coverImage} />
      </Link>
      <div className="text-center bg-user1">
        <div className="text-white">
          <i className="fa fa-user" aria-hidden="true" /> {name}
        </div>
        <div className="info-bottom">
          <div className="px-2">
            <button className="btn btn-warning btn-block p-0" onClick={doVote}>
              <i className="fa fa-thumbs-up" aria-hidden="true" /> 投票
            </button>
          </div>
          <div className="text-white">
            <span className="piao">{reserved1}</span>票
          </div>
        </div>
      </div>
    </div>
  );
};

export class Page extends React.Component {
  constructor() {
    super();
    this.pageNext = this.pageNext.bind(this);
    this.pagePrev = this.pagePrev.bind(this);
    this.pageRefresh = this.pageRefresh.bind(this);
  }
  state = {};
  getQs(match) {
    let id = match && match.params && match.params.id;
    let qs = match && match.params && match.params.qs;
    if (qs) {
      return (
        'fuzzy[desc]=' +
        qs +
        ';voteId=' +
        id +
        ';order[0][0]=reserved1;order[0][1]=DESC'
      );
    } else return 'voteId=' + id + ';order[0][0]=reserved1;order[0][1]=DESC';
  }

  pageNext() {
    let { match, dataOptionRetrieve, retrieveOptions } = this.props;
    let qsOptions = this.getQs(match);
    let key = _key(qsOptions);
    if (!dataOptionRetrieve || !dataOptionRetrieve[key]) {
      return;
    }

    let optionInfo = dataOptionRetrieve[key].info;
    let optionInfoTotal = optionInfo && optionInfo.total;
    let optionInfoPage = optionInfo && optionInfo.page;
    let optionInfoCount = optionInfo && optionInfo.count;
    let optionInfoLimit = optionInfo && optionInfo.limit;
    if (optionInfoPage * optionInfoLimit + optionInfoCount >= optionInfoTotal) {
      xdebug('error! no next!');
      return;
    }

    // need fetch next page.
    retrieveOptions(qsOptions, optionInfoPage + 1).then(ret => {
      xdebug('after retrieveOptions: ', optionInfoPage + 1);
    });
  }
  pagePrev() {
    let { match, dataOptionRetrieve, retrieveOptions } = this.props;
    let qsOptions = this.getQs(match);
    let key = _key(qsOptions);
    if (!dataOptionRetrieve || !dataOptionRetrieve[key]) {
      return;
    }

    let optionInfo = dataOptionRetrieve[key].info;
    let optionInfoTotal = optionInfo && optionInfo.total;
    let optionInfoPage = optionInfo && optionInfo.page;
    let optionInfoLimit = optionInfo && optionInfo.limit;
    if (optionInfoPage == 0) {
      xdebug('error! no prev page!');
      return;
    }

    // need fetch next page.
    retrieveOptions(qsOptions, optionInfoPage - 1).then(ret => {
      xdebug('after retrieveOptions: ', optionInfoPage - 1);
    });
  }

  pageRefresh() {
    let { match, dataOptionRetrieve, retrieveOptions } = this.props;
    let qsOptions = this.getQs(match);
    retrieveOptions(qsOptions).then(ret => {
      xdebug('pageRefresh after retrieveOptions: ');
    });
  }

  render() {
    xdebug('render:', this.state, this.props);
    let { match, dbOption, dataOptionRetrieve, hitHeart } = this.props;
    let voteId = match && match.params && match.params.id;

    let qsOptions = this.getQs(match);
    let key = _key(qsOptions);
    let dataRetrieve = dataOptionRetrieve[key];
    let optionResult = dataRetrieve && dataRetrieve.result;
    let optionInfo = dataRetrieve && dataRetrieve.info;

    xdebug('List:match:', match, key);
    if (!dbOption || !optionResult) {
      return null;
    }

    let hasMore =
      optionInfo && optionResult && optionResult.length < optionInfo.total;

    let uiDatas =
      optionResult &&
      optionResult.map((itemId, index) => {
        let item = dbOption && dbOption[itemId];
        if (!item) {
          return null;
        }

        let actorLink = '/app/vote/' + voteId + '/' + item.id;
        let { desc, reserved1 } = item || {};
        let { images, name, phone, content } = desc || {};
        let data = {
          id: itemId,
          actorLink,
          images,
          name,
          phone,
          content,
          reserved1
        };
        let doVote = () => {
          hitHeart({ optionId: itemId, voteId })
            .then(ret => {
              toast('投票成功');
            })
            .catch(error => {
              toast(strError(error));
            });
        };

        return (
          <div key={index} className="col-6 col-sm-3 p-1">
            <Participant data={data} key={index} doVote={doVote} />
          </div>
        );
      });

    return (
      <div className="container-fluid">
        <div>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={this.pageRefresh}
          >
            刷新
          </button>
        </div>
        <div className="row">{uiDatas}</div>
        {hasMore && (
          <div>
            <button
              type="button"
              className="btn btn-primary btn-lg btn-block"
              onClick={this.pageNext}
            >
              <span className="small">加载更多...</span>
            </button>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  me: meSelect(state, props),
  dbOption: dbOptionSelect(state),
  dataOptionRetrieve: dataOptionRetrieveSelect(state)
});
const mapActionsToProps = {
  push,
  hitHeart,
  retrieveOptions
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
