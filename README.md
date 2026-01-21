# TaskFlow - Full Stack Assignment

## Project Overview
TaskFlow is a robust full-stack application designed to demonstrate modular architecture, secure authentication, and scalable backend practices. It features a task management system with role-based access control (RBAC), real-time dashboard statistics, and optimized caching strategies.

## Technology Stack
### Frontend
- **Framework:** React / Next.js (Planned)
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **API Communication:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (TypeScript)
- **Database:** PostgreSQL (via TypeORM)
- **Caching:** Redis
- **Validation:** class-validator & class-transformer
- **Authentication:** JWT-based with Role-Based Access Control (RBAC)

### Infrastructure
- **Containerization:** Docker & Docker Compose

## Architecture Overview
The backend follows a **Modular Clean Architecture**, ensuring separation of concerns and scalability.

```text
project-root/
├── backend/
│   ├── src/
│   │   ├── config/           # Database & Redis configuration
│   │   ├── modules/          # Feature-based modules (Auth, Users, Tasks, Dashboard)
│   │   │   ├── auth/         # Authentication logic
│   │   │   ├── users/        # User management
│   │   │   ├── tasks/        # Core task domain
│   │   │   └── dashboard/    # Aggregated stats & analytics
│   │   ├── entities/         # TypeORM entities (Database Models)
│   │   ├── middlewares/      # Global & Route-specific middlewares (Auth, Error, Validation)
│   │   ├── utils/            # Shared utilities (Logger, JWT, Hashing)
│   │   ├── cache/            # Redis cache abstraction service
│   │   └── tests/            # Unit & Integration tests
│   ├── app.ts                # App configuration
│   └── server.ts             # Server entry point
├── frontend/                 # (Planned) React Application
└── docker-compose.yml        # Orchestration for App, DB, and Cache
```

### Folder Structure Details
- **`config/`**: Centralized configuration for Environment variables, TypeORM DataSource, and Redis client.
- **`modules/`**: Each feature (e.g., Auth, Tasks) is self-contained with its own Controller, Service, and Routes.
- **`entities/`**: Database schema definitions. We use **Indexes** on frequently queried fields like `status` and `userId` for performance.
- **`cache/`**: Abstracted CacheService to handle high-level caching logic (Get/Set/Invalidate) separate from business logic.

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### Running with Docker (Recommended)
```bash
# Clone the repository
git clone <repo-url>
cd taskflow

# Start all services (Backend, Frontend, Postgres, Redis)
docker-compose up --build
```

### Running Locally (Dev Mode)
1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Design Decisions & Trade-offs
- **Redis for Caching:** Chosen for its speed and suitability for caching list endpoints and dashboard stats. Implemented with a specialized `CacheService` to allow easy swapping or mocking in tests.
- **TypeORM:** Selected for its robust TypeScript integration and migration support, ensuring strict schema enforcement.
- **Modular Structure:** Instead of grouping by technical layer (Controllers/Services), code is grouped by **Domain Feature**. This makes the codebase easier to scale and maintain.

## Future Improvements
- [ ] Add WebSockets for real-time task updates.
- [ ] Implement Refresh Token rotation.
- [ ] Add email notifications for task assignment.
