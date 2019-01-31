import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Reminder from './reminder';
import ReminderDetail from './reminder-detail';
import ReminderUpdate from './reminder-update';
import ReminderDeleteDialog from './reminder-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReminderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReminderUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReminderDetail} />
      <ErrorBoundaryRoute path={match.url} component={Reminder} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ReminderDeleteDialog} />
  </>
);

export default Routes;
