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
export const createVote = args => {
  return requestPost('/apis/v1/rest/votes', args);
};
export const updateVote = (id, args) => {
  return requestPut('/apis/v1/rest/votes/' + id, args);
};
export const getVote = id => {
  return requestGet('/apis/v1/rest/votes/' + id);
};
export const retrieveVotes = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/votes/' + args);
};
export const deleteVote = id => {
  return requestDelete('/apis/v1/rest/votes/' + id);
};

///////////////////////////////////////////////////
// voteoptions functions.
///////////////////////////////////////////////////
export const createOption = args => {
  return requestPost('/apis/v1/rest/voteoptions', args);
};
export const updateOption = (id, args) => {
  return requestPut('/apis/v1/rest/voteoptions/' + id, args);
};
export const getOption = id => {
  return requestGet('/apis/v1/rest/voteoptions/' + id);
};
export const retrieveOptions = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/voteoptions/' + args);
};
export const deleteOption = id => {
  return requestDelete('/apis/v1/rest/voteoptions/' + id);
};

///////////////////////////////////////////////////
// voterecords functions.
///////////////////////////////////////////////////
export const createRecord = args => {
  return requestPost('/apis/v1/rest/voterecords', args);
};
