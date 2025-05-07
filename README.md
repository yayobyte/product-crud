# Product CRUD Application

A full-stack application for managing products, featuring a RESTful API backend and a responsive React frontend. It includes authentication and role-based access control.

## Project Structure

This is a monorepo managed with pnpm workspaces containing:

- **`packages/backend`**: Express.js backend API with TypeScript.
- **`packages/frontend`**: React frontend application with TypeScript, Vite, and Tailwind CSS.

## Features

### Backend
- RESTful API for products (CRUD operations).
- Authentication with JWT.
- Role-based access control (Admin and User roles).
- Comprehensive testing (unit, integration, and coverage).

### Frontend
- Responsive user interface for product management.
- Product listing, detail view, creation, editing, and deletion.
- User login with role-specific UI elements (e.g., admin-only actions).
- Global error handling for API requests (token expiry) and UI rendering (Error Boundaries).
- Client-side routing with React Router.
- Styling with Tailwind CSS.

### General
- CI/CD pipeline with GitHub Actions for both backend and frontend.

## Development

### Prerequisites

- Node.js (v18.x or v20.x recommended)
- pnpm (v9+ recommended)

### Setup

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd product-crud
    ```
2.  Install dependencies from the root of the monorepo:
    ```bash
    pnpm install
    ```
3.  Set up environment variables:
    *   **Backend**:
        ```bash
        # Create .env file in packages/backend
        cp packages/backend/.env.example packages/backend/.env
        # Edit as needed (e.g., JWT_SECRET, PORT)
        ```
    *   **Frontend**:
        The frontend uses Vite for environment variables. The primary variable is `VITE_API_BASE_URL`.
        You can create a `.env` file in `packages/frontend` (e.g., `.env.development.local` or `.env.local`) to override the default if needed:
        ```env
        VITE_API_BASE_URL=http://localhost:3001/api
        ```
        The default is usually set in `packages/frontend/src/api/axiosInstance.ts` or configured to point to the backend's development server.

### Running the Application

*   **Backend Development Server**:
    ```bash
    cd packages/backend
    pnpm dev
    ```
    The backend will typically run on `http://localhost:3001`.

*   **Frontend Development Server**:
    ```bash
    cd packages/frontend
    pnpm dev
    ```
    The frontend will typically run on `http://localhost:5173` (or another port if 5173 is busy) and will connect to the backend API.

## Testing

The project includes comprehensive testing for both backend and frontend.

### Backend Testing

-   **Unit Tests**:
    ```bash
    cd packages/backend
    pnpm test
    ```
-   **Integration Tests**:
    ```bash
    cd packages/backend
    pnpm test:integration
    ```
-   **Coverage Tests**:
    ```bash
    cd packages/backend
    pnpm test:coverage
    ```
    Backend code coverage requirements:
    - 90% line coverage
    - 90% function coverage
    - 90% branch coverage
    - 90% statement coverage

### Frontend Testing

-   **Unit & Component Tests**:
    The frontend uses Vitest and React Testing Library for tests.
    ```bash
    cd packages/frontend
    pnpm test
    ```
-   **Coverage Tests (Frontend)**:
    To run tests with coverage for the frontend:
    ```bash
    cd packages/frontend
    pnpm test:coverage 
    ```
    *(Ensure `test:coverage` script is defined in `packages/frontend/package.json` e.g., `"test:coverage": "vitest run --coverage"`)*

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment for both frontend and backend.

### Pipeline Stages

1.  **Paths Filter**: Determines if backend or frontend files changed to run respective jobs.
2.  **Test (Backend & Frontend)**:
    - Runs unit and integration tests (for backend).
    - Runs unit/component tests (for frontend).
    - Generates and uploads coverage reports to Codecov.
    - Tests with Node.js 18 and 20.
3.  **Build (Backend & Frontend)**:
    - Builds the applications.
    - Archives build artifacts.
4.  **Deploy (Preview)**:
    - For pull requests only.
    - Deploys backend and frontend to Vercel preview environments.
    - Creates unique URLs for each PR for testing.
5.  **Deploy (Production)**:
    - For pushes to the `main` branch only.
    - Deploys backend and frontend to Vercel production environments.

### Vercel Deployment

Both the frontend and backend are automatically deployed to Vercel through the CI/CD pipeline.

#### Backend Deployment
- **Live API**: [https://product-crud-backend-alpha.vercel.app/](https://product-crud-backend-alpha.vercel.app/) (Example URL, replace with your actual)
- **API Endpoints**:
  - Products: `/api/products`
  - Authentication: `/api/auth/login`

#### Frontend Deployment
- **Live UI**: [https://product-crud-frontend-alpha.vercel.app/](https://product-crud-frontend-alpha.vercel.app/) (Example URL, replace with your actual)

## Frontend Overview

The frontend application is built with modern web technologies:

- **Framework/Library**: React with Vite for a fast development experience.
- **Language**: TypeScript for type safety.
- **Routing**: React Router DOM for client-side navigation.
- **Styling**: Tailwind CSS for utility-first CSS.
- **State Management**:
    - Local component state (`useState`, `useReducer`).
    - Shared authentication state via React Context API (`AuthContext`, `useAuth` hook).
- **API Communication**: `axios` (via a configured `apiClient` instance) for making HTTP requests to the backend.
- **Error Handling**:
    - **Global API Errors**: An Axios interceptor in `axiosInstance.ts` handles 401 Unauthorized errors by dispatching an event, leading to user logout and redirection to the login page.
    - **UI Rendering Errors**: `react-error-boundary` is used to catch JavaScript errors in the component tree and display a fallback UI, preventing a full application crash.
- **Component Structure**:
    - `features/`: Contains components related to specific application features (e.g., products, auth).
    - `components/`: Shared UI components (`layout`, `ui` elements like `ProductCard`, `ProductForm`).
    - `services/`: Modules for interacting with the backend API (e.g., `productService`, `authService`).
    - `hooks/`: Custom React hooks (e.g., `useAuth`).
    - `context/`: React context for global state (e.g., `AuthContext`).

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
