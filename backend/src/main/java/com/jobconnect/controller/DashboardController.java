package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.DashboardResponse;
import com.jobconnect.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/seeker")
    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    public ResponseEntity<ApiResponse> getSeekerDashboard(Authentication authentication) {
        String seekerEmail = authentication.getName();
        DashboardResponse dashboard = dashboardService.getSeekerDashboard(seekerEmail);
        return ResponseEntity.ok(ApiResponse.ok("Seeker dashboard data retrieved", dashboard));
    }

    @GetMapping("/recruiter")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> getRecruiterDashboard(Authentication authentication) {
        String recruiterEmail = authentication.getName();
        DashboardResponse dashboard = dashboardService.getRecruiterDashboard(recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("Recruiter dashboard data retrieved", dashboard));
    }
}
