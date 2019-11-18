import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import _ from 'lodash';

import { meSelect } from 'selectors/user';
import { retrieve as retrieveOptions } from 'modules/voteOption';
import {
  dbSelect as dbOptionSelect,
  getSelect as getOptionSelect,
  retrieveSelect as dataOptionRetrieveSelect
} from 'selectors/voteOption';
import _key from 'modules/u_key';

import './List.css';
let xdebug = window.myDebug('app:vote:rank:');

export class Page extends React.Component {
  constructor() {
    super();
  }

  getQs(match) {
    let id = match && match.params && match.params.id;
    let qsOptions = 'voteId=' + id + ';order[0][0]=reserved1;order[0][1]=DESC';
    return qsOptions;
  }

  render() {
    let { match, dbOption, dataOptionRetrieve } = this.props;
    let voteId = match && match.params && match.params.id;

    let qsOptions = this.getQs(match);
    let key = _key(qsOptions);
    let optionResult =
      dataOptionRetrieve[key] && dataOptionRetrieve[key].result;

    if (!dbOption || !optionResult) {
      return null;
    }

    let top20 = optionResult && optionResult.slice(0, 20);

    let uiDatas =
      top20 &&
      top20.map((itemId, index) => {
        let item = dbOption && dbOption[itemId];
        if (!item) {
          return null;
        }

        let actorLink = '/app/vote/' + voteId + '/' + item.id;
        let { desc, reserved1 } = item || {};
        let { images, name, phone, content } = desc || {};
        let data = { actorLink, images, name, phone, content };

        return (
          <tr key={index}>
            <th scope="row">
              <Link to={actorLink}>{index + 1}</Link>
            </th>
            <td>
              <Link to={actorLink}>{name}</Link>
            </td>
            <td>{reserved1}</td>
          </tr>
        );
      });

    return (
      <div className="p-3 m-3">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">
                <i className="fa fa-list-ol" /> 排名
              </th>
              <th scope="col">
                <i className="fa fa-user" /> 姓名
              </th>
              <th scope="col">
                <i className="fa fa-heart" /> 票数
              </th>
            </tr>
          </thead>
          <tbody>{uiDatas}</tbody>
        </table>
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
  push
};
export default connect(mapStateToProps, mapActionsToProps)(Page);
