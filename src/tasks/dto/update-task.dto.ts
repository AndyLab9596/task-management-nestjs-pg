import { TaskStatus } from '../tasks-status.enum';

export class UpdateTaskDto {
  title: string;
  description: string;
  status: TaskStatus;
}
