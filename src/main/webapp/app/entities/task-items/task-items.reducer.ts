import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ITaskItems, defaultValue } from 'app/shared/model/task-items.model';

export const ACTION_TYPES = {
  FETCH_TASKITEMS_LIST: 'taskItems/FETCH_TASKITEMS_LIST',
  FETCH_TASKITEMS: 'taskItems/FETCH_TASKITEMS',
  CREATE_TASKITEMS: 'taskItems/CREATE_TASKITEMS',
  UPDATE_TASKITEMS: 'taskItems/UPDATE_TASKITEMS',
  DELETE_TASKITEMS: 'taskItems/DELETE_TASKITEMS',
  RESET: 'taskItems/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ITaskItems>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type TaskItemsState = Readonly<typeof initialState>;

// Reducer

export default (state: TaskItemsState = initialState, action): TaskItemsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_TASKITEMS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_TASKITEMS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_TASKITEMS):
    case REQUEST(ACTION_TYPES.UPDATE_TASKITEMS):
    case REQUEST(ACTION_TYPES.DELETE_TASKITEMS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_TASKITEMS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_TASKITEMS):
    case FAILURE(ACTION_TYPES.CREATE_TASKITEMS):
    case FAILURE(ACTION_TYPES.UPDATE_TASKITEMS):
    case FAILURE(ACTION_TYPES.DELETE_TASKITEMS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKITEMS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_TASKITEMS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_TASKITEMS):
    case SUCCESS(ACTION_TYPES.UPDATE_TASKITEMS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_TASKITEMS):
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

const apiUrl = 'api/task-items';

// Actions

export const getEntities: ICrudGetAllAction<ITaskItems> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_TASKITEMS_LIST,
  payload: axios.get<ITaskItems>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ITaskItems> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_TASKITEMS,
    payload: axios.get<ITaskItems>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ITaskItems> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_TASKITEMS,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ITaskItems> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_TASKITEMS,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ITaskItems> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_TASKITEMS,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
