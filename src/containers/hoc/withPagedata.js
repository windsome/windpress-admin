import React from 'react';
import { connect } from 'react-redux';
import { update as updatePagedata } from 'modules/pagedata';
import { cachedPagedataSelector } from 'selectors/pagedata';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default (cfg = {}) => {
  let { path } = cfg;

  return WrappedComponent => {
    // ...and returns another component...
    class withPagedata extends React.Component {
      constructor(props) {
        super(props);
        this._updatePagedata = data =>
          this.props.updatePagedata({ path, data });
      }

      render() {
        let { updatePagedata, ...restProps } = this.props;

        return (
          <WrappedComponent
            {...restProps}
            _updatePagedata={this._updatePagedata}
          />
        );
      }
    }
    withPagedata.displayName = `withPagedata(${getDisplayName(
      WrappedComponent
    )})`;

    const currPagedataSelect = state => cachedPagedataSelector(state, path);

    const mapStateToProps = (state, props) => {
      return {
        _pagedata: currPagedataSelect(state, props)
      };
    };
    const mapActionsToProps = {
      updatePagedata
    };

    return connect(mapStateToProps, mapActionsToProps)(withPagedata);
  };
};
