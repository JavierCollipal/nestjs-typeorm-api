import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class UpdateStatusDto {
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
