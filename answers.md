# Theoretical Answers

This document contains theoretical answers and explanations related to the project.

## Table of Contents

1. [NestJS Architecture](#nestjs-architecture)
2. [TypeORM Concepts](#typeorm-concepts)
3. [Design Patterns](#design-patterns)
4. [Best Practices](#best-practices)

---

## NestJS Architecture

### Question 1: What is NestJS and why use it?

**Answer:**

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript by default and combines elements of Object-Oriented Programming (OOP), Functional Programming (FP), and Functional Reactive Programming (FRP).

**Key Benefits:**
- **Modular Architecture**: Organizes code into cohesive modules
- **Dependency Injection**: Built-in IoC container for better testability
- **TypeScript Support**: Type safety and better developer experience
- **Decorator-based**: Clean and expressive syntax
- **Framework Agnostic**: Works with Express or Fastify
- **Built-in Support**: Guards, Interceptors, Pipes, and Filters
- **Extensive Ecosystem**: CLI, testing utilities, documentation

### Question 2: Explain the NestJS Module System

**Answer:**

A module is a class annotated with the `@Module()` decorator. Modules organize application structure and manage dependencies.

**Module Metadata:**
- `providers`: Services that can be injected
- `controllers`: Controllers defined in the module
- `imports`: Other modules whose providers are needed
- `exports`: Providers available to other modules

**Example:**
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
```

### Question 3: What are NestJS Controllers?

**Answer:**

Controllers handle incoming requests and return responses to the client. They use decorators to define routes and HTTP methods.

**Key Concepts:**
- Route mapping with `@Controller()` decorator
- HTTP method decorators: `@Get()`, `@Post()`, `@Put()`, `@Delete()`, etc.
- Parameter decorators: `@Param()`, `@Body()`, `@Query()`, etc.
- Request handling and validation

**Example:**
```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
```

### Question 4: What are NestJS Providers and Services?

**Answer:**

Providers are classes that can be injected as dependencies. Services are a specific type of provider that contain business logic.

**Key Characteristics:**
- Annotated with `@Injectable()` decorator
- Can be injected into controllers or other providers
- Singleton by default (one instance per application)
- Encapsulate business logic separate from controllers

**Example:**
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
```

---

## TypeORM Concepts

### Question 5: What is TypeORM?

**Answer:**

TypeORM is an Object-Relational Mapping (ORM) library for TypeScript and JavaScript. It allows developers to work with databases using object-oriented programming instead of writing raw SQL queries.

**Key Features:**
- **Active Record and Data Mapper patterns**
- **Entity management** with decorators
- **Migrations** for database schema versioning
- **Relations** (One-to-One, One-to-Many, Many-to-Many)
- **Query Builder** for complex queries
- **Support for multiple databases**: PostgreSQL, MySQL, SQLite, etc.
- **TypeScript decorators** for defining models

### Question 6: Explain TypeORM Entities

**Answer:**

An entity is a class that maps to a database table. Each instance represents a row in the table.

**Entity Decorators:**
- `@Entity()`: Marks a class as an entity
- `@PrimaryGeneratedColumn()`: Auto-incrementing primary key
- `@Column()`: Maps a property to a table column
- `@CreateDateColumn()`: Automatically set on insertion
- `@UpdateDateColumn()`: Automatically updated on modification

**Example:**
```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Question 7: What are TypeORM Repositories?

**Answer:**

Repositories provide an abstraction layer for working with entities. They contain methods for database operations.

**Common Repository Methods:**
- `find()`: Retrieve multiple records
- `findOne()`: Retrieve a single record
- `save()`: Insert or update a record
- `remove()`: Delete a record
- `create()`: Create a new entity instance (not saved)
- `update()`: Update records matching criteria
- `delete()`: Delete records matching criteria

**Example:**
```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }
}
```

### Question 8: Explain TypeORM Relations

**Answer:**

TypeORM supports various relationship types between entities:

**One-to-One:**
```typescript
@Entity()
export class Profile {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
```

**One-to-Many / Many-to-One:**
```typescript
@Entity()
export class User {
  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}

@Entity()
export class Post {
  @ManyToOne(() => User, user => user.posts)
  user: User;
}
```

**Many-to-Many:**
```typescript
@Entity()
export class Post {
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
```

---

## Design Patterns

### Question 9: What design patterns does NestJS use?

**Answer:**

**Dependency Injection (DI):**
- Inversion of Control (IoC) container
- Constructor-based injection
- Improves testability and modularity

**Module Pattern:**
- Organizes code into cohesive units
- Manages dependencies between modules

**Decorator Pattern:**
- Metadata annotation
- Route definitions, validation, guards, etc.

**Repository Pattern:**
- Abstraction over data access
- Separation of business logic from data access

**Factory Pattern:**
- Dynamic provider creation
- Used in module configuration

**Observer Pattern:**
- EventEmitter for asynchronous events
- Guards, Interceptors, and Filters

### Question 10: What is Dependency Injection and why is it important?

**Answer:**

Dependency Injection is a design pattern where dependencies are provided to a class rather than the class creating them itself.

**Benefits:**
- **Testability**: Easy to mock dependencies in tests
- **Flexibility**: Swap implementations without changing code
- **Maintainability**: Clear dependency graph
- **Loose Coupling**: Classes don't depend on concrete implementations

**Example:**
```typescript
// Without DI (tight coupling)
export class UserController {
  private userService = new UserService(); // Bad
}

// With DI (loose coupling)
export class UserController {
  constructor(private userService: UserService) {} // Good
}
```

---

## Best Practices

### Question 11: What are NestJS best practices?

**Answer:**

**1. Module Organization:**
- Group related functionality into modules
- Keep modules cohesive and focused
- Use feature modules for different domains

**2. Service Layer:**
- Keep controllers thin
- Put business logic in services
- Services should be stateless when possible

**3. Data Transfer Objects (DTOs):**
- Use DTOs for input validation
- Separate DTOs from entities
- Use class-validator for validation

**4. Error Handling:**
- Use NestJS built-in exception filters
- Create custom exceptions when needed
- Handle errors consistently

**5. Configuration:**
- Use ConfigModule for environment variables
- Never commit secrets to version control
- Use .env.example for documentation

**6. Testing:**
- Write unit tests for services
- Write E2E tests for critical flows
- Mock external dependencies

**7. Security:**
- Validate all inputs
- Use parameterized queries (TypeORM does this)
- Implement authentication and authorization
- Use helmet for security headers
- Enable CORS properly

### Question 12: How to handle validation in NestJS?

**Answer:**

Use class-validator with DTOs and the ValidationPipe.

**Step 1: Install packages:**
```bash
npm install class-validator class-transformer
```

**Step 2: Create DTO with validation:**
```typescript
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Step 3: Enable validation globally:**
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

**Step 4: Use DTO in controller:**
```typescript
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

### Question 13: How to implement pagination in NestJS with TypeORM?

**Answer:**

Use TypeORM's `take` and `skip` options with query parameters.

**Example:**
```typescript
// DTO
export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

// Service
async findAll(paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  const skip = (page - 1) * limit;

  const [data, total] = await this.userRepository.findAndCount({
    take: limit,
    skip: skip,
  });

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Controller
@Get()
findAll(@Query() paginationDto: PaginationDto) {
  return this.userService.findAll(paginationDto);
}
```

---

## Additional Questions

### Question 14: What is the difference between `@Inject()` and constructor injection?

**Answer:**

**Constructor Injection (Standard):**
```typescript
constructor(private userService: UserService) {}
```
- Most common approach
- TypeScript metadata handles type resolution
- Clean and concise

**@Inject() Decorator:**
```typescript
constructor(@Inject('USER_SERVICE') private userService: UserService) {}
```
- Used for custom providers with string tokens
- Required when TypeScript can't infer the type
- Useful for non-class providers

### Question 15: How to implement database transactions in TypeORM?

**Answer:**

Use the `@Transaction()` decorator or manual transaction management.

**Method 1: Transaction Decorator:**
```typescript
@Transaction()
async createUserWithProfile(
  userData: CreateUserDto,
  @TransactionManager() manager: EntityManager
) {
  const user = await manager.save(User, userData);
  const profile = await manager.save(Profile, { userId: user.id });
  return { user, profile };
}
```

**Method 2: Manual Transaction:**
```typescript
async createUserWithProfile(userData: CreateUserDto) {
  return this.connection.transaction(async manager => {
    const user = await manager.save(User, userData);
    const profile = await manager.save(Profile, { userId: user.id });
    return { user, profile };
  });
}
```

---

## References

- [NestJS Official Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Last Updated:** 2026-03-09
