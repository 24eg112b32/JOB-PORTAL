package com.jobconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(name = "uk_job_seeker", columnNames = {"job_id", "seeker_id"})
})
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seeker_id", nullable = false)
    private User seeker;

    @Column(name = "application_date", updatable = false)
    private LocalDateTime applicationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.Applied;

    @Column(name = "recruiter_notes", columnDefinition = "TEXT")
    private String recruiterNotes;

    public Application() {}

    public Application(Job job, User seeker) {
        this.job = job;
        this.seeker = seeker;
        this.status = ApplicationStatus.Applied;
    }

    @PrePersist
    protected void onCreate() {
        this.applicationDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = ApplicationStatus.Applied;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getSeeker() {
        return seeker;
    }

    public void setSeeker(User seeker) {
        this.seeker = seeker;
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
