package com.jobconnect.dto;

import com.jobconnect.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusRequest {

    @NotNull(message = "Status is required (Applied, Shortlisted, Interview, Rejected, Selected)")
    private ApplicationStatus status;

    private String recruiterNotes;

    public ApplicationStatusRequest() {}

    public ApplicationStatusRequest(ApplicationStatus status, String recruiterNotes) {
        this.status = status;
        this.recruiterNotes = recruiterNotes;
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
