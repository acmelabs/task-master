import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './task-items.reducer';
import { ITaskItems } from 'app/shared/model/task-items.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITaskItemsDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class TaskItemsDetail extends React.Component<ITaskItemsDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { taskItemsEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="taskMasterApp.taskItems.detail.title">TaskItems</Translate> [<b>{taskItemsEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="taskMasterApp.taskItems.name">Name</Translate>
              </span>
            </dt>
            <dd>{taskItemsEntity.name}</dd>
            <dt>
              <Translate contentKey="taskMasterApp.taskItems.task">Task</Translate>
            </dt>
            <dd>{taskItemsEntity.task ? taskItemsEntity.task.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/task-items" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/task-items/${taskItemsEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ taskItems }: IRootState) => ({
  taskItemsEntity: taskItems.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskItemsDetail);
