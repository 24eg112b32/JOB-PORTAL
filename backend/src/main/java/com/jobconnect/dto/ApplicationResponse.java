package com.jobconnect.dto;

import com.jobconnect.entity.Application;
import com.jobconnect.entity.ApplicationStatus;
import com.jobconnect.entity.JobSeekerProfile;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String location;
    private String jobType;
    private Long seekerId;
    private String seekerName;
    private String seekerEmail;
    private String seekerPhone;
    private String seekerLocation;
    private String seekerSkills;
    private String seekerEducation;
    private String seekerExperience;
    private String seekerResume;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    private String recruiterNotes;

    public ApplicationResponse() {}

    public static ApplicationResponse fromEntity(Application app, JobSeekerProfile profile) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        if (app.getJob() != null) {
            res.setJobId(app.getJob().getId());
            res.setJobTitle(app.getJob().getTitle());
            res.setCompanyName(app.getJob().getCompanyName());
            res.setLocation(app.getJob().getLocation());
            if (app.getJob().getJobType() != null) {
                res.setJobType(app.getJob().getJobType().name());
            }
        }
        if (app.getSeeker() != null) {
            res.setSeekerId(app.getSeeker().getId());
            res.setSeekerName(app.getSeeker().getName());
            res.setSeekerEmail(app.getSeeker().getEmail());
        }
        if (profile != null) {
            res.setSeekerPhone(profile.getPhone());
            res.setSeekerLocation(profile.getLocation());
            res.setSeekerSkills(profile.getSkills());
            res.setSeekerEducation(profile.getEducation());
            res.setSeekerExperience(profile.getExperience());
            res.setSeekerResume(profile.getResume());
        }
        res.setApplicationDate(app.getApplicationDate());
        res.setStatus(app.getStatus());
        res.setRecruiterNotes(app.getRecruiterNotes());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public Long getSeekerId() {
        return seekerId;
    }

    public void setSeekerId(Long seekerId) {
        this.seekerId = seekerId;
    }

    public String getSeekerName() {
        return seekerName;
    }

    public void setSeekerName(String seekerName) {
        this.seekerName = seekerName;
    }

    public String getSeekerEmail() {
        return seekerEmail;
    }

    public void setSeekerEmail(String seekerEmail) {
        this.seekerEmail = seekerEmail;
    }

    public String getSeekerPhone() {
        return seekerPhone;
    }

    public void setSeekerPhone(String seekerPhone) {
        this.seekerPhone = seekerPhone;
    }

    public String getSeekerLocation() {
        return seekerLocation;
    }

    public void setSeekerLocation(String seekerLocation) {
        this.seekerLocation = seekerLocation;
    }

    public String getSeekerSkills() {
        return seekerSkills;
    }

    public void setSeekerSkills(String seekerSkills) {
        this.seekerSkills = seekerSkills;
    }

    public String getSeekerEducation() {
        return seekerEducation;
    }

    public void setSeekerEducation(String seekerEducation) {
        this.seekerEducation = seekerEducation;
    }

    public String getSeekerExperience() {
        return seekerExperience;
    }

    public void setSeekerExperience(String seekerExperience) {
        this.seekerExperience = seekerExperience;
    }

    public String getSeekerResume() {
        return seekerResume;
    }

    public void setSeekerResume(String seekerResume) {
        this.seekerResume = seekerResume;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDateTime applicationDate) {
        this.applicationDate = applicationDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRecruiterNotes() {
        return recruiterNotes;
    }

    public void setRecruiterNotes(String recruiterNotes) {
        this.recruiterNotes = recruiterNotes;
    }
}
