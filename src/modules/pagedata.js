import _ from 'lodash';
import { createActions, handleActions } from 'redux-actions';
let xdebug = window.myDebug('app:pagedata');

export const { pagedata: { update, remove } } = createActions({
  PAGEDATA: {
    UPDATE: null,
    REMOVE: null
  }
});

const reducer = handleActions(
  {
    PAGEDATA: {
      UPDATE: (state, action) => {
        let { path, data } = (action && action.payload) || {};
        if (!path) return state;
        let oData = state[path] || {};
        let nData = null;
        if (data) nData = { ...oData, ...data };
        return {
          ...state,
          [path]: nData
        };
      },
      REMOVE: (state, action) => {
        let { path, data } = (action && action.payload) || {};
        if (!path) return state;
        return {
          ...state,
          [path]: null
        };
      }
    }
  },
  {}
);

export default reducer;
