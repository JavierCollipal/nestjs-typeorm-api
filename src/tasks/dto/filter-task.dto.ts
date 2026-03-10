import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus, TaskPriority } from '../entities/task.entity';

export class FilterTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
