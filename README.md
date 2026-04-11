# MzansiBuilds - Full Stack Application

A platform for South African developers to build and collaborate on projects in public. Built with React, Java Spring Boot, and PostgreSQL.

# Live Demo (Render, Supabase, Vercel)
- https://sonke-platform-project.vercel.app/

## Technology Stack

### Frontend
- **React** with Vite
- **Context API** for state management
- **CSS Modules** for styling

### Backend
- **Java 17**
- **Spring Boot 3.2**
- **Spring Data JPA**
- **PostgreSQL 18**
- **JWT** for authentication
- **Maven** for build management

### Database
- **PostgreSQL** 18


## Getting Started

### Deployment
For Render, Supabase, and Vercel deployment instructions, see `DEPLOYMENT.md`.

### Prerequisites
- Node.js 18+ and npm
- Java 21+
- Maven 3.8+
- Docker & Docker Compose

### Database Setup

1. Start PostgreSQL with Docker:
```bash
docker-compose up -d
```

This will start a PostgreSQL container on `localhost:5432` with:
- Username: `postgres`
- Password: `postgres`
- Database: `mzansi_builds`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080/api`

### Frontend Setup

1. Navigate to the root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/{id}` - Get project by ID
- `GET /api/projects/user/{userId}` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Comments
- `GET /api/projects/{projectId}/comments` - Get project comments
- `POST /api/projects/{projectId}/comments` - Add comment
- `DELETE /api/projects/{projectId}/comments/{id}` - Delete comment

### Collaborations
- `GET /api/projects/{projectId}/collaborators` - Get collaborators
- `POST /api/projects/{projectId}/collaborators/toggle` - Toggle collaboration


## Development Notes

### Frontend
- Components are organized in `/src/components` and `/src/pages`
- State is managed with React Context in `/src/context/AppContext`
- API calls are centralized in `/src/services/api.js`
- Styling uses CSS Modules in `/src/styles`

### Backend
- Controllers handle HTTP requests in `/controller`
- Services contain business logic in `/service`
- DTOs are used for request/response in `/dto`
- JPA entities define the database schema in `/entity`
- Repositories handle database queries in `/repository`

## Environment Variables

### Frontend
No environment variables needed for development (uses `http://localhost:8080/api`)

### Backend
Create/update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mzansi_builds
spring.datasource.username=postgres
spring.datasource.password=postgres
jwt.secret=your-secret-key
jwt.expiration=86400000
```

## Building for Production

### Frontend
```bash
npm run build
```

### Backend
```bash
mvn clean package
java -jar backend/target/mzansi-builds-api-1.0.0.jar
```

## Common Commands

```bash
# Frontend
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint

# Backend
mvn clean install # Build and install
mvn spring-boot:run # Run application
mvn test          # Run tests
mvn package       # Create JAR

# Docker
docker-compose up -d     # Start containers
docker-compose ps        # List running containers
docker-compose down      # Stop containers
docker logs container-id # View logs
```



