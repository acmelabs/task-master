import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IWorkLog, defaultValue } from 'app/shared/model/work-log.model';

export const ACTION_TYPES = {
  FETCH_WORKLOG_LIST: 'workLog/FETCH_WORKLOG_LIST',
  FETCH_WORKLOG: 'workLog/FETCH_WORKLOG',
  CREATE_WORKLOG: 'workLog/CREATE_WORKLOG',
  UPDATE_WORKLOG: 'workLog/UPDATE_WORKLOG',
  DELETE_WORKLOG: 'workLog/DELETE_WORKLOG',
  RESET: 'workLog/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IWorkLog>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type WorkLogState = Readonly<typeof initialState>;

// Reducer

export default (state: WorkLogState = initialState, action): WorkLogState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WORKLOG_LIST):
    case REQUEST(ACTION_TYPES.FETCH_WORKLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_WORKLOG):
    case REQUEST(ACTION_TYPES.UPDATE_WORKLOG):
    case REQUEST(ACTION_TYPES.DELETE_WORKLOG):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_WORKLOG_LIST):
    case FAILURE(ACTION_TYPES.FETCH_WORKLOG):
    case FAILURE(ACTION_TYPES.CREATE_WORKLOG):
    case FAILURE(ACTION_TYPES.UPDATE_WORKLOG):
    case FAILURE(ACTION_TYPES.DELETE_WORKLOG):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_WORKLOG_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_WORKLOG):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_WORKLOG):
    case SUCCESS(ACTION_TYPES.UPDATE_WORKLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_WORKLOG):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/work-logs';

// Actions

export const getEntities: ICrudGetAllAction<IWorkLog> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_WORKLOG_LIST,
  payload: axios.get<IWorkLog>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IWorkLog> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_WORKLOG,
    payload: axios.get<IWorkLog>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IWorkLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_WORKLOG,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IWorkLog> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_WORKLOG,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IWorkLog> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_WORKLOG,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
