import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Project from './project';
import Task from './task';
import Reminder from './reminder';
import TaskItems from './task-items';
import WorkLog from './work-log';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/project`} component={Project} />
      <ErrorBoundaryRoute path={`${match.url}/task`} component={Task} />
      <ErrorBoundaryRoute path={`${match.url}/reminder`} component={Reminder} />
      <ErrorBoundaryRoute path={`${match.url}/task-items`} component={TaskItems} />
      <ErrorBoundaryRoute path={`${match.url}/work-log`} component={WorkLog} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
