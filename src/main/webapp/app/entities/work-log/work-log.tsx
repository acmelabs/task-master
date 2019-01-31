import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAllAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities } from './work-log.reducer';
import { IWorkLog } from 'app/shared/model/work-log.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IWorkLogProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class WorkLog extends React.Component<IWorkLogProps> {
  componentDidMount() {
    this.props.getEntities();
  }

  render() {
    const { workLogList, match } = this.props;
    return (
      <div>
        <h2 id="work-log-heading">
          <Translate contentKey="taskMasterApp.workLog.home.title">Work Logs</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="taskMasterApp.workLog.home.createLabel">Create new Work Log</Translate>
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
                  <Translate contentKey="taskMasterApp.workLog.workDate">Work Date</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.workLog.quantity">Quantity</Translate>
                </th>
                <th>
                  <Translate contentKey="taskMasterApp.workLog.task">Task</Translate>
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {workLogList.map((workLog, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${workLog.id}`} color="link" size="sm">
                      {workLog.id}
                    </Button>
                  </td>
                  <td>
                    <TextFormat type="date" value={workLog.workDate} format={APP_LOCAL_DATE_FORMAT} />
                  </td>
                  <td>{workLog.quantity}</td>
                  <td>{workLog.task ? <Link to={`task/${workLog.task.id}`}>{workLog.task.id}</Link> : ''}</td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${workLog.id}`} color="info" size="sm">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${workLog.id}/edit`} color="primary" size="sm">
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${workLog.id}/delete`} color="danger" size="sm">
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

const mapStateToProps = ({ workLog }: IRootState) => ({
  workLogList: workLog.entities
});

const mapDispatchToProps = {
  getEntities
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkLog);
