import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import TaskItems from './task-items';
import TaskItemsDetail from './task-items-detail';
import TaskItemsUpdate from './task-items-update';
import TaskItemsDeleteDialog from './task-items-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TaskItemsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TaskItemsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TaskItemsDetail} />
      <ErrorBoundaryRoute path={match.url} component={TaskItems} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={TaskItemsDeleteDialog} />
  </>
);

export default Routes;
