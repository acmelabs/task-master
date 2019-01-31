import { Moment } from 'moment';
import { ITask } from 'app/shared/model//task.model';

export interface IWorkLog {
  id?: number;
  workDate?: Moment;
  quantity?: number;
  task?: ITask;
}

export const defaultValue: Readonly<IWorkLog> = {};
