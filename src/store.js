import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
//import createHistory from 'history/createHashHistory';

import rootReducer from './modules';

//export const history = createHistory();
export const basename = process.env.REACT_APP_BASENAME || '/nodeapp';
export const history = createHistory({ basename });

const initialState = {};
const enhancers = [];
const middleware = [thunk, routerMiddleware(history)];

if (process.env.NODE_ENV === 'development') {
  // dev tools extension.
  const devToolsExtension = window.devToolsExtension;
  if (typeof devToolsExtension === 'function') {
    require('set.prototype.tojson');
    require('map.prototype.tojson');
    enhancers.push(devToolsExtension());
  }
  // redux logger
  const logger = loggerMiddleware({
    collapsed: true,
    duration: true
  });
  middleware.push(logger);
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

const store = createStore(
  combineReducers({ ...rootReducer, router: routerReducer }),
  initialState,
  composedEnhancers
);

export default store;
