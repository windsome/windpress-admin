import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Switch, Route, Link } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import ReactModal from 'react-modal';

import { MenuItem } from 'components/widgets/Menu';
import FileInput from 'components/widgets/FileInput';
import { urlUpLevel } from 'utils/url';

ReactModal.setAppElement('#root');

const SampleModal = ({
  isOpen = true,
  onAfterOpen = null,
  onRequestClose = null,
  closeTimeoutMS = 0,
  style = null,
  contentLabel = '标题'
}) => (
  <ReactModal
    isOpen={isOpen}
    onAfterOpen={onAfterOpen}
    onRequestClose={onRequestClose}
    closeTimeoutMS={closeTimeoutMS}
    style={style}
    contentLabel={contentLabel}
  >
    <h1>Modal Content</h1>
    <p>Etc.</p>
  </ReactModal>
);

const NameEditModal = ({
  isOpen,
  onRequestClose,
  title = '标题',
  data = {}
}) => {
  let field1Name = data.field1Name || '';
  let field1Value = data.field1Value || '';
  let field1Message = data.field1Message || '';
  let field1Action = data.field1Action || '';

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="modalOverlay"
      className="modal-dialog modalContent"
      contentLabel={title}
      onRequestClose={onRequestClose}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          <button type="button" className="close" onClick={onRequestClose}>
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="modal-body">
          <h4>{field1Name}</h4>
          <div className="form-group" id="mallNumberInput">
            <input
              className="form-control"
              pro="input"
              type="text"
              value={field1Value}
              onChange={evt => field1Action(evt.target.value)}
            />
          </div>
          <div> {field1Message} </div>
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
            onClick={onRequestClose}
          >
            <span>确定</span>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export class Page extends React.Component {
  state = {
    isOpen: true
  };

  render() {
    let { match, push, history } = this.props;
    let next = urlUpLevel(match.url) + '/step2';
    return (
      <div>
        <form>
          <div className="h5 text-center m-1">
            您好！我们开始登记您的商户信息吧。
          </div>
          <MenuItem
            icon={null}
            title="机构名称"
            subtitle="韦伯英语"
            subicon="fa fa-angle-down"
            onClick={() => {
              console.log('set english');
              this.setState({ isOpen: !this.state.isOpen });
            }}
          />

          <MenuItem
            icon={null}
            title="地址"
            subtitle="上海市黄浦区建国东路1号"
            subicon="fa fa-angle-down"
            onClick={() => {
              console.log('set english');
            }}
          />
          <MenuItem
            icon={null}
            title="联系电话"
            subtitle="021-68751232-12"
            subicon="fa fa-angle-down"
            onClick={() => {
              console.log('set english');
            }}
          />
          <button
            type="submit"
            className="btn btn-default"
            onClick={evt => {
              evt.preventDefault();
              history.push(next);
            }}
          >
            下一步
          </button>

          <NameEditModal
            isOpen={this.state.isOpen}
            onRequestClose={() => this.setState({ isOpen: false })}
          />
        </form>
      </div>
    );
  }
}

export default connect(null, { push })(Page);
