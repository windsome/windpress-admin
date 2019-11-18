// actions
export const CALL_PAGE_DATA_UPDATE_METHOD =
  '@@pagedata/CALL_PAGE_DATA_UPDATE_METHOD';
function updateValue(route) {
  return (...args) => ({
    type: CALL_PAGE_DATA_UPDATE_METHOD,
    payload: { route, args }
  });
}

export default updateValue;
