import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './work-log.reducer';
import { IWorkLog } from 'app/shared/model/work-log.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWorkLogDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class WorkLogDetail extends React.Component<IWorkLogDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { workLogEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="taskMasterApp.workLog.detail.title">WorkLog</Translate> [<b>{workLogEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="workDate">
                <Translate contentKey="taskMasterApp.workLog.workDate">Work Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={workLogEntity.workDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="quantity">
                <Translate contentKey="taskMasterApp.workLog.quantity">Quantity</Translate>
              </span>
            </dt>
            <dd>{workLogEntity.quantity}</dd>
            <dt>
              <Translate contentKey="taskMasterApp.workLog.task">Task</Translate>
            </dt>
            <dd>{workLogEntity.task ? workLogEntity.task.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/work-log" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/work-log/${workLogEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ workLog }: IRootState) => ({
  workLogEntity: workLog.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLogDetail);
