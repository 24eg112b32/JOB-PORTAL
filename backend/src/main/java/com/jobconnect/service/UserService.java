package com.jobconnect.service;

import com.jobconnect.dto.SeekerProfileRequest;
import com.jobconnect.entity.Company;
import com.jobconnect.entity.JobSeekerProfile;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.CompanyRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobSeekerProfileRepository profileRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public Map<String, Object> getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("createdAt", user.getCreatedAt());

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            JobSeekerProfile profile = profileRepository.findByUser(user)
                    .orElseGet(() -> {
                        JobSeekerProfile newProf = new JobSeekerProfile();
                        newProf.setUser(user);
                        return profileRepository.save(newProf);
                    });
            response.put("phone", profile.getPhone());
            response.put("location", profile.getLocation());
            response.put("skills", profile.getSkills());
            response.put("education", profile.getEducation());
            response.put("experience", profile.getExperience());
            response.put("resume", profile.getResume());
            response.put("profilePicture", profile.getProfilePicture());
        } else if (user.getRole() == Role.ROLE_RECRUITER) {
            Company company = companyRepository.findByRecruiter(user).orElse(null);
            response.put("company", company);
        }

        return response;
    }

    @Transactional
    public Map<String, Object> updateProfile(String email, SeekerProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
            userRepository.save(user);
        }

        if (user.getRole() == Role.ROLE_JOB_SEEKER) {
            JobSeekerProfile profile = profileRepository.findByUser(user)
                    .orElseGet(() -> {
                        JobSeekerProfile newProf = new JobSeekerProfile();
                        newProf.setUser(user);
                        return newProf;
                    });

            if (request.getPhone() != null) profile.setPhone(request.getPhone().trim());
            if (request.getLocation() != null) profile.setLocation(request.getLocation().trim());
            if (request.getSkills() != null) profile.setSkills(request.getSkills().trim());
            if (request.getEducation() != null) profile.setEducation(request.getEducation().trim());
            if (request.getExperience() != null) profile.setExperience(request.getExperience().trim());
            if (request.getResume() != null) profile.setResume(request.getResume().trim());
            if (request.getProfilePicture() != null) profile.setProfilePicture(request.getProfilePicture().trim());

            profileRepository.save(profile);
        }

        return getProfile(email);
    }
}
