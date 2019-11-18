import React from 'react';
import { connect } from 'react-redux';
import {
  keyRetrieveResult,
  keyRetrieveInfo,
  keyRetrieveItems
} from 'modules/u_key';
import {
  retrieve as retrieveResources,
  create as createResource,
  remove as removeResource,
  update as updateResource,
  get as getResource
} from 'modules/resource';
import {
  dbSelect,
  createSelect,
  updateSelect,
  removeSelect,
  getSelect,
  retrieveSelect
} from 'selectors/resource';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default (cfg = {}) => {
  return WrappedComponent => {
    // ...and returns another component...
    class withResource extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    withResource.displayName = `withResource(${getDisplayName(
      WrappedComponent
    )})`;

    const mapStateToProps = (state, props) => {
      return {
        dbResource: dbSelect(state, props),
        dataResourceCreate: createSelect(state, props),
        dataResourceUpdate: updateSelect(state, props),
        dataResourceRemove: removeSelect(state, props),
        dataResourceGet: getSelect(state, props),
        dataResourceRetrieve: retrieveSelect(state, props)
      };
    };
    const mapActionsToProps = {
      retrieveResources,
      createResource,
      removeResource,
      updateResource,
      getResource
    };

    return connect(mapStateToProps, mapActionsToProps)(withResource);
  };
};
