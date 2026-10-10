package com.jobconnect.service;

import com.jobconnect.dto.ApplicationRequest;
import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.ApplicationStatusRequest;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobSeekerProfileRepository profileRepository;

    @Transactional
    public ApplicationResponse applyForJob(String seekerEmail, ApplicationRequest request) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + seekerEmail));

        if (seeker.getRole() != Role.ROLE_JOB_SEEKER) {
            throw new BadRequestException("Only registered job seekers can apply for jobs");
        }

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.getJobId()));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job posting is currently inactive");
        }

        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("Application deadline for this job has expired");
        }

        if (applicationRepository.existsByJobIdAndSeekerId(job.getId(), seeker.getId())) {
            throw new BadRequestException("You have already applied for this job");
        }

        Application application = new Application(job, seeker);
        Application saved = applicationRepository.save(application);

        JobSeekerProfile profile = profileRepository.findByUser(seeker).orElse(null);
        return ApplicationResponse.fromEntity(saved, profile);
    }

    public List<ApplicationResponse> getMyApplications(String seekerEmail) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + seekerEmail));

        List<Application> apps = applicationRepository.findBySeekerIdOrderByApplicationDateDesc(seeker.getId());
        JobSeekerProfile profile = profileRepository.findByUser(seeker).orElse(null);

        return apps.stream()
                .map(app -> ApplicationResponse.fromEntity(app, profile))
                .collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsByJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getRecruiter().getEmail().equalsIgnoreCase(recruiterEmail)) {
            throw new AccessDeniedException("You are not authorized to view applicants for this job");
        }

        List<Application> apps = applicationRepository.findByJobIdOrderByApplicationDateDesc(jobId);

        return apps.stream().map(app -> {
            JobSeekerProfile profile = profileRepository.findByUser(app.getSeeker()).orElse(null);
            return ApplicationResponse.fromEntity(app, profile);
        }).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllApplicationsForRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found: " + recruiterEmail));

        List<Application> apps = applicationRepository.findByRecruiterId(recruiter.getId());

        return apps.stream().map(app -> {
            JobSeekerProfile profile = profileRepository.findByUser(app.getSeeker()).orElse(null);
            return ApplicationResponse.fromEntity(app, profile);
        }).collect(Collectors.toList());
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(Long applicationId, String recruiterEmail, ApplicationStatusRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!application.getJob().getRecruiter().getEmail().equalsIgnoreCase(recruiterEmail)) {
            throw new AccessDeniedException("You are not authorized to update this candidate's application");
        }

        application.setStatus(request.getStatus());
        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes().trim());
        }

        Application updated = applicationRepository.save(application);
        JobSeekerProfile profile = profileRepository.findByUser(updated.getSeeker()).orElse(null);

        return ApplicationResponse.fromEntity(updated, profile);
    }
}
