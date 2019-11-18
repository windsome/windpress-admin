import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace, goBack } from 'react-router-redux';
import Moment from 'moment';

import Loadable from 'react-loadable';
import Loading from 'components/Loading';
import NotFound from 'components/NotFound';
import { MenuItem, GoBackItem } from 'components/widgets/Menu';
import { BannerCarousel } from '../dp.product';

import { VOTE_STATUS_PUBLISHED } from 'modules/const';
import { meSelect } from 'selectors/user';
import { get as getVote, update as updateVote } from 'modules/vote';
import {
  dbSelect as dbVoteSelect,
  getSelect as getVoteSelect
} from 'selectors/vote';
import { retrieve as retrieveOptions } from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as getOptionSelect,
  retrieveSelect as dataOptionRetrieveSelect
} from 'selectors/voteOption';
import _key from 'modules/u_key';

import './List.css';
let xdebug = window.myDebug('app:vote:index');

class CountDown extends React.Component {
  constructor() {
    super();
    this.intervalId = null;
    this.nextItem = this.nextItem.bind(this);
  }
  state = {
    str: null
  };

  componentDidMount() {
    this.intervalId = setInterval(this.nextItem, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextItem() {
    let { finish } = this.props;
    if (!finish) return null;
    let now = new Date();
    let finishDate = new Date(finish);
    let diff = finishDate.getTime() - now.getTime();

    let str = null;
    //xdebug('finish:', finishDate, ', now:', now, ', diff:', diff);
    if (diff > 0) {
      let duration = Moment.duration(diff);
      str =
        parseInt(duration.asDays()) +
        '天' +
        duration.hours() +
        '时' +
        duration.minutes() +
        '分' +
        duration.seconds() +
        '秒';
    } else {
      str = '过期了';
    }

    if (str != this.state.str) {
      this.setState({ str });
    }
  }
  render() {
    return <span>{this.state.str}</span>;
  }
}

export class Page extends React.Component {
  constructor() {
    super();
    this.initFetchData = this.initFetchData.bind(this);
  }
  state = {
    vote: null,
    editing: null,
    qs: null
  };

  componentDidMount() {
    this.initFetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    let { match: oldMatch } = this.props;
    let { match: newMatch } = nextProps;
    if (oldMatch.id !== newMatch.id) {
      xdebug('me change, we need refetch new data!');
      this.initFetchData(nextProps);
    }
  }

  async initFetchData(props) {
    let { me, match, dbVote, getVote, retrieveOptions } = props;
    let id = match.params && match.params.id;

    // get vote.
    let item = dbVote && dbVote[id];
    if (!item) {
      try {
        item = await getVote(id);
        xdebug('initFetchData getVote: ', item);
      } catch (error) {
        xdebug('error! ', error);
        return false;
      }
    }
    if (!item) {
      xdebug('error! no vote found! id=' + id);
      return false;
    }
    this.setState({ vote: item });

    // get myself's vote.
    let qsMy = this.getMyQs(match, me);
    if (qsMy) {
      try {
        let myitems = await retrieveOptions(qsMy);
        xdebug('initFetchData get myitem:', myitems);
      } catch (error) {
        xdebug('error! ', error);
      }
    }

    // get voteoptions.
    let qsOptions = this.getQs(match);
    try {
      let items = await retrieveOptions(qsOptions);
      xdebug('initFetchData retrieveOptions:', items);
    } catch (error) {
      xdebug('error! ', error);
      return false;
    }
    return true;
  }

  getMyQs(match, me) {
    let id = match && match.params && match.params.id;
    let owner = me && me.id;
    if (owner && id) return 'voteId=' + id + ';owner=' + owner;
    else return null;
  }

  getQs(match, qs) {
    let id = match && match.params && match.params.id;
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

  render() {
    xdebug('render() ', this.props, this.state);
    let {
      push,
      me,
      match,
      dbOption,
      dbVote,
      dataOptionRetrieve,
      retrieveOptions
    } = this.props;
    let { vote } = this.state;
    let id = match && match.params && match.params.id;
    let voteId = id;

    if (!vote) {
      return <div>正在加载信息...</div>;
    }

    let {
      status,
      name,
      owner,
      desc,
      startAt,
      endAt,
      reserved1 = 0,
      reserved2 = 0
    } = vote;
    let { images } = desc || {};

    if (status != VOTE_STATUS_PUBLISHED) {
      return <div>此投票不可用</div>;
    }

    let qsMy = this.getMyQs(match, me);
    let keyMy = _key(qsMy);
    let optionResultMy =
      dataOptionRetrieve[keyMy] && dataOptionRetrieve[keyMy].result;
    let myOptionId = optionResultMy && optionResultMy[0];
    let myOption = dbOption && myOptionId && dbOption[myOptionId];
    let myLink = myOption && '/app/vote/' + id + '/' + myOptionId;

    let startAtString =
      startAt && Moment.parseZone(startAt).format('YYYY-MM-DD HH:mm');
    let didStart = new Date() > startAt || false;

    let qsOptions = this.getQs(match);
    let key = _key(qsOptions);
    console.log('key:', key);
    let optionResult =
      dataOptionRetrieve[key] && dataOptionRetrieve[key].result;

    let doQuery = () => {
      let qs = this.getQs(match, this.state.qs);
      retrieveOptions(qs)
        .then(ret => {
          push('/app/vote/' + voteId + '/query/' + this.state.qs);
        })
        .catch(error => {
          xdebug('error!', error);
        });
    };

    return (
      <div className="product page-cover">
        <div style={{ overflow: 'hidden' }}>
          <BannerCarousel data={images} />
        </div>
        <div className="container bg-user1 text-white small">
          <div className="row p-2 d-flex justify-content-around text-center">
            <div className="col d-inline-block border-0 ">
              <div>
                <i className="fa fa-users" /> 参赛数
              </div>
              <div>{reserved2}</div>
            </div>
            <div className="col d-inline-block border border-top-0 border-bottom-0 border-white">
              <div>
                <i className="fa fa-heart" /> 投票数
              </div>
              <div>{reserved1}</div>
            </div>
            <div className="col d-inline-block border-0">
              {myOption && (
                <div>
                  <Link to={myLink}>
                    <i className="fa fa-hand-pointer-o" /> 查看自己
                  </Link>
                </div>
              )}
              {!myOption && (
                <div>
                  <i className="fa fa-share-alt" aria-hidden="true" /> 分享
                </div>
              )}
              <div>右上角分享</div>
            </div>
          </div>
        </div>
        <div className="p-2 text-center media small">
          <div className="media-body mx-1 p-1 btn justify-content-center bg-danger text-center">
            {myOption && (
              <Link
                className="text-white"
                to={'/app/vote/' + id + '/register/' + myOptionId}
              >
                <i className="fa fa-eraser" />
                <span className="ml-1 h6">修改信息</span>
              </Link>
            )}
            {!myOption && (
              <Link className="text-white" to={'/app/vote/' + id + '/register'}>
                <i className="fa fa-plus-circle" />
                <span className="ml-1 h6">立即报名</span>
              </Link>
            )}
          </div>
          <div className="text-nowrap">
            <div className="mx-1 p-1 d-inline-block btn justify-content-center bg-user1 text-center text-white">
              <Link className="text-white" to={'/app/vote/' + id}>
                <i className="fa fa-users" aria-hidden="true" />
                <span className="ml-1 h6">所有选手</span>
              </Link>
            </div>
            <div className="mx-1 p-1 d-inline-block btn justify-content-center bg-user1 text-center text-white">
              <Link className="text-white" to={'/app/vote/' + id + '/rank'}>
                <i className="fa fa-list-ol" aria-hidden="true" />
                <span className="ml-1 h6">排行榜</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="active-count-down">
            {didStart && (
              <p>
                <i className="fa fa-clock-o" />
                <span> 活动结束倒计时 </span>
                <CountDown finish={endAt} />
              </p>
            )}
            {!didStart && (
              <p className="small">
                <i className="fa fa-clock-o" />
                <span> 未开始！开始时间： </span>
                <span> {startAtString} </span>
              </p>
            )}
          </div>
        </div>
        <div className="text-center p-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="编号或姓名"
              value={this.state.qs || ''}
              onChange={evt => this.setState({ qs: evt.target.value })}
            />
            <button
              className="btn btn-warning input-group-addon"
              onClick={doQuery}
            >
              搜索
            </button>
          </div>
        </div>
        <div>
          <Switch>
            <Route
              exact
              path="/app/vote/:id"
              component={Loadable({
                loader: () => import('./List'),
                loading: Loading
              })}
            />
            <Route
              exact
              path="/app/vote/:id/query/:qs"
              component={Loadable({
                loader: () => import('./List'),
                loading: Loading
              })}
            />
            <Route
              exact
              path="/app/vote/:id/register"
              component={Loadable({
                loader: () => import('./Register'),
                loading: Loading
              })}
            />
            <Route
              exact
              path="/app/vote/:id/register/:optionId"
              component={Loadable({
                loader: () => import('./Register'),
                loading: Loading
              })}
            />
            <Route
              exact
              path="/app/vote/:id/rank"
              component={Loadable({
                loader: () => import('./Rank'),
                loading: Loading
              })}
            />
            <Route
              exact
              path="/app/vote/:id/:optionId"
              component={Loadable({
                loader: () => import('./Actor'),
                loading: Loading
              })}
            />
            <Route component={NotFound} />
          </Switch>
        </div>
        <div style={{ height: 130 }} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    me: meSelect(state, props),
    dbVote: dbVoteSelect(state),
    dbOption: dbOptionSelect(state),
    dataOptionRetrieve: dataOptionRetrieveSelect(state)
  };
};

const mapActionsToProps = {
  push,
  getVote,
  retrieveOptions
};

export default connect(mapStateToProps, mapActionsToProps)(Page);
