export const _key = args => 'q_' + args;

///////////////////////////////////////////////////
// for UI selections.
///////////////////////////////////////////////////
export const keyRetrieveResult = (dataRetrieve, qs = '') => {
  let key = _key(qs);
  return dataRetrieve && dataRetrieve[key] && dataRetrieve[key].result;
};
export const keyRetrieveInfo = (dataRetrieve, qs = '') => {
  let key = _key(qs);
  let retrieve = dataRetrieve && dataRetrieve[key];
  let { fetching, error, info, result } = retrieve || {};
  let length = result && result.length;
  return { ...(info || {}), length, fetching, error };
};
export const keyRetrieveItems = (db, dataRetrieve, qs = '') => {
  let key = _key(qs);
  let result = dataRetrieve && dataRetrieve[key] && dataRetrieve[key].result;
  let arr =
    db &&
    result &&
    result.map(itemId => {
      return db[itemId];
    });
  return arr;
};

export default _key;
