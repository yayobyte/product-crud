# Product CRUD API

A RESTful API for managing products with authentication and role-based access control.

## Project Structure

This is a monorepo managed with pnpm workspaces containing:

- **packages/backend**: Express.js backend API with TypeScript

## Features

- RESTful API for products (CRUD operations)
- Authentication with JWT
- Role-based access control (Admin and User roles)
- Comprehensive testing (unit, integration, and coverage)
- CI/CD pipeline with GitHub Actions

## Development

### Prerequisites

- Node.js (v18.x or v20.x)
- pnpm (v9+)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Create .env file in packages/backend
cp packages/backend/.env.example packages/backend/.env
# Edit as needed
```

4. Start the development server:

```bash
cd packages/backend
pnpm dev
```

## Testing

The project includes comprehensive testing:

### Unit Tests

Tests individual components in isolation:

```bash
cd packages/backend
pnpm test
```

### Integration Tests

Tests the full API flow:

```bash
cd packages/backend
pnpm test:integration
```

### Coverage Tests

Measures code coverage:

```bash
cd packages/backend
pnpm test:coverage
```

Our code coverage requirements:
- 90% line coverage
- 90% function coverage
- 90% branch coverage
- 90% statement coverage

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Pipeline Stages

1. **Test**:
   - Runs unit tests
   - Runs integration tests
   - Generates and uploads coverage reports
   - Tests with Node.js 18 and 20

2. **Build**:
   - Builds the application
   - Archives build artifacts

3. **Deploy (Preview)**:
   - For pull requests only
   - Deploys to a preview environment

4. **Deploy (Production)**:
   - For pushes to main branch only
   - Deploys to production environment

### Coverage Reports

Test coverage is tracked using CodeCov. Each PR includes a coverage report to ensure code quality is maintained.

## API Documentation

### Authentication

- **POST /api/auth/login**: Login with username and password

### Products

- **GET /api/products**: Get all products (public)
- **GET /api/products/:id**: Get a product by ID (public)
- **POST /api/products**: Create a new product (admin only)
- **PUT /api/products/:id**: Update a product (admin only)
- **DELETE /api/products/:id**: Delete a product (admin only)

## License

MIT
