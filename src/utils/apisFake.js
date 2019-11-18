import { requestGet } from './_request';

///////////////////////////////////////////////////
// match query functions.
///////////////////////////////////////////////////
export const retrieveMatchResults = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/fakeysj/query/' + args);
};
