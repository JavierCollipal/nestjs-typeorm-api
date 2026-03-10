import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TaskStatus, TaskPriority } from '../src/tasks/entities/task.entity';

describe('TasksController (e2e)', () => {
  let app: INestApplication;
  let createdTaskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Enable validation globally (same as main.ts)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a new task with default values', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task');
          expect(res.body.description).toBe('Test Description');
          expect(res.body.status).toBe(TaskStatus.PENDING);
          expect(res.body.priority).toBe(TaskPriority.MEDIUM);
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
          createdTaskId = res.body.id;
        });
    });

    it('should create a task with custom status and priority', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'High Priority Task',
          description: 'Important task',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.status).toBe(TaskStatus.IN_PROGRESS);
          expect(res.body.priority).toBe(TaskPriority.HIGH);
        });
    });

    it('should return 400 when title is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          description: 'Test Description',
        })
        .expect(400);
    });

    it('should return 400 when description is missing', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
        })
        .expect(400);
    });

    it('should return 400 when title exceeds max length', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'a'.repeat(201),
          description: 'Test Description',
        })
        .expect(400);
    });

    it('should return 400 for invalid status', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          status: 'invalid_status',
        })
        .expect(400);
    });

    it('should return 400 for invalid priority', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
          priority: 'invalid_priority',
        })
        .expect(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return an array of tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should filter tasks by status', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ status: TaskStatus.PENDING })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((task) => {
              expect(task.status).toBe(TaskStatus.PENDING);
            });
          }
        });
    });

    it('should filter tasks by priority', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ priority: TaskPriority.HIGH })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            res.body.forEach((task) => {
              expect(task.priority).toBe(TaskPriority.HIGH);
            });
          }
        });
    });

    it('should filter tasks by both status and priority', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return 400 for invalid status filter', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ status: 'invalid' })
        .expect(400);
    });

    it('should return 400 for invalid priority filter', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .query({ priority: 'invalid' })
        .expect(400);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return a single task', () => {
      return request(app.getHttpServer())
        .get(`/tasks/${createdTaskId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('description');
          expect(res.body).toHaveProperty('status');
          expect(res.body).toHaveProperty('priority');
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .get('/tasks/123e4567-e89b-12d3-a456-426614174999')
        .expect(404);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update a task', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          title: 'Updated Task Title',
          description: 'Updated Description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(createdTaskId);
          expect(res.body.title).toBe('Updated Task Title');
          expect(res.body.description).toBe('Updated Description');
        });
    });

    it('should partially update a task (only title)', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          title: 'Partially Updated Title',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.title).toBe('Partially Updated Title');
        });
    });

    it('should update task status and priority', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.HIGH,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(TaskStatus.IN_PROGRESS);
          expect(res.body.priority).toBe(TaskPriority.HIGH);
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/123e4567-e89b-12d3-a456-426614174999')
        .send({
          title: 'Updated Title',
        })
        .expect(404);
    });

    it('should return 400 for invalid status', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}`)
        .send({
          status: 'invalid_status',
        })
        .expect(400);
    });
  });

  describe('PATCH /tasks/:id/status', () => {
    it('should update task status to in_progress', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/status`)
        .send({
          status: TaskStatus.IN_PROGRESS,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(TaskStatus.IN_PROGRESS);
        });
    });

    it('should update task status to done', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/status`)
        .send({
          status: TaskStatus.DONE,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(TaskStatus.DONE);
        });
    });

    it('should return 400 when status is missing', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/status`)
        .send({})
        .expect(400);
    });

    it('should return 400 for invalid status', () => {
      return request(app.getHttpServer())
        .patch(`/tasks/${createdTaskId}/status`)
        .send({
          status: 'invalid_status',
        })
        .expect(400);
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/123e4567-e89b-12d3-a456-426614174999/status')
        .send({
          status: TaskStatus.DONE,
        })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(204);
    });

    it('should return 404 when deleting non-existent task', () => {
      return request(app.getHttpServer())
        .delete(`/tasks/${createdTaskId}`)
        .expect(404);
    });

    it('should return 404 for invalid UUID', () => {
      return request(app.getHttpServer())
        .delete('/tasks/123e4567-e89b-12d3-a456-426614174999')
        .expect(404);
    });
  });
});
