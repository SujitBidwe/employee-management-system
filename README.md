# Employee Management System

A full-stack HR management application built with Java Spring Boot and React.

## Tech Stack
- **Backend:** Java 17, Spring Boot 3, Spring Security, Hibernate/JPA, JWT
- **Frontend:** React, TypeScript, Vite, Axios, React Router
- **Database:** H2 (development), MySQL (production)
- **Testing:** JUnit 5, Mockito

## Features
- JWT Authentication with BCrypt password encryption
- Role-Based Access Control (ADMIN, HR, EMPLOYEE)
- Employee CRUD operations
- Attendance tracking
- Leave management with approval workflow
- Payroll generation
- Department reports

## Default Login Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| HR | hr | hr123 |
| Employee | employee | employee123 |

## How to Run

### Backend

cd employee-management-system
.\mvnw.cmd spring-boot:run

### Frontend
cd frontend
npm install
npm run dev


Backend runs on http://localhost:8080  
Frontend runs on http://localhost:5173
Push it:
git add README.md
git commit -m "Add README"
git push
