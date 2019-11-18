import {
  request,
  requestPost,
  requestPut,
  requestGet,
  requestDelete
} from './_request';

///////////////////////////////////////////////////
// votes functions.
///////////////////////////////////////////////////
export const rdebug = args => {
  return requestPost('/apis/v1/refine/debug', args);
};

export default rdebug;
