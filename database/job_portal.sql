-- ========================================================
-- JobConnect - Online Job Portal Database Script
-- Database: job_portal (MySQL 8.0+)
-- ========================================================

CREATE DATABASE IF NOT EXISTS job_portal;
USE job_portal;

-- Disable foreign key checks for clean drops
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS job_seeker_profiles;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ROLE_JOB_SEEKER', 'ROLE_RECRUITER') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Companies Table (Recruiter Company Profile)
CREATE TABLE companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(150),
    contact_email VARCHAR(120),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_company_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Job Seeker Profiles Table
CREATE TABLE job_seeker_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    phone VARCHAR(30),
    location VARCHAR(150),
    skills TEXT,
    education TEXT,
    experience TEXT,
    resume VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Jobs Table
CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NOT NULL,
    company_id BIGINT,
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    skills TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    job_type ENUM('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'REMOTE', 'CONTRACT') NOT NULL DEFAULT 'FULL_TIME',
    experience VARCHAR(50) NOT NULL,
    salary VARCHAR(80),
    openings INT DEFAULT 1,
    deadline DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_job_recruiter FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_job_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Applications Table
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    seeker_id BIGINT NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Applied', 'Shortlisted', 'Interview', 'Rejected', 'Selected') NOT NULL DEFAULT 'Applied',
    recruiter_notes TEXT,
    CONSTRAINT fk_app_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_app_seeker FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_job_seeker UNIQUE (job_id, seeker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- Seed Initial Demo Data (BCrypt hashed password for 'password123': $2a$10$wN10gDq6cgh98f8P5fS2QelJ9Z0fE4s2oXhR9e8Y6B.f0wN51qKvy)
-- ========================================================

-- Insert Demo Recruiter and Job Seeker
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Alex Morgan', 'recruiter@demo.com', '$2a$10$wN10gDq6cgh98f8P5fS2QelJ9Z0fE4s2oXhR9e8Y6B.f0wN51qKvy', 'ROLE_RECRUITER'),
(2, 'Sarah Jenkins', 'seeker@demo.com', '$2a$10$wN10gDq6cgh98f8P5fS2QelJ9Z0fE4s2oXhR9e8Y6B.f0wN51qKvy', 'ROLE_JOB_SEEKER'),
(3, 'David Chen', 'david.recruiter@demo.com', '$2a$10$wN10gDq6cgh98f8P5fS2QelJ9Z0fE4s2oXhR9e8Y6B.f0wN51qKvy', 'ROLE_RECRUITER');

-- Recruiter Company Profiles
INSERT INTO companies (id, recruiter_id, company_name, description, website, industry, location, contact_email) VALUES
(1, 1, 'CloudScale Technologies', 'Leading enterprise cloud infrastructure and modern developer tooling solutions.', 'https://cloudscale.example.com', 'Information Technology', 'San Francisco, CA', 'careers@cloudscale.example.com'),
(2, 3, 'FinTech Nova', 'Next-generation financial solutions and automated investment intelligence.', 'https://fintechnova.example.com', 'Financial Technology', 'New York, NY', 'jobs@fintechnova.example.com');

-- Job Seeker Profiles
INSERT INTO job_seeker_profiles (id, user_id, phone, location, skills, education, experience, resume) VALUES
(1, 2, '+1 (555) 234-5678', 'Austin, TX', 'Java, Spring Boot, MySQL, REST APIs, JavaScript, Git, Docker', 'B.S. in Computer Science, University of Texas (2018-2022)', '2+ years as Junior Software Engineer at TechCorp. Built scalable microservices and RESTful backends.', 'sarah_jenkins_resume.pdf');

-- Jobs
INSERT INTO jobs (id, recruiter_id, company_id, title, company_name, description, requirements, skills, location, job_type, experience, salary, openings, deadline, status) VALUES
(1, 1, 1, 'Senior Java Spring Boot Developer', 'CloudScale Technologies', 'We are looking for a Senior Java Developer to design, develop and maintain mission-critical enterprise microservices with Spring Boot, Hibernate, and MySQL.', '5+ years Java experience, solid understanding of Spring Security, RESTful APIs, and distributed systems.', 'Java, Spring Boot, Spring Security, MySQL, Docker, AWS', 'San Francisco, CA (Hybrid)', 'FULL_TIME', '5+ Years', '$135,000 - $165,000 / yr', 3, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'ACTIVE'),
(2, 1, 1, 'Full Stack Web Developer', 'CloudScale Technologies', 'Join our core platform team building intuitive web portals using modern JavaScript, HTML5/CSS3, and Spring Boot REST APIs.', 'Proficiency in frontend and backend technologies, REST API design, responsive UI design.', 'Java, Spring Boot, JavaScript, HTML5, CSS3, Bootstrap, MySQL', 'Remote', 'REMOTE', '2-4 Years', '$95,000 - $125,000 / yr', 2, DATE_ADD(CURDATE(), INTERVAL 25 DAY), 'ACTIVE'),
(3, 3, 2, 'Backend Software Engineer', 'FinTech Nova', 'Design resilient transactional financial services, payment pipelines, and high-throughput database interactions.', 'Strong knowledge of Java 17, Spring Data JPA, relational database design and JWT auth.', 'Java, Spring Boot, Spring Data JPA, MySQL, Redis, JWT', 'New York, NY', 'FULL_TIME', '3-5 Years', '$120,000 - $145,000 / yr', 2, DATE_ADD(CURDATE(), INTERVAL 20 DAY), 'ACTIVE'),
(4, 3, 2, 'Software Engineering Intern', 'FinTech Nova', 'Exciting 6-month internship for aspiring software engineers to work on real-world financial analytics services.', 'Currently enrolled or recent graduate in Computer Science or related degree. Passion for clean code.', 'Java, Spring Boot, SQL, Git, Problem Solving', 'Remote', 'INTERNSHIP', 'Freshers / 0-1 Year', '$4,500 / month', 4, DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'ACTIVE'),
(5, 1, 1, 'DevOps & Cloud Engineer', 'CloudScale Technologies', 'Architect continuous delivery pipelines, Docker containers, Kubernetes deployments, and cloud security.', 'Hands-on experience with CI/CD, Linux, Docker, AWS or GCP.', 'Docker, Kubernetes, CI/CD, Linux, AWS, Bash', 'San Francisco, CA', 'CONTRACT', '3+ Years', '$80 - $100 / hr', 1, DATE_ADD(CURDATE(), INTERVAL 18 DAY), 'ACTIVE');

-- Applications
INSERT INTO applications (id, job_id, seeker_id, application_date, status, recruiter_notes) VALUES
(1, 2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Shortlisted', 'Strong match on Spring Boot and modern JavaScript. Scheduling initial technical phone screening.');
