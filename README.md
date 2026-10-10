# ONLINE JOB PORTAL – JobConnect

JobConnect is a professional, full-stack Online Job Portal web application engineered with a clean, decoupled architecture:
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Hibernate, Spring Security, JWT (JSON Web Token), and BCrypt.
- **Frontend**: HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, and Fetch API.
- **Database**: MySQL 8.0+ relational database (`job_portal`).

---

## 1. Project Introduction

JobConnect bridges the gap between **Job Seekers** and **Recruiters** through a centralized, responsive web platform:
- **Job Seekers** can discover career opportunities, filter jobs by keywords, skills, location, type, and experience, manage their candidate profile and resume, submit applications, and monitor application progress through stages (*Applied*, *Shortlisted*, *Interview*, *Rejected*, *Selected*).
- **Recruiters** can establish their verified company profile, post and manage job listings, review applicant credentials, inspect resumes, and update candidate hiring stages with direct feedback notes.

---

## 2. Key Features

### Job Seeker Features
- **Secure Authentication**: Register and login with BCrypt password encryption and JWT session tokens.
- **Candidate Profile Management**: Add/edit Full Name, Phone, Location, Skills, Education, Work Experience, and Resume link.
- **Multi-Parameter Search & Filtering**: Filter by keyword (title/description), location, technical skills, job type (*Full Time*, *Part Time*, *Internship*, *Remote*, *Contract*), and experience level.
- **Job Details View**: Comprehensive information including salary, openings, deadline, responsibilities, and requirements.
- **One-Click Application**: Apply directly for open positions with validation preventing duplicate applications.
- **Application Tracking**: Real-time status badges (*Applied*, *Shortlisted*, *Interview*, *Rejected*, *Selected*) and recruiter notes.
- **Seeker Dashboard**: Overview counters for total submissions, in-review, shortlisted, interviewing, and hired jobs.

### Recruiter Features
- **Recruiter Registration & Login**: Dedicated role-based access control (`ROLE_RECRUITER`).
- **Company Profile**: Customize company name, description, website, industry, headquarters, and contact email.
- **Job Posting & Management**: Post vacancies with salary, openings, deadlines, skills, and detailed requirements.
- **Job Lifecycle Controls**: Activate/Deactivate visibility, edit job parameters in real-time, or delete listings.
- **Applicant Review Center**: Filter candidates by job opening, inspect full candidate profile and resume, and update hiring stage with custom recruiter notes.
- **Recruiter Dashboard**: High-level metrics showing total postings, active jobs, total candidates, shortlisted count, and interview pipeline.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+), Bootstrap 5.3, Bootstrap Icons, Fetch API |
| **Backend** | Java 17+, Spring Boot 3.2.x, Maven, Spring Web (REST), Spring Data JPA, Hibernate |
| **Security** | Spring Security 6, JWT (`io.jsonwebtoken`), BCrypt Password Encoder, Stateless RBAC |
| **Database** | MySQL 8.0+ (`job_portal` database), MySQL Connector/J |
| **Architecture** | Layered MVC Architecture (Controller → Service → Repository → Entity / DTO) |
| **IDE** | IntelliJ IDEA (Ultimate / Community) |

---

## 4. Project Directory Structure

