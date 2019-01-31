import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IReminder } from 'app/shared/model/reminder.model';
import { getEntities as getReminders } from 'app/entities/reminder/reminder.reducer';
import { IProject } from 'app/shared/model/project.model';
import { getEntities as getProjects } from 'app/entities/project/project.reducer';
import { getEntity, updateEntity, createEntity, reset } from './task.reducer';
import { ITask } from 'app/shared/model/task.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITaskUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ITaskUpdateState {
  isNew: boolean;
  reminderId: string;
  projectId: string;
}

export class TaskUpdate extends React.Component<ITaskUpdateProps, ITaskUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      reminderId: '0',
      projectId: '0',
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getReminders();
    this.props.getProjects();
  }

  saveEntity = (event, errors, values) => {
    values.dueDate = new Date(values.dueDate);

    if (errors.length === 0) {
      const { taskEntity } = this.props;
      const entity = {
        ...taskEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/task');
  };

  render() {
    const { taskEntity, reminders, projects, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="taskMasterApp.task.home.createOrEditLabel">
              <Translate contentKey="taskMasterApp.task.home.createOrEditLabel">Create or edit a Task</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : taskEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="task-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="taskNameLabel" for="taskName">
                    <Translate contentKey="taskMasterApp.task.taskName">Task Name</Translate>
                  </Label>
                  <AvField id="task-taskName" type="text" name="taskName" />
                </AvGroup>
                <AvGroup>
                  <Label id="priorityLabel">
                    <Translate contentKey="taskMasterApp.task.priority">Priority</Translate>
                  </Label>
                  <AvInput
                    id="task-priority"
                    type="select"
                    className="form-control"
                    name="priority"
                    value={(!isNew && taskEntity.priority) || 'LOW'}
                  >
                    <option value="LOW">
                      <Translate contentKey="taskMasterApp.Priority.LOW" />
                    </option>
                    <option value="NORMAL">
                      <Translate contentKey="taskMasterApp.Priority.NORMAL" />
                    </option>
                    <option value="HIGH">
                      <Translate contentKey="taskMasterApp.Priority.HIGH" />
                    </option>
                    <option value="VERY_HIGH">
                      <Translate contentKey="taskMasterApp.Priority.VERY_HIGH" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="dueDateLabel" for="dueDate">
                    <Translate contentKey="taskMasterApp.task.dueDate">Due Date</Translate>
                  </Label>
                  <AvInput
                    id="task-dueDate"
                    type="datetime-local"
                    className="form-control"
                    name="dueDate"
                    value={isNew ? null : convertDateTimeFromServer(this.props.taskEntity.dueDate)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="statusLabel">
                    <Translate contentKey="taskMasterApp.task.status">Status</Translate>
                  </Label>
                  <AvInput
                    id="task-status"
                    type="select"
                    className="form-control"
                    name="status"
                    value={(!isNew && taskEntity.status) || 'NOT_STARTED'}
                  >
                    <option value="NOT_STARTED">
                      <Translate contentKey="taskMasterApp.TaskStatus.NOT_STARTED" />
                    </option>
                    <option value="STARTED">
                      <Translate contentKey="taskMasterApp.TaskStatus.STARTED" />
                    </option>
                    <option value="COMPLETED">
                      <Translate contentKey="taskMasterApp.TaskStatus.COMPLETED" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="taskTypeLabel">
                    <Translate contentKey="taskMasterApp.task.taskType">Task Type</Translate>
                  </Label>
                  <AvInput
                    id="task-taskType"
                    type="select"
                    className="form-control"
                    name="taskType"
                    value={(!isNew && taskEntity.taskType) || 'REPEATIVE'}
                  >
                    <option value="REPEATIVE">
                      <Translate contentKey="taskMasterApp.TaskType.REPEATIVE" />
                    </option>
                    <option value="NON_REPEATIVE">
                      <Translate contentKey="taskMasterApp.TaskType.NON_REPEATIVE" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="quantityTypeLabel">
                    <Translate contentKey="taskMasterApp.task.quantityType">Quantity Type</Translate>
                  </Label>
                  <AvInput
                    id="task-quantityType"
                    type="select"
                    className="form-control"
                    name="quantityType"
                    value={(!isNew && taskEntity.quantityType) || 'POMODORO'}
                  >
                    <option value="POMODORO">
                      <Translate contentKey="taskMasterApp.QuantityType.POMODORO" />
                    </option>
                    <option value="MINUTES">
                      <Translate contentKey="taskMasterApp.QuantityType.MINUTES" />
                    </option>
                    <option value="HOURS">
                      <Translate contentKey="taskMasterApp.QuantityType.HOURS" />
                    </option>
                    <option value="OTHER">
                      <Translate contentKey="taskMasterApp.QuantityType.OTHER" />
                    </option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="estimatedQuantityLabel" for="estimatedQuantity">
                    <Translate contentKey="taskMasterApp.task.estimatedQuantity">Estimated Quantity</Translate>
                  </Label>
                  <AvField id="task-estimatedQuantity" type="string" className="form-control" name="estimatedQuantity" />
                </AvGroup>
                <AvGroup>
                  <Label id="noteLabel" for="note">
                    <Translate contentKey="taskMasterApp.task.note">Note</Translate>
                  </Label>
                  <AvField id="task-note" type="text" name="note" />
                </AvGroup>
                <AvGroup>
                  <Label id="orderLabel" for="order">
                    <Translate contentKey="taskMasterApp.task.order">Order</Translate>
                  </Label>
                  <AvField id="task-order" type="string" className="form-control" name="order" />
                </AvGroup>
                <AvGroup>
                  <Label for="project.id">
                    <Translate contentKey="taskMasterApp.task.project">Project</Translate>
                  </Label>
                  <AvInput id="task-project" type="select" className="form-control" name="project.id">
                    <option value="" key="0" />
                    {projects
                      ? projects.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/task" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  reminders: storeState.reminder.entities,
  projects: storeState.project.entities,
  taskEntity: storeState.task.entity,
  loading: storeState.task.loading,
  updating: storeState.task.updating,
  updateSuccess: storeState.task.updateSuccess
});

const mapDispatchToProps = {
  getReminders,
  getProjects,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskUpdate);
