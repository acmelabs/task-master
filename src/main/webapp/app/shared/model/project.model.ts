import { ITask } from 'app/shared/model//task.model';
import { IUser } from 'app/shared/model/user.model';

export interface IProject {
  id?: number;
  name?: string;
  tasks?: ITask[];
  user?: IUser;
}

export const defaultValue: Readonly<IProject> = {};