```text
JobConnect/
├── database/
│   └── job_portal.sql              # MySQL schema creation, tables, and demo seed data
│
├── backend/
│   ├── pom.xml                     # Maven project configuration and dependencies
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/jobconnect/
│           │       ├── JobConnectApplication.java   # Spring Boot entry point
│           │       ├── controller/                  # REST Controllers
│           │       │   ├── AuthController.java
│           │       │   ├── UserController.java
│           │       │   ├── JobController.java
│           │       │   ├── ApplicationController.java
│           │       │   ├── CompanyController.java
│           │       │   └── DashboardController.java
│           │       ├── service/                     # Business Logic Services
│           │       │   ├── AuthService.java
│           │       │   ├── UserService.java
│           │       │   ├── JobService.java
│           │       │   ├── ApplicationService.java
│           │       │   ├── CompanyService.java
│           │       │   └── DashboardService.java
│           │       ├── repository/                  # Spring Data JPA Repositories
│           │       │   ├── UserRepository.java
│           │       │   ├── CompanyRepository.java
│           │       │   ├── JobRepository.java
│           │       │   ├── ApplicationRepository.java
│           │       │   └── JobSeekerProfileRepository.java
│           │       ├── entity/                      # JPA Database Entities & Enums
│           │       │   ├── User.java
│           │       │   ├── Role.java
│           │       │   ├── Company.java
│           │       │   ├── Job.java
│           │       │   ├── JobType.java
│           │       │   ├── JobStatus.java
│           │       │   ├── Application.java
│           │       │   ├── ApplicationStatus.java
│           │       │   └── JobSeekerProfile.java
│           │       ├── dto/                         # Data Transfer Objects
│           │       │   ├── LoginRequest.java
│           │       │   ├── RegisterRequest.java
│           │       │   ├── AuthResponse.java
│           │       │   ├── JobRequest.java
│           │       │   ├── JobResponse.java
│           │       │   ├── ApplicationRequest.java
│           │       │   ├── ApplicationResponse.java
│           │       │   ├── ApplicationStatusRequest.java
│           │       │   ├── CompanyRequest.java
│           │       │   ├── SeekerProfileRequest.java
│           │       │   ├── DashboardResponse.java
│           │       │   └── ApiResponse.java
│           │       ├── security/                    # Spring Security & JWT Setup
│           │       │   ├── JwtUtils.java
│           │       │   ├── JwtAuthenticationFilter.java
│           │       │   ├── UserDetailsImpl.java
│           │       │   ├── UserDetailsServiceImpl.java
│           │       │   ├── AuthEntryPointJwt.java
│           │       │   └── SecurityConfig.java
│           │       └── exception/                   # Error Handlers
│           │           ├── ResourceNotFoundException.java
│           │           ├── BadRequestException.java
│           │           └── GlobalExceptionHandler.java
│           │
│           └── resources/
│               ├── application.properties           # Spring Boot & MySQL configuration
│               └── schema.sql                       # DDL Schema reference
│
└── frontend/
    ├── index.html                  # Landing / Home page
    ├── login.html                  # User login page
    ├── register.html               # Registration page (Job Seeker / Recruiter)
    ├── jobs.html                   # Job search and filtering page
    ├── job-details.html            # Detailed job view and apply button
    ├── seeker-dashboard.html       # Candidate metrics dashboard
    ├── seeker-profile.html         # Candidate profile management
    ├── my-applications.html        # Candidate application status tracker
    ├── recruiter-dashboard.html    # Recruiter hiring metrics dashboard
    ├── company-profile.html        # Recruiter company information
    ├── post-job.html               # Post a job form
    ├── manage-jobs.html            # Recruiter job management table
    ├── applicants.html             # Recruiter candidate review & status updater
    ├── 404.html                    # Error 404 page
    │
    ├── css/
    │   ├── style.css               # Global theme & typography
    │   ├── auth.css                # Authentication forms styling
    │   ├── dashboard.css           # Sidebar & dashboard layouts
    │   └── jobs.css                # Job cards & details styling
    │
    └── js/
        ├── api.js                  # Central Fetch API client + JWT injector
        ├── auth.js                 # Authentication & route guards
        ├── jobs.js                 # Job search & cards rendering
        ├── applications.js         # Application submission & tracking
        ├── seeker.js               # Seeker profile controller
        ├── recruiter.js            # Recruiter job & candidate controller
        └── dashboard.js            # Metric calculation & display
```

---

## 5. Software Requirements

- **Java Development Kit (JDK)**: JDK 17 or later (e.g. OpenJDK 17, Amazon Corretto 17, or Oracle JDK 17).
- **Apache Maven**: 3.8+ (IntelliJ IDEA bundles Maven automatically).
- **MySQL Server**: MySQL 8.0 or later.
- **IntelliJ IDEA**: Ultimate or Community Edition.
- **Modern Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.

---

## 6. Step-by-Step Setup Guide

### STEP 1: MySQL Database Setup

1. Start your local MySQL service (e.g. via MySQL Workbench, MySQL CLI, or XAMPP).
2. Open terminal or MySQL client and run:
   ```bash
   mysql -u root -p
   ```
3. Execute the database script located at `database/job_portal.sql`:
   ```sql
   source /path/to/JobConnect/database/job_portal.sql;
   ```
   Or open `database/job_portal.sql` in MySQL Workbench and execute all statements.
4. Verify the database:
   ```sql
   USE job_portal;
   SHOW TABLES;
   ```
   You will see: `users`, `companies`, `jobs`, `applications`, and `job_seeker_profiles`.

---

### STEP 2: Configure `application.properties`

Navigate to `backend/src/main/resources/application.properties` and verify your MySQL credentials:

```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/job_portal?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

app.jwt.secret=JobConnectSuperSecretSecureKeyWithAtLeast256BitsLengthForHmacSHA256JobPortal
app.jwt.expiration-ms=86400000
```

---

### STEP 3: IntelliJ IDEA Backend Setup & Execution

1. Open **IntelliJ IDEA**.
2. Click **Open** or **File > Open...**.
3. Select the `backend/` folder (or select `backend/pom.xml`) and click **Open as Project**.
4. IntelliJ will automatically detect Maven and download all dependencies.
5. In the Project tool window, navigate to:
   `src/main/java/com/jobconnect/JobConnectApplication.java`.
6. Right-click `JobConnectApplication.java` and select **Run 'JobConnectApplication'** (or click the green Run arrow).
7. The console will display:
   ```text
   Tomcat started on port 8080 (http) with context path ''
   Started JobConnectApplication in X.XXX seconds
   ```
