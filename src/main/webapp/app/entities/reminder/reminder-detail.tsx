import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './reminder.reducer';
import { IReminder } from 'app/shared/model/reminder.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReminderDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ReminderDetail extends React.Component<IReminderDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { reminderEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="taskMasterApp.reminder.detail.title">Reminder</Translate> [<b>{reminderEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="reminderDate">
                <Translate contentKey="taskMasterApp.reminder.reminderDate">Reminder Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={reminderEntity.reminderDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <Translate contentKey="taskMasterApp.reminder.task">Task</Translate>
            </dt>
            <dd>{reminderEntity.task ? reminderEntity.task.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/reminder" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/reminder/${reminderEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ reminder }: IRootState) => ({
  reminderEntity: reminder.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReminderDetail);
