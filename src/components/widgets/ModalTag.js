import React from 'react';
import ReactModal from 'react-modal';
import _ from 'lodash';

import './ModalTag.css';

ReactModal.setAppElement('#root');

class Modal extends React.Component {
  state = {
    all: this.props.all || ['无标签'],
    selected: this.props.selected || ['无标签']
  };
  componentWillReceiveProps(nextProps) {
    let currAll = this.props.all;
    let currSelected = this.props.selected;
    let nextAll = nextProps.all;
    let nextSelected = nextProps.selected;
    if (currAll !== nextAll || currSelected != nextSelected) {
      this.setState({ all: nextAll, selected: nextSelected });
    }
  }

  render() {
    let {
      isOpen,
      onRequestClose = null,
      title = '选择标签',
      func = null
    } = this.props;

    let all = this.state.all || [];
    let selected = this.state.selected || [];

    let uis =
      all &&
      all.map((tag, index) => {
        let isSelect = _.indexOf(selected, tag) >= 0;
        return (
          <span
            key={index}
            className="d-inline-block bg-primary rounded p-1 mx-2 my-1 tag-item"
          >
            <span
              onClick={() => {
                let isSelect = _.indexOf(selected, tag) >= 0;
                if (isSelect) {
                  let selected2 = _.without(selected, tag);
                  this.setState({ selected: selected2 });
                } else {
                  this.setState({ selected: [...selected, tag] });
                }
              }}
            >
              {tag}
            </span>
            {isSelect && (
              <sup
                className="badge bg-warning rounded-circle deselect"
                onClick={() => {
                  let selected2 = _.without(selected, tag);
                  this.setState({ selected: selected2 });
                }}
              >
                x
              </sup>
            )}
          </span>
        );
      });
    return (
      <ReactModal
        isOpen={isOpen}
        overlayClassName="modalOverlay"
        className="modal-dialog modalContentFull"
        contentLabel={title}
        onRequestClose={onRequestClose}
      >
        <div className="modal-content modal-content-full">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="close" onClick={onRequestClose}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="modal-body media flex-column">
            <div>{uis}</div>
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
              onClick={() => func && func(this.state.selected)}
            >
              <span>确定</span>
            </div>
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default Modal;
