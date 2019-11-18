import reduxFormReducer from 'redux-form/es/reducer';

import counter from './counter';
import jssdk from './jssdk';
import pay from './pay';
import position from './position';
import database from './_database';
import pagedata from './pagedata';

export default {
  form: reduxFormReducer,
  counter,
  jssdk,
  pay,
  position,
  database,
  pagedata
};
