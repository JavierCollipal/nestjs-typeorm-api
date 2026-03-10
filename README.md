# NestJS TypeORM API

A production-ready NestJS API with TypeORM integration, complete with documentation, tests, and best practices.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Additional Documentation](#additional-documentation)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/JavierCollipal/nestjs-typeorm-api.git
cd nestjs-typeorm-api
```

2. Install dependencies:

```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=nestjs_typeorm_db

# Application Configuration
PORT=3000
NODE_ENV=development
```

3. Create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE nestjs_typeorm_db;

# Exit psql
\q
```

## Running the Application

### Development Mode

Run the application in watch mode (auto-reloads on file changes):

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

### Production Mode

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start:prod
```

### Standard Mode

Run the application without watch mode:

```bash
npm run start
```

## Testing

### Unit Tests

Run all unit tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### End-to-End (E2E) Tests

Run E2E tests:

```bash
npm run test:e2e
```

### Test Coverage

Generate test coverage report:

```bash
npm run test:cov
```

The coverage report will be generated in the `coverage/` directory.

## Project Structure

```
nestjs-typeorm-api/
├── src/
│   ├── app.controller.ts       # Main application controller
│   ├── app.module.ts            # Root module
│   ├── app.service.ts           # Main application service
│   └── main.ts                  # Application entry point
├── test/
│   ├── app.e2e-spec.ts          # E2E tests
│   └── jest-e2e.json            # E2E Jest configuration
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .prettierrc                  # Prettier configuration
├── answers.md                   # Theoretical answers
├── architecture.md              # Architecture analysis
├── eslint.config.mjs            # ESLint configuration
├── nest-cli.json                # Nest CLI configuration
├── package.json                 # Project dependencies
├── README.md                    # This file
├── tsconfig.build.json          # TypeScript build configuration
└── tsconfig.json                # TypeScript configuration
```

## API Documentation

### Health Check Endpoint

**GET** `/`

Returns a simple health check message.

**Response:**

```json
"Hello World!"
```

### Example cURL:

```bash
curl http://localhost:3000
```

## Database Migrations

TypeORM migrations help manage database schema changes:

### Generate a new migration:

```bash
npm run typeorm migration:generate -- -n MigrationName
```

### Run migrations:

```bash
npm run typeorm migration:run
```

### Revert last migration:

```bash
npm run typeorm migration:revert
```

## Additional Documentation

- **[answers.md](./answers.md)** - Theoretical answers and explanations
- **[architecture.md](./architecture.md)** - System architecture analysis and design decisions

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run start` | Run application in standard mode |
| `npm run start:dev` | Run application in watch mode |
| `npm run start:prod` | Run application in production mode |
| `npm run build` | Build the application |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Generate test coverage report |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format code with Prettier |

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # Windows
   pg_ctl status

   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Check database credentials in `.env` file

3. Ensure the database exists:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

If port 3000 is already in use, change the `PORT` value in your `.env` file.

## Technology Stack

- **Framework:** NestJS v11
- **Language:** TypeScript
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Testing:** Jest
- **Code Quality:** ESLint + Prettier

## License

This project is [MIT licensed](LICENSE).

## Support

For questions or issues, please:
- Open an issue on [GitHub](https://github.com/JavierCollipal/nestjs-typeorm-api/issues)
- Check the [NestJS Documentation](https://docs.nestjs.com)
- Review the [TypeORM Documentation](https://typeorm.io)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications.
