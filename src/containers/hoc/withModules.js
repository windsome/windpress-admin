import React from 'react';
import { connect } from 'react-redux';
import forOwn from 'lodash/forOwn';
import { pascalize } from 'humps';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

/**
  modules: {
    resource: {
      actions: {retrieve, create, remove, update, get},
      selectors: {dbSelect, retrieveSelect, createSelect, removeSelect, updateSelect, getSelect}
    },
    product: {
      actions: {retrieve, create, remove, update, get},
      selectors: {dbSelect, retrieveSelect, createSelect, removeSelect, updateSelect, getSelect}
    },
  }
  调用方法：
  withModules({
    resource: {actions:require('modules/resource'), selectors:require('selectors/resource')},
    product: {...}
  })
 */
export default modules => {
  return WrappedComponent => {
    // ...and returns another component...
    class withModules extends React.Component {
      constructor(props) {
        super(props);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    withModules.displayName = `withModules(${getDisplayName(
      WrappedComponent
    )})`;

    let destActions = {};
    let destSelects = {};
    forOwn(modules, (moduleObj, moduleName) => {
      let pascalizeName = pascalize(moduleName);
      let actions = moduleObj.actions;
      let selectors = moduleObj.selectors;
      if (actions) {
        if (actions.retrieve)
          destActions['retrieve' + pascalizeName] = actions.retrieve;
        if (actions.create)
          destActions['create' + pascalizeName] = actions.create;
        if (actions.remove)
          destActions['remove' + pascalizeName] = actions.remove;
        if (actions.update)
          destActions['update' + pascalizeName] = actions.update;
        if (actions.get) destActions['get' + pascalizeName] = actions.get;
      }
      if (selectors) {
        if (selectors.dbSelect)
          destSelects['db' + pascalizeName] = (state, props) =>
            selectors.dbSelect(state, props);
        if (selectors.retrieveSelect)
          destSelects['data' + pascalizeName + 'Retrieve'] = (state, props) =>
            selectors.retrieveSelect(state, props);
        if (selectors.createSelect)
          destSelects['data' + pascalizeName + 'Create'] = (state, props) =>
            selectors.createSelect(state, props);
        if (selectors.removeSelect)
          destSelects['data' + pascalizeName + 'Remove'] = (state, props) =>
            selectors.removeSelect(state, props);
        if (selectors.updateSelect)
          destSelects['data' + pascalizeName + 'Update'] = (state, props) =>
            selectors.updateSelect(state, props);
        if (selectors.getSelect)
          destSelects['data' + pascalizeName + 'Get'] = (state, props) =>
            selectors.getSelect(state, props);
      }
    });

    const mapActionsToProps = destActions;
    const mapStateToProps = (state, props) => {
      let nextProps = {};
      forOwn(destSelects, (func, funcName) => {
        nextProps[funcName] = func(state, props);
      });
      return nextProps;
    };

    // const mapStateToProps = (state, props) => {
    //   return {
    //     dbResource: dbSelect(state, props),
    //     dataResourceCreate: createSelect(state, props),
    //     dataResourceUpdate: updateSelect(state, props),
    //     dataResourceRemove: removeSelect(state, props),
    //     dataResourceGet: getSelect(state, props),
    //     dataResourceRetrieve: retrieveSelect(state, props)
    //   };
    // };
    // const mapActionsToProps = {
    //   retrieveResources,
    //   createResource,
    //   removeResource,
    //   updateResource,
    //   getResource
    // };

    console.log(
      'mapActionsToProps:',
      mapActionsToProps,
      ', mapStateToProps:',
      mapStateToProps
    );
    return connect(mapStateToProps, mapActionsToProps)(withModules);
  };
};
