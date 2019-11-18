import {
  request,
  requestPost,
  requestPut,
  requestGet,
  requestDelete
} from './_request';

///////////////////////////////////////////////////
// login/logout functions.
///////////////////////////////////////////////////
export const fetchSign = url => {
  return requestPost('/wcapis/v1/get_sign_package', { url });
};
export const loginByCookie = () => {
  return requestPost('/apis/v1/rest/user/login_cookie', {});
};
export const loginByNicename = userdata => {
  return requestPost('/apis/v1/rest/user/login', userdata);
};
export const logout = () => {
  return requestPost('/apis/v1/rest/user/logout', {});
};
export const getSmsCode = userdata => {
  return requestPost('/apis/v1/rest/user/getsms', userdata);
};
export const loginBySmsCheck = userdata => {
  return requestPost('/apis/v1/rest/user/login_checksms', userdata);
};

///////////////////////////////////////////////////
// users functions.
///////////////////////////////////////////////////
export const createUser = args => {
  return requestPost('/apis/v1/rest/users', args);
};
export const updateUser = (id, args) => {
  return requestPut('/apis/v1/rest/users/' + id, args);
};
export const getUser = id => {
  return requestGet('/apis/v1/rest/users/' + id);
};
export const retrieveUsers = (args = '') => {
  return requestGet('/apis/v1/rest/query/users/' + args);
};
export const deleteUser = id => {
  return requestDelete('/apis/v1/rest/users/' + id);
};

///////////////////////////////////////////////////
// shops functions.
///////////////////////////////////////////////////
export const createShop = args => {
  return requestPost('/apis/v1/rest/shops', args);
};
export const updateShop = (id, args) => {
  return requestPut('/apis/v1/rest/shops/' + id, args);
};
export const getShop = id => {
  return requestGet('/apis/v1/rest/shops/' + id);
};
export const retrieveShops = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/shops/' + args);
};
export const deleteShop = id => {
  return requestDelete('/apis/v1/rest/shops/' + id);
};

///////////////////////////////////////////////////
// shops functions.
///////////////////////////////////////////////////
export const createShopManager = args => {
  return requestPost('/apis/v1/rest/shopmanagers', args);
};
export const updateShopManager = (id, args) => {
  return requestPut('/apis/v1/rest/shopmanagers/' + id, args);
};
export const getShopManager = id => {
  return requestGet('/apis/v1/rest/shopmanagers/' + id);
};
export const retrieveShopManagers = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/shopmanagers/' + args);
};
export const deleteShopManager = id => {
  return requestDelete('/apis/v1/rest/shopmanagers/' + id);
};

///////////////////////////////////////////////////
// products functions.
///////////////////////////////////////////////////
export const createProduct = args => {
  return requestPost('/apis/v1/rest/products', args);
};
export const updateProduct = (id, args) => {
  return requestPut('/apis/v1/rest/products/' + id, args);
};
export const getProduct = id => {
  return requestGet('/apis/v1/rest/products/' + id);
};
export const retrieveProducts = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/products/' + args);
};
export const deleteProduct = id => {
  return requestDelete('/apis/v1/rest/products/' + id);
};

///////////////////////////////////////////////////
// seckills functions.
///////////////////////////////////////////////////
export const createSeckill = args => {
  return requestPost('/apis/v1/rest/seckills', args);
};
export const updateSeckill = (id, args) => {
  return requestPut('/apis/v1/rest/seckills/' + id, args);
};
export const getSeckill = id => {
  return requestGet('/apis/v1/rest/seckills/' + id);
};
export const retrieveSeckills = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/seckills/' + args);
};
export const deleteSeckill = id => {
  return requestDelete('/apis/v1/rest/seckills/' + id);
};
export const retrieveProductSeckills = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/seckillproducts/' + args);
};

///////////////////////////////////////////////////
// orders functions.
///////////////////////////////////////////////////
export const createOrder = args => {
  return requestPost('/apis/v1/rest/orders', args);
};
export const updateOrder = (id, args) => {
  return requestPut('/apis/v1/rest/orders/' + id, args);
};
export const getOrder = id => {
  return requestGet('/apis/v1/rest/orders/' + id);
};
export const retrieveOrders = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/orders/' + args);
};
export const deleteOrder = id => {
  return requestDelete('/apis/v1/rest/orders/' + id);
};

///////////////////////////////////////////////////
// settings functions.
///////////////////////////////////////////////////
export const createSetting = args => {
  return requestPost('/apis/v1/rest/settings', args);
};
export const updateSetting = (id, args) => {
  return requestPut('/apis/v1/rest/settings/' + id, args);
};
export const getSetting = id => {
  return requestGet('/apis/v1/rest/settings/' + id);
};
export const retrieveSettings = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/settings/' + args);
};
export const deleteSetting = id => {
  return requestDelete('/apis/v1/rest/settings/' + id);
};
// special settings.
export const getCategory = () => {
  return requestGet('/apis/v1/rest/settings/category');
};
export const getTag = () => {
  return requestGet('/apis/v1/rest/settings/tag');
};
export const getProductType = () => {
  return requestGet('/apis/v1/rest/settings/producttype');
};
export const getIndexPage = () => {
  return requestGet('/apis/v1/rest/settings/indexpage');
};
export const updateIndexPage = args => {
  return requestPut('/apis/v1/rest/settings/indexpage', args);
};

///////////////////////////////////////////////////
// messages functions.
///////////////////////////////////////////////////
export const createMessage = args => {
  return requestPost('/apis/v1/rest/messages', args);
};
export const updateMessage = (id, args) => {
  return requestPut('/apis/v1/rest/messages/' + id, args);
};
export const getMessage = id => {
  return requestGet('/apis/v1/rest/messages/' + id);
};
export const retrieveMessages = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/messages/' + args);
};
export const deleteMessage = id => {
  return requestDelete('/apis/v1/rest/messages/' + id);
};

///////////////////////////////////////////////////
// point/users functions.
///////////////////////////////////////////////////
export const getPointUser = id => {
  return requestGet('/apis/v1/rest/point/users/' + id);
};
export const retrievePointFlows = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/rest/query/point/flows/' + args);
};

///////////////////////////////////////////////////
// payment functions. jssdk apis.
///////////////////////////////////////////////////
export const getPayRequestParams = args => {
  return requestPost('/wcapis/v1/get_pay_request_params', args);
};
export const getSignKey = (args = {}) => {
  return requestPost('/wcapis/v1/get_sign_key', args);
};
export const getMedia = serverId => {
  return requestGet('/wcapis/v1/get_media?mediaId=' + serverId);
};

///////////////////////////////////////////////////
// resource apis.
///////////////////////////////////////////////////
export const createResource = args => {
  return requestPost('/apis/v1/mongo/resource', args);
};
export const updateResource = (id, args) => {
  return requestPut('/apis/v1/mongo/resource/' + id, args);
};
export const getResource = id => {
  return requestGet('/apis/v1/mongo/resource/' + id);
};
export const retrieveResources = (args = '') => {
  // owner=1;page=0;
  return requestGet('/apis/v1/mongo/query/resource/' + args);
};
export const deleteResource = id => {
  return requestDelete('/apis/v1/mongo/resource/' + id);
};
