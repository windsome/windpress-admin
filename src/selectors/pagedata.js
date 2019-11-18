import createCachedSelector from 're-reselect';
const pagedataSelect = state => state.pagedata;
export const cachedPagedataSelector = createCachedSelector(
  pagedataSelect,
  (state, path) => path,
  (pagedata, path) => {
    return pagedata && pagedata[path];
  }
)((state, path) => path);
