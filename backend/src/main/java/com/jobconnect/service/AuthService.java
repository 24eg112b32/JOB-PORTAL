package com.jobconnect.service;

import com.jobconnect.dto.AuthResponse;
import com.jobconnect.dto.LoginRequest;
import com.jobconnect.dto.RegisterRequest;
import com.jobconnect.entity.Company;
import com.jobconnect.entity.JobSeekerProfile;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.repository.CompanyRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.UserRepository;
import com.jobconnect.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobSeekerProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                encoder.encode(request.getPassword()),
                request.getRole()
        );

        User savedUser = userRepository.save(user);

        // Pre-create empty associated profile/company
        if (savedUser.getRole() == Role.ROLE_RECRUITER) {
            Company company = new Company();
            company.setRecruiter(savedUser);
            company.setCompanyName(savedUser.getName() + " Inc.");
            company.setContactEmail(savedUser.getEmail());
            companyRepository.save(company);
        } else {
            JobSeekerProfile profile = new JobSeekerProfile();
            profile.setUser(savedUser);
            profileRepository.save(profile);
        }

        // Authenticate automatically after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new AuthResponse(jwt, savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("User not found"));

        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
