import { createActions, handleActions } from 'redux-actions';
import { fetchSign } from 'utils/apis';
var xdebug = window.myDebug('app:modules:jssdk');

export const {
  jsapi: { signRequest, signSuccess, signFailure }
} = createActions({
  JSAPI: {
    SIGN_REQUEST: null,
    SIGN_SUCCESS: null,
    SIGN_FAILURE: null
  }
});

export const getSignPkgByUrl = () => {
  let orgurl = window.location.href;
  let url = orgurl.split('#')[0] || 'null';
  return (dispatch, getState) => {
    dispatch(signRequest({ url }));
    return fetchSign(url)
      .then(pkg => {
        if (!pkg) {
          throw new Error('fetchSign() return null!');
        }
        dispatch(signSuccess({ url, pkg }));
        return pkg;
      })
      .catch(error => {
        //console.log('signAndConfigJssdk fail! ', error);
        dispatch(signFailure({ url, error }));
        throw error;
      });
  };
};

const reducer = handleActions(
  {
    JSAPI: {
      SIGN_REQUEST: (state, action) => {
        let original = state.original;
        if (!original) original = action.payload.url;
        let sign = {
          ...state.sign,
          [action.payload.url]: { fetching: true, error: null, pkg: null }
        };
        return { ...state, sign, original };
      },
      SIGN_SUCCESS: (state, action) => {
        let sign = {
          ...state.sign,
          [action.payload.url]: {
            fetching: false,
            error: null,
            pkg: action.payload.pkg
          }
        };
        return { ...state, sign };
      },
      SIGN_FAILURE: (state, action) => {
        let sign = {
          ...state.sign,
          [action.payload.url]: {
            fetching: false,
            error: action.payload.error,
            pkg: null
          }
        };
        return { ...state, sign };
      }
    }
  },
  {
    original: null,
    sign: {}
  }
);

export default reducer;
