import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';

import Step0 from './step0';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import Step4 from './step4';
import Step5 from './step5';

export default ({ match }) => {
  return (
    <Switch>
      <Route exact path="/mine/shops/create" component={Step0} />
      <Route exact path={`${match.url}/step1`} component={Step1} />
      <Route exact path={`${match.url}/step2`} component={Step2} />
      <Route exact path={`${match.url}/step3`} component={Step3} />
      <Route exact path={`${match.url}/step4`} component={Step4} />
      <Route exact path={`${match.url}/step5`} component={Step5} />
    </Switch>
  );
};
