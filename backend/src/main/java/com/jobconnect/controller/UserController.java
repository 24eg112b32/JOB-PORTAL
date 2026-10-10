package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.SeekerProfileRequest;
import com.jobconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Map<String, Object> profile = userService.getProfile(email);
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse> updateProfile(Authentication authentication,
                                                     @RequestBody SeekerProfileRequest request) {
        String email = authentication.getName();
        Map<String, Object> updated = userService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }
}
