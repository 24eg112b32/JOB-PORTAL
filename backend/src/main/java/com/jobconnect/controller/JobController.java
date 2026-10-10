package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.JobRequest;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experience
    ) {
        List<JobResponse> jobs = jobService.searchJobs(keyword, location, skills, jobType, experience);
        return ResponseEntity.ok(ApiResponse.ok("Jobs retrieved successfully", jobs));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getJobById(@PathVariable Long id, Authentication authentication) {
        String currentUserEmail = (authentication != null) ? authentication.getName() : null;
        JobResponse job = jobService.getJobById(id, currentUserEmail);
        return ResponseEntity.ok(ApiResponse.ok("Job details retrieved", job));
    }

    @GetMapping("/recruiter/my")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> getMyPostedJobs(Authentication authentication) {
        String recruiterEmail = authentication.getName();
        List<JobResponse> jobs = jobService.getJobsByRecruiter(recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("Recruiter jobs retrieved", jobs));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> createJob(Authentication authentication,
                                                 @Valid @RequestBody JobRequest request) {
        String recruiterEmail = authentication.getName();
        JobResponse created = jobService.createJob(recruiterEmail, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Job posted successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> updateJob(@PathVariable Long id,
                                                 Authentication authentication,
                                                 @Valid @RequestBody JobRequest request) {
        String recruiterEmail = authentication.getName();
        JobResponse updated = jobService.updateJob(id, recruiterEmail, request);
        return ResponseEntity.ok(ApiResponse.ok("Job updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long id, Authentication authentication) {
        String recruiterEmail = authentication.getName();
        jobService.deleteJob(id, recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("Job deleted successfully"));
    }
}
