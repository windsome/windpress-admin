import {
  request,
  requestPost,
  requestPut,
  requestGet,
  requestDelete
} from './_request';

///////////////////////////////////////////////////
// bonus/users functions.
///////////////////////////////////////////////////
export const createBonusUser = args => {
  return requestPost('/apis/v1/rest/bonus/users', args);
};
export const updateBonusUser = (id, args) => {
  return requestPut('/apis/v1/rest/bonus/users/' + id, args);
};
export const getBonusUser = id => {
  return requestGet('/apis/v1/rest/bonus/users/' + id);
};
export const retrieveBonusUsers = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/bonus/users/' + args);
};
export const deleteBonusUser = id => {
  return requestDelete('/apis/v1/rest/bonus/users/' + id);
};
