# MzansiBuilds - Setup Guide

## Quick Start

This guide will help you set up the complete MzansiBuilds stack (React + Java + PostgreSQL).

## Prerequisites

Ensure you have these installed:
- Node.js 18+ (check with `node --version`)
- Maven 3.8+ (check with `mvn --version`)
- Java 21+ (check with `java --version`)
- Docker & Docker Compose (check with `docker --version`)
- Git

## Step 1: Start PostgreSQL Database

```bash
# From project root
docker-compose up -d

# Verify database is running
docker ps | grep postgres
```

This starts PostgreSQL on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `mzansi_builds`

## Step 2: Build & Run Backend (Spring Boot)

```bash
# Navigate to backend
cd backend

# Build with Maven
mvn clean install

# Run the application
mvn spring-boot:run
```

Expected output:
```
Started MzansiBuildsApplication in X.XXX seconds
```

Backend API will be available at: `http://localhost:8080/api`

### Verify Backend
```bash
# Open another terminal and test
curl http://localhost:8080/api/users
```

## Step 3: Setup & Run Frontend (React)

```bash
# Go back to project root
cd ..

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## Step 4: Access the Application

Open your browser and go to: `http://localhost:5173`

### Test Credentials (Pre-seeded Data)

Login with any of these accounts:

1. **Account 1**
   - Email: `k@test.com`
   - Password: `123456`

2. **Account 2**
   - Email: `n@test.com`
   - Password: `123456`

3. **Account 3**
   - Email: `s@test.com`
   - Password: `123456`

## Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is already in use
lsof -i :8080

# Check if database is running
docker ps | grep postgres

# Check database connection
psql -U postgres -h localhost -d mzansi_builds
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Check if port 5173 is in use
lsof -i :5173
```

### Database connection issues
```bash
# Check PostgreSQL logs
docker logs mzansi_builds_db

# Restart database
docker-compose restart postgres
```

## Project Structure

### Frontend Components
- `src/components/` - Reusable React components
- `src/pages/` - Page-level components (Feed, Profile)
- `src/services/api.js` - API service layer
- `src/context/AppContext.jsx` - Global state management
- `src/utils/helpers.js` - Utility functions
- `src/styles/App.module.css` - Styling

### Backend Java Structure
```
backend/
├── src/main/java/com/mzansibuilds/
│   ├── controller/  - REST API endpoints
│   ├── service/     - Business logic
│   ├── entity/      - JPA database entities
│   ├── repository/  - JPA repository interfaces
│   ├── dto/         - Data transfer objects
│   └── config/      - Configuration classes
└── pom.xml          - Maven dependencies
```

## API Overview

### Auth Endpoints
```
POST /api/auth/login
POST /api/auth/register
```

### Projects Endpoints
```
GET    /api/projects              - Get all projects
POST   /api/projects              - Create project
GET    /api/projects/{id}         - Get project by ID
PUT    /api/projects/{id}         - Update project
DELETE /api/projects/{id}         - Delete project
GET    /api/projects/user/{userId} - Get user's projects
```

### Users Endpoints
```
GET    /api/users          - Get all users
GET    /api/users/{id}     - Get user by ID
PUT    /api/users/{id}     - Update user profile
```

### Comments Endpoints
```
GET    /api/projects/{projectId}/comments        - Get comments
POST   /api/projects/{projectId}/comments        - Add comment
DELETE /api/projects/{projectId}/comments/{id}   - Delete comment
```

### Collaboration Endpoints
```
GET    /api/projects/{projectId}/collaborators          - List collaborators
POST   /api/projects/{projectId}/collaborators/toggle   - Toggle collaboration
```

## Development Workflow

### Frontend Development
```bash
# Terminal 1: Start React dev server
npm run dev

# Terminal 2: Run linter (optional)
npm run lint
```

### Backend Development
```bash
# Terminal 1: Start Spring Boot
mvn spring-boot:run

# Terminal 2: Run tests (optional)
mvn test
```

### Database Management
```bash
# Connect to database shell
docker exec -it mzansi_builds_db psql -U postgres -d mzansi_builds

# Example queries
\dt                    - List all tables
SELECT * FROM users;   - View users
```

## Build for Production

### Frontend
```bash
npm run build
# Output: dist/ folder
```

### Backend
```bash
cd backend
mvn clean package
# Output: target/mzansi-builds-api-1.0.0.jar
```

## Stopping Services

```bash
# Stop React dev server
# Ctrl+C in the React terminal

# Stop Spring Boot
# Ctrl+C in the Maven terminal

# Stop PostgreSQL
docker-compose down
```

## Environment Configuration

### Backend (backend/src/main/resources/application.properties)
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/mzansi_builds
spring.datasource.username=postgres
spring.datasource.password=postgres

# Server
server.port=8080

# JWT (change in production)
jwt.secret=your-secret-key-change-in-production
jwt.expiration=86400000
```

### Frontend
- API base URL: `http://localhost:8080/api` (hardcoded in `src/services/api.js`)

## Next Steps

1. Explore the application features
2. Create a new account or use test credentials
3. Create a project
4. Add collaborators and comments
5. Track project progress with milestones


## Support

For issues:
1. Check if all services are running
2. Check console logs for errors
3. Verify database connection
4. Ensure ports are not in use

Good luck! Happy coding! 🚀
