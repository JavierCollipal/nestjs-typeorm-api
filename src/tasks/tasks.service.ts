import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from '../common/exceptions/task-not-found.exception';
import { DatabaseException } from '../common/exceptions/database.exception';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  /**
   * Creates a new task
   * @param createTaskDto - Task creation data
   * @returns The created task
   * @throws DatabaseException if database operation fails
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      this.logger.log(`Creating new task: ${createTaskDto.title}`);
      const task = this.taskRepository.create(createTaskDto);
      const savedTask = await this.taskRepository.save(task);
      this.logger.log(`Task created successfully with ID: ${savedTask.id}`);
      return savedTask;
    } catch (error) {
      this.logger.error(
        `Failed to create task: ${createTaskDto.title}`,
        error.stack,
      );
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('task creation', error);
      }
      throw error;
    }
  }

  /**
   * Retrieves all tasks with optional filtering
   * @param filterDto - Filter criteria (status, priority)
   * @returns Array of tasks matching the filter
   * @throws DatabaseException if database query fails
   */
  async findAll(filterDto: FilterTaskDto): Promise<Task[]> {
    try {
      const { status, priority } = filterDto;
      this.logger.log(`Finding tasks with filters: ${JSON.stringify(filterDto)}`);

      const query = this.taskRepository.createQueryBuilder('task');

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (priority) {
        query.andWhere('task.priority = :priority', { priority });
      }

      query.orderBy('task.createdAt', 'DESC');

      const tasks = await query.getMany();
      this.logger.log(`Found ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error.stack);
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('task retrieval', error);
      }
      throw error;
    }
  }

  /**
   * Finds a task by ID
   * @param id - Task UUID
   * @returns The found task
   * @throws TaskNotFoundException if task doesn't exist
   * @throws DatabaseException if database query fails
   */
  async findOne(id: string): Promise<Task> {
    try {
      this.logger.log(`Finding task with ID: ${id}`);
      const task = await this.taskRepository.findOne({ where: { id } });

      if (!task) {
        this.logger.warn(`Task not found with ID: ${id}`);
        throw new TaskNotFoundException(id);
      }

      this.logger.log(`Task found: ${task.title}`);
      return task;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to find task with ID: ${id}`, error.stack);
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('task lookup', error);
      }
      throw error;
    }
  }

  /**
   * Updates a task
   * @param id - Task UUID
   * @param updateTaskDto - Updated task data
   * @returns The updated task
   * @throws TaskNotFoundException if task doesn't exist
   * @throws DatabaseException if database update fails
   */
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      this.logger.log(`Updating task with ID: ${id}`);
      const task = await this.findOne(id);

      Object.assign(task, updateTaskDto);

      const updatedTask = await this.taskRepository.save(task);
      this.logger.log(`Task updated successfully: ${updatedTask.id}`);
      return updatedTask;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update task with ID: ${id}`, error.stack);
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('task update', error);
      }
      throw error;
    }
  }

  /**
   * Updates only the status of a task
   * @param id - Task UUID
   * @param updateStatusDto - New status
   * @returns The updated task
   * @throws TaskNotFoundException if task doesn't exist
   * @throws DatabaseException if database update fails
   */
  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Task> {
    try {
      this.logger.log(
        `Updating task status to ${updateStatusDto.status} for ID: ${id}`,
      );
      const task = await this.findOne(id);

      task.status = updateStatusDto.status;

      const updatedTask = await this.taskRepository.save(task);
      this.logger.log(`Task status updated successfully: ${updatedTask.id}`);
      return updatedTask;
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update status for task with ID: ${id}`,
        error.stack,
      );
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('status update', error);
      }
      throw error;
    }
  }

  /**
   * Deletes a task
   * @param id - Task UUID
   * @throws TaskNotFoundException if task doesn't exist
   * @throws DatabaseException if database deletion fails
   */
  async remove(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting task with ID: ${id}`);
      const task = await this.findOne(id);
      await this.taskRepository.remove(task);
      this.logger.log(`Task deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete task with ID: ${id}`, error.stack);
      if (error instanceof QueryFailedError) {
        throw new DatabaseException('task deletion', error);
      }
      throw error;
    }
  }
}
