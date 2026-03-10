import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(filterDto: FilterTaskDto): Promise<Task[]> {
    const { status, priority } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (priority) {
      query.andWhere('task.priority = :priority', { priority });
    }

    query.orderBy('task.createdAt', 'DESC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    Object.assign(task, updateTaskDto);

    return await this.taskRepository.save(task);
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
  ): Promise<Task> {
    const task = await this.findOne(id);

    task.status = updateStatusDto.status;

    return await this.taskRepository.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
