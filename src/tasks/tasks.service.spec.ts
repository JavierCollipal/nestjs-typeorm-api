import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      mockRepository.create.mockReturnValue(mockTask);
      mockRepository.save.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockTask);
      expect(result).toEqual(mockTask);
    });

    it('should create a task with custom status and priority', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      };

      const customTask = { ...mockTask, ...createTaskDto };
      mockRepository.create.mockReturnValue(customTask);
      mockRepository.save.mockResolvedValue(customTask);

      const result = await service.create(createTaskDto);

      expect(result.status).toBe(TaskStatus.IN_PROGRESS);
      expect(result.priority).toBe(TaskPriority.HIGH);
    });
  });

  describe('findAll', () => {
    it('should return all tasks without filters', async () => {
      const tasks = [mockTask];
      mockQueryBuilder.getMany.mockResolvedValue(tasks);

      const result = await service.findAll({});

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'task.createdAt',
        'DESC',
      );
      expect(result).toEqual(tasks);
    });

    it('should return tasks filtered by status', async () => {
      const tasks = [mockTask];
      mockQueryBuilder.getMany.mockResolvedValue(tasks);

      const result = await service.findAll({ status: TaskStatus.PENDING });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        { status: TaskStatus.PENDING },
      );
      expect(result).toEqual(tasks);
    });

    it('should return tasks filtered by priority', async () => {
      const tasks = [mockTask];
      mockQueryBuilder.getMany.mockResolvedValue(tasks);

      const result = await service.findAll({ priority: TaskPriority.HIGH });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.priority = :priority',
        { priority: TaskPriority.HIGH },
      );
      expect(result).toEqual(tasks);
    });

    it('should return tasks filtered by both status and priority', async () => {
      const tasks = [mockTask];
      mockQueryBuilder.getMany.mockResolvedValue(tasks);

      const result = await service.findAll({
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledTimes(2);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(mockTask.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Task with ID "non-existent-id" not found',
      );
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
        description: 'Updated Description',
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(mockTask.id, updateTaskDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.title).toBe(updateTaskDto.title);
      expect(result.description).toBe(updateTaskDto.description);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const updateStatusDto: UpdateStatusDto = {
        status: TaskStatus.DONE,
      };

      const updatedTask = { ...mockTask, status: TaskStatus.DONE };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.updateStatus(mockTask.id, updateStatusDto);

      expect(result.status).toBe(TaskStatus.DONE);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateStatus('non-existent-id', { status: TaskStatus.DONE }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.remove.mockResolvedValue(mockTask);

      await service.remove(mockTask.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockTask.id },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
