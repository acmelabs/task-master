import { Moment } from 'moment';
import { ITaskItems } from 'app/shared/model//task-items.model';
import { IWorkLog } from 'app/shared/model//work-log.model';
import { IReminder } from 'app/shared/model//reminder.model';
import { IProject } from 'app/shared/model//project.model';

export const enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH'
}

export const enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  COMPLETED = 'COMPLETED'
}

export const enum TaskType {
  REPEATIVE = 'REPEATIVE',
  NON_REPEATIVE = 'NON_REPEATIVE'
}

export const enum QuantityType {
  POMODORO = 'POMODORO',
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
  OTHER = 'OTHER'
}

export interface ITask {
  id?: number;
  taskName?: string;
  priority?: Priority;
  dueDate?: Moment;
  status?: TaskStatus;
  taskType?: TaskType;
  quantityType?: QuantityType;
  estimatedQuantity?: number;
  note?: string;
  order?: number;
  taskItems?: ITaskItems[];
  workLogs?: IWorkLog[];
  reminder?: IReminder;
  project?: IProject;
}

export const defaultValue: Readonly<ITask> = {};
