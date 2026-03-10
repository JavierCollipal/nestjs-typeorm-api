# NestJS TypeORM API

API REST de gestión de tareas con NestJS, TypeORM y PostgreSQL. Lista para producción con manejo de errores profesional, tests y documentación completa.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)
- [Testing](#testing)
- [Documentación de la API](#documentación-de-la-api)
- [Documentación Adicional](#documentación-adicional)

## Requisitos Previos

- **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
- **npm** (viene con Node.js)
- **PostgreSQL** (v14 o superior) - [Descargar](https://www.postgresql.org/download/)
- **Docker** (opcional, recomendado) - [Descargar](https://www.docker.com/)
- **Git** - [Descargar](https://git-scm.com/)

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/JavierCollipal/nestjs-typeorm-api.git
cd nestjs-typeorm-api
```

2. Instalar dependencias:

```bash
npm install
```

## Configuración

### Opción 1: Usando Docker (Recomendado)

La forma más fácil de comenzar es usando Docker para PostgreSQL.

1. Iniciar PostgreSQL con Docker Compose:

```bash
docker-compose up -d
```

Esto iniciará un contenedor PostgreSQL con las siguientes credenciales por defecto:
- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Contraseña: `postgres`
- Base de datos: `nestjs_typeorm_db`

2. Crear archivo `.env` (ya está configurado para Docker):

```bash
cp .env.example .env
```

El archivo `.env` por defecto ya está configurado para trabajar con Docker.

3. Verificar que PostgreSQL está ejecutándose:

```bash
docker ps
```

Deberías ver el contenedor `nestjs-postgres` ejecutándose y saludable.

4. Para detener la base de datos:

```bash
docker-compose down
```

5. Para resetear la base de datos (eliminar todos los datos):

```bash
docker-compose down -v
docker-compose up -d
```

### Opción 2: Usando PostgreSQL Local

Si prefieres usar una instalación local de PostgreSQL:

1. Crear archivo `.env`:

```bash
cp .env.example .env
```

2. Actualizar el archivo `.env` con tus credenciales:

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nestjs_typeorm_db

# Configuración de Aplicación
PORT=3000
NODE_ENV=development
```

3. Crear la base de datos en PostgreSQL:

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE nestjs_typeorm_db;

# Salir de psql
\q
```

## Ejecutar la Aplicación

### Modo Desarrollo

Ejecutar la aplicación en modo watch (recarga automática con cambios):

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`

### Modo Producción

1. Construir la aplicación:

```bash
npm run build
```

2. Iniciar el servidor de producción:

```bash
npm run start:prod
```

### Modo Estándar

Ejecutar la aplicación sin modo watch:

```bash
npm run start
```

## Testing

### Tests Unitarios

Ejecutar todos los tests unitarios:

```bash
npm run test
```

Ejecutar tests en modo watch:

```bash
npm run test:watch
```

### Tests E2E (End-to-End)

Los tests E2E requieren una base de datos PostgreSQL ejecutándose. Asegúrate de iniciar la base de datos primero:

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Ejecutar tests E2E
npm run test:e2e
```

**Resultados de Tests:**
- ✅ 24 tests unitarios (service + controller)
- ✅ 29 tests E2E cubriendo todos los endpoints de la API
- ✅ Validaciones, filtros, manejo de errores y operaciones CRUD
- ✅ Verificado contra base de datos PostgreSQL real

### Cobertura de Tests

Generar reporte de cobertura:

```bash
npm run test:cov
```

El reporte se generará en el directorio `coverage/`.

## Documentación de la API

### Endpoint de Salud

**GET** `/`

Retorna un mensaje simple de salud.

```bash
curl http://localhost:3000
```

---

### API de Tareas

API completa de gestión de tareas con operaciones CRUD, filtros y actualización de estado.

#### Esquema de Entidad Task

```typescript
{
  id: string;           // UUID
  title: string;        // Máximo 200 caracteres
  description: string;  // Texto
  status: 'pending' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}
```

---

#### 1. Crear Tarea

**POST** `/tasks`

Crear una nueva tarea con título y descripción. Estado y prioridad son opcionales (por defecto: `pending` y `medium`).

**Body:**

```json
{
  "title": "Completar documentación del proyecto",
  "description": "Escribir documentación completa de la API",
  "status": "pending",       // Opcional: pending | in_progress | done
  "priority": "high"         // Opcional: low | medium | high
}
```

**Respuesta (201 Created):**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Completar documentación del proyecto",
  "description": "Escribir documentación completa de la API",
  "status": "pending",
  "priority": "high",
  "createdAt": "2026-03-09T10:30:00.000Z",
  "updatedAt": "2026-03-09T10:30:00.000Z"
}
```

**Ejemplo cURL:**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Completar documentación del proyecto",
    "description": "Escribir documentación completa de la API",
    "priority": "high"
  }'
```

---

#### 2. Listar Todas las Tareas (con Filtros)

**GET** `/tasks`

Obtener todas las tareas con filtros opcionales por estado y/o prioridad.

**Parámetros de Query:**

| Parámetro | Tipo | Requerido | Valores |
|-----------|------|-----------|---------|
| status | string | No | `pending`, `in_progress`, `done` |
| priority | string | No | `low`, `medium`, `high` |

**Ejemplos cURL:**

```bash
# Todas las tareas
curl http://localhost:3000/tasks

# Filtrar por estado
curl "http://localhost:3000/tasks?status=pending"

# Filtrar por prioridad
curl "http://localhost:3000/tasks?priority=high"

# Filtrar por ambos
curl "http://localhost:3000/tasks?status=in_progress&priority=high"
```

---

#### 3. Obtener Tarea por ID

**GET** `/tasks/:id`

Obtener una tarea específica por su UUID.

**Ejemplo cURL:**

```bash
curl http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000
```

**Respuesta de Error (404 Not Found):**

```json
{
  "statusCode": 404,
  "message": "Task with ID \"123e4567-e89b-12d3-a456-426614174999\" not found",
  "error": "Not Found"
}
```

---

#### 4. Actualizar Tarea

**PATCH** `/tasks/:id`

Actualizar cualquier campo(s) de una tarea. Todos los campos son opcionales.

**Body (actualización parcial):**

```json
{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "status": "in_progress",
  "priority": "low"
}
```

**Ejemplos cURL:**

```bash
# Actualizar múltiples campos
curl -X PATCH http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título actualizado",
    "status": "in_progress"
  }'

# Actualizar un solo campo
curl -X PATCH http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{"priority": "low"}'
```

---

#### 5. Actualizar Estado de Tarea

**PATCH** `/tasks/:id/status`

Actualizar solo el estado de una tarea. Endpoint dedicado para cambios de estado.

**Body:**

```json
{
  "status": "done"
}
```

**Ejemplos cURL:**

```bash
# Marcar como en progreso
curl -X PATCH http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# Marcar como completada
curl -X PATCH http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

---

#### 6. Eliminar Tarea

**DELETE** `/tasks/:id`

Eliminar permanentemente una tarea.

**Respuesta (204 No Content)**

Cuerpo de respuesta vacío.

**Ejemplo cURL:**

```bash
curl -X DELETE http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000
```

---

### Respuestas de Error

Todos los endpoints retornan respuestas de error consistentes:

**400 Bad Request** - Errores de validación

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "description should not be empty"
  ],
  "error": "Bad Request"
}
```

**404 Not Found** - Recurso no encontrado

```json
{
  "statusCode": 404,
  "message": "Task with ID \"xxx\" not found",
  "error": "Not Found"
}
```

**500 Internal Server Error** - Errores del servidor

```json
{
  "statusCode": 500,
  "message": "Database error during task creation"
}
```

## Estructura del Proyecto

```
nestjs-typeorm-api/
├── src/
│   ├── common/                  # Excepciones personalizadas
│   │   └── exceptions/
│   │       ├── task-not-found.exception.ts
│   │       └── database.exception.ts
│   ├── tasks/                   # Módulo de tareas
│   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── create-task.dto.ts
│   │   │   ├── update-task.dto.ts
│   │   │   ├── filter-task.dto.ts
│   │   │   └── update-status.dto.ts
│   │   ├── entities/            # Entidades TypeORM
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts  # Endpoints de la API
│   │   ├── tasks.service.ts     # Lógica de negocio con try-catch
│   │   └── tasks.module.ts
│   ├── app.module.ts            # Módulo raíz con configuración TypeORM
│   └── main.ts                  # Punto de entrada
├── test/
│   ├── tasks.e2e-spec.ts        # 29 tests E2E
│   └── jest-e2e.json
├── .env                         # Variables de entorno (no en git)
├── .env.example                 # Template de variables de entorno
├── docker-compose.yml           # PostgreSQL Docker
├── answers.md                   # Respuestas teóricas
├── architecture.md              # Análisis de arquitectura
├── ERROR_HANDLING.md            # Guía de manejo de errores
└── VERIFICATION.md              # Reporte de verificación
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start` | Ejecutar aplicación en modo estándar |
| `npm run start:dev` | Ejecutar aplicación en modo watch |
| `npm run start:prod` | Ejecutar aplicación en modo producción |
| `npm run build` | Construir la aplicación |
| `npm run test` | Ejecutar tests unitarios |
| `npm run test:watch` | Ejecutar tests en modo watch |
| `npm run test:cov` | Generar reporte de cobertura |
| `npm run test:e2e` | Ejecutar tests E2E |
| `npm run lint` | Lint del código |
| `npm run format` | Formatear código con Prettier |

## Solución de Problemas

### Problemas de Conexión a Base de Datos

Si encuentras errores de conexión:

1. Verificar que PostgreSQL está ejecutándose:
   ```bash
   # Con Docker
   docker ps

   # Linux/Mac (instalación local)
   sudo systemctl status postgresql
   ```

2. Verificar credenciales en archivo `.env`

3. Asegurarse de que la base de datos existe:
   ```bash
   psql -U postgres -l
   ```

### Puerto Ya en Uso

Si el puerto 3000 ya está en uso, cambiar el valor de `PORT` en tu archivo `.env`.

## Stack Tecnológico

- **Framework:** NestJS v11
- **Lenguaje:** TypeScript
- **ORM:** TypeORM
- **Base de Datos:** PostgreSQL
- **Testing:** Jest
- **Calidad de Código:** ESLint + Prettier

## Características

✅ **Arquitectura Modular** - Separación clara de responsabilidades
✅ **Manejo de Errores Profesional** - Try-catch en capa de servicios, logging contextual
✅ **Validación Robusta** - DTOs con class-validator
✅ **Testing Completo** - 24 tests unitarios + 29 tests E2E
✅ **Docker Ready** - Configuración de PostgreSQL con Docker Compose
✅ **TypeScript Strict** - Type safety en todo el proyecto
✅ **Excepciones Personalizadas** - Mensajes de error amigables

## Documentación Adicional

- **[ERROR_HANDLING.md](./ERROR_HANDLING.md)** - Guía completa de manejo de errores (try-catch, logging, excepciones personalizadas)
- **[VERIFICATION.md](./VERIFICATION.md)** - Reporte de verificación con ejemplos de curl y respuestas
- **[answers.md](./answers.md)** - Respuestas teóricas y explicaciones
- **[architecture.md](./architecture.md)** - Análisis de arquitectura y decisiones de diseño

## Licencia

Este proyecto está bajo licencia [MIT](LICENSE).

## Soporte

Para preguntas o problemas:
- Abrir un issue en [GitHub](https://github.com/JavierCollipal/nestjs-typeorm-api/issues)
- Revisar la [Documentación de NestJS](https://docs.nestjs.com)
- Revisar la [Documentación de TypeORM](https://typeorm.io)

---

**Construido con NestJS** - Un framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.
