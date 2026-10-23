# RegulareEdge 🚀
### Regulatory Reporting & Compliance Management Platform

RegulareEdge is a microservices-based compliance platform designed to digitize regulatory reporting workflows for regulated institutions such as banks and financial firms. It streamlines the preparation, certification, review, and submission of regulatory returns while replacing fragmented email communication and spreadsheets with a centralized, deadline-driven system.

The platform provides role-based access control, workflow management, document handling, audit traceability, and compliance analytics to support accountability throughout the regulatory reporting lifecycle.

##  System Architecture

The application follows a **microservices architecture** with eight independent Spring Boot services. The React frontend communicates with backend services through a centralized API Gateway, while Eureka handles service discovery and Spring Cloud Config provides centralized configuration.

```text
                    ┌───────────────────────┐
                    │     React Frontend    │
                    │      Port: 5173       │
                    └───────────┬───────────┘
                                │ HTTP / REST + JWT
                                ▼
                    ┌───────────────────────┐
                    │      API Gateway      │
                    │      Port: 9080       │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐   ┌────────────────┐
      │ Auth Service │   │ Compliance   │   │ Return         │
      │ Port: 8081   │   │ Core : 8082  │   │ Management     │
      └──────────────┘   └──────────────┘   │ Port: 8083     │
                                            └────────────────┘
             │                  │                  │
             └──────────────────┼──────────────────┘
                                ▼
                    ┌───────────────────────┐
                    │   Eureka Discovery    │
                    │      Port: 8761       │
                    └───────────────────────┘

 Additional Services:
 - Config Server          : 8888
 - Audit & Analytics      : 8084
 - Notification Service   : 8085
```

### Microservices Overview

| Service | Port | Database | Responsibility |
|---|---:|---|---|
| Eureka Server | 8761 | None | Service discovery and instance registration |
| Config Server | 8888 | None | Centralized configuration management |
| API Gateway | 9080 | None | Request routing, JWT validation, CORS, and correlation ID propagation |
| Auth Service | 8081 | `authdb` | User management, authentication, and JWT issuance |
| Compliance Core Service | 8082 | `compliancecoredb` | Regulators, obligations, deadlines, and data collection requests |
| Return Management Service | 8083 | `returnmanagementdb` | Return lifecycle, schedules, submissions, correspondence, and penalties |
| Audit & Analytics Service | 8084 | `auditanalyticsdb` | Audit reviews, control evidence, compliance reports, and dashboards |
| Notification Service | 8085 | `notificationdb` | In-app notifications and unread notification tracking |

## 👥 Role-Based Access Control (RBAC)

RegulareEdge supports six roles with permissions tailored to their responsibilities. The frontend controls the visibility of role-specific features, while the backend enforces authorization using Spring Security and `@PreAuthorize` annotations.

| Role | Responsibilities |
|---|---|
| **Admin (ADMIN)** | Manages system users, regulators, obligations, and compliance calendar deadlines |
| **Compliance Officer (CO)** | Requests data from owners, prepares regulatory returns, and coordinates approval workflows |
| **Data Owner (DATA_OWNER)** | Uploads supporting PDF documents and completes data certification workflows |
| **Chief Compliance Officer (CCO)** | Reviews regulatory returns, examines supporting documents, and provides final approval |
| **Internal Auditor (AUDITOR)** | Reviews compliance obligations, records control evidence, and assigns audit ratings |
| **Legal Officer (LEGAL)** | Manages regulatory correspondence, records penalties, and tracks disputes and payment status |

## 🛠️ Technology Stack

**Backend**
- Java 21
- Spring Boot 3.2
- Spring Security
- Spring Data JPA and Hibernate
- Maven

**Microservices and Resilience**
- Spring Cloud Netflix Eureka
- Spring Cloud Config
- Spring Cloud Gateway
- Spring Cloud OpenFeign
- Resilience4j Circuit Breakers and Retries

**Frontend**
- React 18
- Vite 5
- React Router DOM 6
- Axios
- Custom responsive CSS

**Database and Security**
- MySQL 8
- JWT authentication using JJWT
- BCrypt password hashing

**Development Tools**
- Git and GitHub
- Postman
- IntelliJ IDEA

## ✨ Key Features & Technical Highlights

### 1. Microservices Architecture
- Eight independent Spring Boot services with clearly separated responsibilities.
- Centralized API routing through Spring Cloud Gateway.
- Service registration and discovery using Eureka.
- Centralized application configuration using Spring Cloud Config.

### 2. Secure Authentication and Authorization
- Stateless authentication using JSON Web Tokens (JWT).
- Password hashing using BCrypt.
- Role-based access control across application modules.
- Backend authorization using Spring Security and method-level security annotations.

### 3. Inter-Service Communication and Resilience
- Declarative REST communication using Spring Cloud OpenFeign.
- Resilience4j circuit breakers and retries for improved fault tolerance.
- Fail-open or fallback behavior where configured and appropriate.

### 4. Data Owner Document Workflow
- Multipart PDF upload and download.
- File storage using unique UUID-based filenames.
- Structured data request and certification workflows.
- Certification sign-off completion as part of the data collection process.

### 5. Audit Logging and Request Tracing
- Correlation ID propagation using the `X-Correlation-Id` header.
- Request tracing across gateway and backend services.
- Audit logging across core business domains to improve traceability.

### 6. React Frontend Integration
- Centralized API adapter layer in `api.js`.
- Integration with distributed backend endpoints through the API Gateway.
- Route protection and role-specific UI behavior.
- Responsive user interface with custom CSS.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following software:

- Java Development Kit (JDK) 21
- Node.js 18 or later and npm
- MySQL Server 8
- Maven

### 1. Clone the Repository

```bash
git clone https://github.com/<your-github-username>/RegulareEdge.git
cd RegulareEdge
```

Replace `<your-github-username>` with the correct GitHub username and repository URL.

### 2. Configure MySQL

Make sure your local MySQL server is running.

The application is configured to use the following databases:

- `authdb`
- `compliancecoredb`
- `returnmanagementdb`
- `auditanalyticsdb`
- `notificationdb`

In the development configuration, the services may create their databases automatically if the configured MySQL user has the required privileges. Otherwise, create the databases manually.

Configure the database URL, username, and password using the application's configuration files or environment variables, as appropriate for your setup.



### 3. Start the Backend Services

Start the services in the following order to establish the infrastructure before dependent services:

1. **Eureka Server** — Port `8761`
2. **Config Server** — Port `8888`
3. **Auth Service** — Port `8081`
4. **Compliance Core Service** — Port `8082`
5. **Return Management Service** — Port `8083`
6. **Audit & Analytics Service** — Port `8084`
7. **Notification Service** — Port `8085`
8. **API Gateway** — Port `9080`

Open a terminal in each service's directory and run:

```bash
mvn spring-boot:run
```

Keep each service running in its own terminal. Ensure that service configuration, database connectivity, and service discovery are working correctly before starting the frontend.

### 4. Start the Frontend

Open a new terminal in the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite in the terminal. The default development URL is:

```text
http://localhost:5173
```

Ensure that the frontend API configuration points to the API Gateway at `http://localhost:9080` for local development.



**Pavana G.**

