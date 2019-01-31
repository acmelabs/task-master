import { Moment } from 'moment';
import { ITask } from 'app/shared/model//task.model';

export interface IReminder {
  id?: number;
  reminderDate?: Moment;
  task?: ITask;
}

export const defaultValue: Readonly<IReminder> = {};
