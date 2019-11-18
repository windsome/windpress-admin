import React from 'react';
import ReactModal from 'react-modal';
//ReactModal.setAppElement('#root');

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default (
  cfg = { overlayClassName: 'modalOverlay', className: 'modalContentFull' }
) => {
  return WrappedComponent => {
    // ...and returns another component...
    class withModal extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        let { isOpen, title = '弹出框', onRequestClose } = this.props;
        let overlayClassName = (cfg && cfg.overlayClassName) || 'modalOverlay';
        let className = (cfg && cfg.className) || 'modalContentFull';
        return (
          <ReactModal
            isOpen={isOpen}
            overlayClassName={overlayClassName}
            className={className}
            contentLabel={title}
            onRequestClose={onRequestClose}
          >
            <div
              className="modal-content modal-content-full"
              style={{ overflow: 'scroll' }}
            >
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={onRequestClose}
                >
                  <span aria-hidden="true">&times;</span>
                  <span className="sr-only">Close</span>
                </button>
              </div>
              <div className="modal-body">
                <WrappedComponent {...this.props} />
              </div>
            </div>
          </ReactModal>
        );
      }
    }
    withModal.displayName = `withModal(${getDisplayName(WrappedComponent)})`;
    return withModal;
  };
};
