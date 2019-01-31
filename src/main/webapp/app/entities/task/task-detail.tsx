import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class TaskDetail extends React.Component<ITaskDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { taskEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="taskMasterApp.task.detail.title">Task</Translate> [<b>{taskEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="taskName">
                <Translate contentKey="taskMasterApp.task.taskName">Task Name</Translate>
              </span>
            </dt>
            <dd>{taskEntity.taskName}</dd>
            <dt>
              <span id="priority">
                <Translate contentKey="taskMasterApp.task.priority">Priority</Translate>
              </span>
            </dt>
            <dd>{taskEntity.priority}</dd>
            <dt>
              <span id="dueDate">
                <Translate contentKey="taskMasterApp.task.dueDate">Due Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={taskEntity.dueDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="status">
                <Translate contentKey="taskMasterApp.task.status">Status</Translate>
              </span>
            </dt>
            <dd>{taskEntity.status}</dd>
            <dt>
              <span id="taskType">
                <Translate contentKey="taskMasterApp.task.taskType">Task Type</Translate>
              </span>
            </dt>
            <dd>{taskEntity.taskType}</dd>
            <dt>
              <span id="quantityType">
                <Translate contentKey="taskMasterApp.task.quantityType">Quantity Type</Translate>
              </span>
            </dt>
            <dd>{taskEntity.quantityType}</dd>
            <dt>
              <span id="estimatedQuantity">
                <Translate contentKey="taskMasterApp.task.estimatedQuantity">Estimated Quantity</Translate>
              </span>
            </dt>
            <dd>{taskEntity.estimatedQuantity}</dd>
            <dt>
              <span id="note">
                <Translate contentKey="taskMasterApp.task.note">Note</Translate>
              </span>
            </dt>
            <dd>{taskEntity.note}</dd>
            <dt>
              <span id="order">
                <Translate contentKey="taskMasterApp.task.order">Order</Translate>
              </span>
            </dt>
            <dd>{taskEntity.order}</dd>
            <dt>
              <Translate contentKey="taskMasterApp.task.project">Project</Translate>
            </dt>
            <dd>{taskEntity.project ? taskEntity.project.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/task" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/task/${taskEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ task }: IRootState) => ({
  taskEntity: task.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskDetail);