8. The REST API is now live at `http://localhost:8080/api`.

---

### STEP 4: Frontend Setup & Execution

The frontend is built using standard HTML5, CSS3, and JavaScript, meaning it can run on any web server or directly:

- **Option A (VS Code Live Server)**:
  Right-click `frontend/index.html` and choose **Open with Live Server** (runs at `http://127.0.0.1:5500/frontend/index.html`).
- **Option B (IntelliJ IDEA built-in browser)**:
  Right-click `frontend/index.html` in IntelliJ and choose **Open in Browser > Chrome**.
- **Option C (Python Simple Server)**:
  ```bash
  cd frontend
  python3 -m http.server 3000
  ```
- **Option D (Vite / Node server)**:
  ```bash
  npm run dev
  ```

---

## 7. Test Login Credentials

Default users pre-seeded into MySQL (and localStorage fallback):

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **Recruiter** | `recruiter@demo.com` | `password123` | CloudScale Technologies, posted jobs, received applications |
| **Job Seeker** | `seeker@demo.com` | `password123` | Software Engineer profile, 1 active application |

*Note: You can also register any new Job Seeker or Recruiter account on `register.html`.*

---

## 8. REST API Endpoints

### Authentication
- `POST /api/auth/register` - Create new Job Seeker or Recruiter account.
- `POST /api/auth/login` - Authenticate with email/password and obtain JWT.

### User Profile
- `GET /api/users/profile` - Retrieve current user profile (Seeker qualifications or Recruiter company).
- `PUT /api/users/profile` - Update candidate phone, location, skills, education, experience, and resume.

### Jobs
- `GET /api/jobs` - Search and filter active jobs (`keyword`, `location`, `skills`, `jobType`, `experience`).
- `GET /api/jobs/{id}` - Retrieve job details and check if current seeker has applied.
- `GET /api/jobs/recruiter/my` - List jobs created by the authenticated recruiter *(Recruiter only)*.
- `POST /api/jobs` - Post a new job *(Recruiter only)*.
- `PUT /api/jobs/{id}` - Update existing job posting *(Recruiter only)*.
- `DELETE /api/jobs/{id}` - Delete job posting *(Recruiter only)*.

### Applications
- `POST /api/applications` - Apply for an active job *(Job Seeker only)*.
- `GET /api/applications/my` - List applied jobs with status and notes *(Job Seeker only)*.
- `GET /api/applications/job/{jobId}` - List applicants for a specific opening *(Recruiter only)*.
- `GET /api/applications/recruiter/all` - List all applicants across all recruiter's jobs *(Recruiter only)*.
- `PUT /api/applications/{id}/status` - Update candidate status to *Applied*, *Shortlisted*, *Interview*, *Rejected*, or *Selected* with recruiter notes *(Recruiter only)*.

### Companies
- `GET /api/companies/{id}` - Get company public details.
- `GET /api/companies/my` - Get current recruiter's company profile *(Recruiter only)*.
- `POST /api/companies` - Save or update company profile *(Recruiter only)*.

### Dashboards
- `GET /api/dashboard/seeker` - Candidate dashboard metrics and recent submissions.
- `GET /api/dashboard/recruiter` - Recruiter dashboard statistics and recent candidates.

---

## 9. Workflow Demonstration

### A. Job Seeker Flow
1. Navigate to **Home** or **Find Jobs**.
2. Filter positions by keyword (e.g. `Java`), location (e.g. `San Francisco`), or job type (`Full Time`).
3. Click **View Details** on any job card.
4. If not logged in, click **Login to Apply** and authenticate as `seeker@demo.com`.
5. Click **Apply Now**. Duplicate applications are prevented by system validation.
6. Open **Candidate Dashboard** or **My Applications** to inspect the real-time stage of your application and read notes from the recruiter.

### B. Recruiter Flow
1. Log in with `recruiter@demo.com` / `password123`.
2. Open **Recruiter Dashboard** to see live stats.
3. Update organization branding under **Company Profile**.
4. Click **Post New Job** to publish an engineering opening.
5. In **Manage Jobs**, toggle visibility (*ACTIVE* / *INACTIVE*), modify specifications, or delete listings.
6. In **View Applicants**, inspect candidate qualifications, education, and resume. Click **Update Status** to change their stage (e.g. from *Applied* to *Shortlisted* or *Interview*) and attach interview notes.

---

## 10. Future Enhancements

- **Direct Resume File Upload**: Amazon S3 / Cloud Storage integration for PDF resumes.
- **Email Notifications**: JavaMailSender integration sending automated emails upon candidate status change.
- **Interview Scheduling**: Google Calendar integration for setting interview times directly in the recruiter portal.
- **Salary Insights & Analytics**: Graph visualizations for recruitment pipeline velocity and average time-to-hire.
