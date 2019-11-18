import { createActions, handleActions } from 'redux-actions';

import { currentLocation } from 'utils/gps';
import { getLocation } from 'utils/jssdk';
//import parseUserAgent from 'utils/userAgent';

var xdebug = window.myDebug('app:modules:position');

let getCurrentLocation = isWechat => {
  let func = null;
  //let ua = parseUserAgent(navigator.userAgent);
  if (isWechat) {
    func = getLocation;
  } else {
    func = currentLocation;
  }
  return func();
};

export const {
  position: { getRequest, getSuccess, getFailure }
} = createActions({
  POSITION: {
    GET_REQUEST: null,
    GET_SUCCESS: null,
    GET_FAILURE: null
  }
});

export const get = (isWechat = false) => {
  return (dispatch, getState) => {
    dispatch(getRequest());
    return getCurrentLocation(isWechat)
      .then(ret => {
        //alert('result:' + JSON.stringify(ret));
        dispatch(getSuccess(ret));
        return ret;
      })
      .catch(error => {
        dispatch(getFailure(error));
        throw error;
      });
  };
};

const reducer = handleActions(
  {
    POSITION: {
      GET_REQUEST: (state, action) => ({
        ...state,
        fetching: true,
        error: null
      }),
      GET_SUCCESS: (state, action) => {
        let { lng, lat } = action.payload;
        return {
          ...state,
          fetching: false,
          error: null,
          lng,
          lat
        };
      },
      GET_FAILURE: (state, action) => ({
        ...state,
        fetching: false,
        error: action.payload
      })
    }
  },
  {
    fetching: false,
    lng: null,
    lat: null,
    error: null
  }
);

export default reducer;
