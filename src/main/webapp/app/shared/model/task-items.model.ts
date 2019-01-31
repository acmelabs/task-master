import { ITask } from 'app/shared/model//task.model';

export interface ITaskItems {
  id?: number;
  name?: string;
  task?: ITask;
}

export const defaultValue: Readonly<ITaskItems> = {};
