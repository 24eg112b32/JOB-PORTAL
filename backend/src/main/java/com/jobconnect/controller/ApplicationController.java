package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.ApplicationRequest;
import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.ApplicationStatusRequest;
import com.jobconnect.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<ApiResponse> applyForJob(Authentication authentication,
                                                   @Valid @RequestBody ApplicationRequest request) {
        String seekerEmail = authentication.getName();
        ApplicationResponse response = applicationService.applyForJob(seekerEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Application submitted successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<ApiResponse> getMyApplications(Authentication authentication) {
        String seekerEmail = authentication.getName();
        List<ApplicationResponse> applications = applicationService.getMyApplications(seekerEmail);
        return ResponseEntity.ok(ApiResponse.ok("Applications retrieved successfully", applications));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> getApplicationsForJob(@PathVariable Long jobId,
                                                             Authentication authentication) {
        String recruiterEmail = authentication.getName();
        List<ApplicationResponse> applications = applicationService.getApplicationsByJob(jobId, recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("Job applicants retrieved successfully", applications));
    }

    @GetMapping("/recruiter/all")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> getAllApplicationsForRecruiter(Authentication authentication) {
        String recruiterEmail = authentication.getName();
        List<ApplicationResponse> applications = applicationService.getAllApplicationsForRecruiter(recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("All applicants retrieved successfully", applications));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> updateApplicationStatus(@PathVariable Long id,
                                                               Authentication authentication,
                                                               @Valid @RequestBody ApplicationStatusRequest request) {
        String recruiterEmail = authentication.getName();
        ApplicationResponse response = applicationService.updateApplicationStatus(id, recruiterEmail, request);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated successfully", response));
    }
}
