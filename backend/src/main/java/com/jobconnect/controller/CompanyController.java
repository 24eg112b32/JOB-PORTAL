package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.CompanyRequest;
import com.jobconnect.entity.Company;
import com.jobconnect.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCompanyById(@PathVariable Long id) {
        Company company = companyService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.ok("Company details retrieved", company));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> getMyCompany(Authentication authentication) {
        String recruiterEmail = authentication.getName();
        Company company = companyService.getCompanyByRecruiterEmail(recruiterEmail);
        return ResponseEntity.ok(ApiResponse.ok("Recruiter company retrieved", company));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> createOrUpdateCompany(Authentication authentication,
                                                             @Valid @RequestBody CompanyRequest request) {
        String recruiterEmail = authentication.getName();
        Company company = companyService.saveOrUpdateCompany(recruiterEmail, request);
        return ResponseEntity.ok(ApiResponse.ok("Company profile saved successfully", company));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<ApiResponse> updateCompany(@PathVariable Long id,
                                                     Authentication authentication,
                                                     @Valid @RequestBody CompanyRequest request) {
        String recruiterEmail = authentication.getName();
        Company company = companyService.saveOrUpdateCompany(recruiterEmail, request);
        return ResponseEntity.ok(ApiResponse.ok("Company profile updated successfully", company));
    }
}
