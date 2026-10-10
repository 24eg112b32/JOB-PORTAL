package com.jobconnect.dto;

import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class JobRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    private String companyName;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;

    @NotBlank(message = "Skills are required")
    private String skills;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @NotBlank(message = "Experience is required")
    private String experience;

    private String salary;

    @NotNull(message = "Openings count is required")
    @Min(value = 1, message = "Openings must be at least 1")
    private Integer openings = 1;

    @NotNull(message = "Application deadline is required")
    private LocalDate deadline;

    private JobStatus status = JobStatus.ACTIVE;

    public JobRequest() {}

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
}
