import { IsInt, IsPositive } from 'class-validator';

export class AssignTaskDto {
  @IsInt({ message: 'taskId must be an integer' })
  @IsPositive({ message: 'taskId must be a positive integer' })
  taskId: number;
}
