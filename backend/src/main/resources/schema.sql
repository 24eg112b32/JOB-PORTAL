-- Schema definitions for JobConnect Online Job Portal
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
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
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_seeker_profiles (
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recruiter_id BIGINT NOT NULL,
    company_id BIGINT,
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    skills TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    job_type VARCHAR(30) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    salary VARCHAR(80),
    openings INT DEFAULT 1,
    deadline DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    seeker_id BIGINT NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'Applied',
    recruiter_notes TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (seeker_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_job_seeker (job_id, seeker_id)
);
