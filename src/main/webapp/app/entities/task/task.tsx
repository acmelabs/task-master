import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Task extends React.Component<ITaskProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { taskList, match } = this.props;
    return (
      <div>
        <h2 id="task-heading">
          <Translate contentKey="taskMasterApp.task.home.title">Tasks</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="taskMasterApp.task.home.createLabel">Create new Task</Translate>
          </Link>
        </h2>
        <div className="table-responsive">
          <Table responsive>
            <thead>
              <tr>
                <th>
                  <Translate contentKey="global.field.id">ID</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.taskName">Task Name</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.priority">Priority</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.dueDate">Due Date</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.status">Status</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.taskType">Task Type</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.quantityType">Quantity Type</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.estimatedQuantity">Estimated Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.note">Note</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.order">Order</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.task.project">Project</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {taskList.map((task, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${task.id}`} color="link" size="sm">
                      {task.id}
                    </Button>
                  </td>
                  <td>{task.taskName}</td>
                  <td>
                    <Translate contentKey={`taskMasterApp.Priority.${task.priority}`} />
                  </td>
                  <td>
                    <TextFormat type="date" value={task.dueDate} format={APP_DATE_FORMAT} />
                  </td>
                  <td>
                    <Translate contentKey={`taskMasterApp.TaskStatus.${task.status}`} />
                  </td>
                  <td>
                    <Translate contentKey={`taskMasterApp.TaskType.${task.taskType}`} />
                  </td>
                  <td>
                    <Translate contentKey={`taskMasterApp.QuantityType.${task.quantityType}`} />
                  </td>
                  <td>{task.estimatedQuantity}</td>
                  <td>{task.note}</td>
                  <td>{task.order}</td>
                  <td>{task.project ? <Link to={`project/${task.project.id}`}>{task.project.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${task.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${task.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${task.id}/delete`} color="danger" size="sm">
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ task }: IRootState) => ({
  taskList: task.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task);
