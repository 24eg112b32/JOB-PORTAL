package com.jobconnect.controller;

import com.jobconnect.dto.ApiResponse;
import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.LoginRequest;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("User registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }
}
