# Training Application

A full-stack web application for managing workout exercises and training plans. Built with Spring Boot and React.

## Features

- User authentication and authorization
- Exercise management
- Training plan creation and scheduling
- Admin dashboard for user management
- Responsive Material UI design

## Stack Technology 🛠

### Frontend
- React (v18.3.1) - Core frontend framework
- React Router (v7.1.3) - For routing and navigation
- Material UI (v6.4.0) - UI component library
- Tailwind CSS (v3.4.17) - For styling
- Vite (v6.0.5) - Build tool and development server
- Day.js - Date handling library
- Context API for state management
- JWT authentication

### Backend
- Spring Boot (v3.4.1) - Backend framework
- Java (v23) - Programming language
- Spring Security - Authentication and authorization
- JWT - Token-based authentication
- MySQL - Database
- Maven - Build automation tool

## Getting Started

### Prerequisites
- Node.js (v14+)
- Java JDK 17+
- MySQL

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

# Backend Setup Documentation

1. Navigate to backend directory:
```bash
cd backend
```
2. Build the project:
```bash
mvn clean install
```
3. Run the application:
```bash
mvn spring-boot:run
```

## Core Features 🎯

### Authentication & Authorization
- User registration
- User login/logout
- JWT-based authentication
- Role-based access control (USER, ADMIN)
### Exercise Management
- View all exercises
- Create new exercises
- Update existing exercises
- Delete exercises
- Filter exercises by muscle groups
### Training Management
- View all trainings
- Create new training plans
- Update existing training plans
- Delete training plans
- Add exercises to training plans with sets/reps
### Admin Features
- Manage all users
- View all exercises from all users
- View all training plans from all users
- Delete users
- Modify any exercise or training
### User Features
- Manage personal exercises
- Create and manage personal training plans
- View public exercises and training plans


## Authentication
The application uses **JWT (JSON Web Tokens)** for authentication:

- Tokens are stored in `localStorage`
- Role-based access control (`ROLE_USER`, `ROLE_ADMIN`)
- Protected routes and API endpoints


## API Endpoints 🌐

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration

### Exercises
- **GET** `/api/exercises` - Get user's exercises
- **POST** `/api/exercises` - Create new exercise
- **PUT** `/api/exercises/{id}` - Update exercise
- **DELETE** `/api/exercises/{id}` - Delete exercise

### Trainings
- **GET** `/api/trainings` - Get user's training plans
- **POST** `/api/trainings` - Create new training
- **PUT** `/api/trainings/{id}` - Update training
- **DELETE** `/api/trainings/{id}` - Delete training

### Admin
- **GET** `/api/admin/users` - Get all users
- **DELETE** `/api/admin/users/{id}` - Delete user
- **GET** `/api/admin/exercises` - Get all exercises
- **GET** `/api/admin/trainings` - Get all trainings

---

## Security

### Password Encryption
- Passwords are securely encrypted using **BCrypt**.

### JWT Token Validation
- Tokens are validated to ensure secure access to resources.

### CORS Configuration
- Proper **CORS (Cross-Origin Resource Sharing)** settings for secure API access.

### Role-Based Authorization
- Access control implemented for `ROLE_USER` and `ROLE_ADMIN` roles.

### Protected API Endpoints
- All sensitive operations are secured and accessible only by authorized roles.
