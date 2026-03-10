import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTask: Task = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
      };

      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(service.create).toHaveBeenCalledWith(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks = [mockTask];
      const filterDto: FilterTaskDto = {};

      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(tasks);
    });

    it('should return filtered tasks', async () => {
      const tasks = [mockTask];
      const filterDto: FilterTaskDto = {
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
      };

      mockTasksService.findAll.mockResolvedValue(tasks);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      mockTasksService.findOne.mockResolvedValue(mockTask);

      const result = await controller.findOne(mockTask.id);

      expect(service.findOne).toHaveBeenCalledWith(mockTask.id);
      expect(result).toEqual(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Title',
      };

      const updatedTask = { ...mockTask, ...updateTaskDto };
      mockTasksService.update.mockResolvedValue(updatedTask);

      const result = await controller.update(mockTask.id, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(mockTask.id, updateTaskDto);
      expect(result).toEqual(updatedTask);
    });
  });

  describe('updateStatus', () => {
    it('should update task status', async () => {
      const updateStatusDto: UpdateStatusDto = {
        status: TaskStatus.DONE,
      };

      const updatedTask = { ...mockTask, status: TaskStatus.DONE };
      mockTasksService.updateStatus.mockResolvedValue(updatedTask);

      const result = await controller.updateStatus(
        mockTask.id,
        updateStatusDto,
      );

      expect(service.updateStatus).toHaveBeenCalledWith(
        mockTask.id,
        updateStatusDto,
      );
      expect(result).toEqual(updatedTask);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove(mockTask.id);

      expect(service.remove).toHaveBeenCalledWith(mockTask.id);
    });
  });
});
