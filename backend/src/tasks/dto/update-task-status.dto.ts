import { IsEnum } from 'class-validator';
import { TaskStatus } from './create-task.dto';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  })
  status: TaskStatus;
}
