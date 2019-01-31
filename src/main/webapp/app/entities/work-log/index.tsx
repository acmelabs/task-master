import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import WorkLog from './work-log';
import WorkLogDetail from './work-log-detail';
import WorkLogUpdate from './work-log-update';
import WorkLogDeleteDialog from './work-log-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={WorkLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={WorkLogUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={WorkLogDetail} />
      <ErrorBoundaryRoute path={match.url} component={WorkLog} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={WorkLogDeleteDialog} />
  </>
);

export default Routes;
