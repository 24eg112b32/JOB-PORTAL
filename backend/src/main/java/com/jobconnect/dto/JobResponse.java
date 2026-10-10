package com.jobconnect.dto;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobResponse {

    private Long id;
    private Long recruiterId;
    private String recruiterName;
    private Long companyId;
    private String title;
    private String companyName;
    private String description;
    private String requirements;
    private String skills;
    private String location;
    private JobType jobType;
    private String experience;
    private String salary;
    private Integer openings;
    private LocalDate deadline;
    private JobStatus status;
    private LocalDateTime createdAt;
    private long applicantCount;
    private boolean hasApplied;

    public JobResponse() {}

    public static JobResponse fromEntity(Job job) {
        JobResponse res = new JobResponse();
        res.setId(job.getId());
        if (job.getRecruiter() != null) {
            res.setRecruiterId(job.getRecruiter().getId());
            res.setRecruiterName(job.getRecruiter().getName());
        }
        if (job.getCompany() != null) {
            res.setCompanyId(job.getCompany().getId());
        }
        res.setTitle(job.getTitle());
        res.setCompanyName(job.getCompanyName());
        res.setDescription(job.getDescription());
        res.setRequirements(job.getRequirements());
        res.setSkills(job.getSkills());
        res.setLocation(job.getLocation());
        res.setJobType(job.getJobType());
        res.setExperience(job.getExperience());
        res.setSalary(job.getSalary());
        res.setOpenings(job.getOpenings());
        res.setDeadline(job.getDeadline());
        res.setStatus(job.getStatus());
        res.setCreatedAt(job.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRequirements() {
        return requirements;
    }

    public void setRequirements(String requirements) {
        this.requirements = requirements;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobType getJobType() {
        return jobType;
    }

    public void setJobType(JobType jobType) {
        this.jobType = jobType;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public Integer getOpenings() {
        return openings;
    }

    public void setOpenings(Integer openings) {
        this.openings = openings;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(long applicantCount) {
        this.applicantCount = applicantCount;
    }

    public boolean isHasApplied() {
        return hasApplied;
    }

    public void setHasApplied(boolean hasApplied) {
        this.hasApplied = hasApplied;
    }
}
