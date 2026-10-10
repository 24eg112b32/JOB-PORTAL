package com.jobconnect.service;

import com.jobconnect.dto.JobRequest;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.entity.*;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.CompanyRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<JobResponse> searchJobs(String keyword, String location, String skills, String jobTypeStr, String experience) {
        JobType jobType = null;
        if (jobTypeStr != null && !jobTypeStr.trim().isEmpty() && !jobTypeStr.equalsIgnoreCase("ALL")) {
            try {
                jobType = JobType.valueOf(jobTypeStr.trim().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        String loc = (location != null && !location.trim().isEmpty()) ? location.trim() : null;
        String skl = (skills != null && !skills.trim().isEmpty()) ? skills.trim() : null;
        String exp = (experience != null && !experience.trim().isEmpty() && !experience.equalsIgnoreCase("ALL")) ? experience.trim() : null;

        List<Job> jobs = jobRepository.searchJobs(kw, loc, skl, jobType, exp);

        return jobs.stream().map(job -> {
            JobResponse res = JobResponse.fromEntity(job);
            res.setApplicantCount(applicationRepository.findByJobIdOrderByApplicationDateDesc(job.getId()).size());
            return res;
        }).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id, String currentUserEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        JobResponse res = JobResponse.fromEntity(job);
        res.setApplicantCount(applicationRepository.findByJobIdOrderByApplicationDateDesc(job.getId()).size());

        if (currentUserEmail != null) {
            userRepository.findByEmail(currentUserEmail).ifPresent(user -> {
                if (user.getRole() == Role.ROLE_JOB_SEEKER) {
                    res.setHasApplied(applicationRepository.existsByJobIdAndSeekerId(job.getId(), user.getId()));
                }
            });
        }

        return res;
    }

    @Transactional
    public JobResponse createJob(String recruiterEmail, JobRequest request) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found: " + recruiterEmail));

        Company company = companyRepository.findByRecruiter(recruiter).orElse(null);

        Job job = new Job();
        job.setRecruiter(recruiter);
        job.setCompany(company);
        job.setTitle(request.getTitle().trim());

        // Set company name from profile or request
        String compName = (company != null && company.getCompanyName() != null && !company.getCompanyName().isEmpty())
                ? company.getCompanyName()
                : (request.getCompanyName() != null ? request.getCompanyName().trim() : recruiter.getName() + " Tech");
        job.setCompanyName(compName);

        job.setDescription(request.getDescription().trim());
        job.setRequirements(request.getRequirements() != null ? request.getRequirements().trim() : "");
        job.setSkills(request.getSkills().trim());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setExperience(request.getExperience().trim());
        job.setSalary(request.getSalary() != null ? request.getSalary().trim() : "Negotiable");
        job.setOpenings(request.getOpenings() != null ? request.getOpenings() : 1);
        job.setDeadline(request.getDeadline());
        job.setStatus(request.getStatus() != null ? request.getStatus() : JobStatus.ACTIVE);

        Job savedJob = jobRepository.save(job);
        return JobResponse.fromEntity(savedJob);
    }

    @Transactional
    public JobResponse updateJob(Long id, String recruiterEmail, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getRecruiter().getEmail().equalsIgnoreCase(recruiterEmail)) {
            throw new AccessDeniedException("You are not authorized to update this job");
        }

        job.setTitle(request.getTitle().trim());
        if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
            job.setCompanyName(request.getCompanyName().trim());
        }
        job.setDescription(request.getDescription().trim());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements().trim());
        job.setSkills(request.getSkills().trim());
        job.setLocation(request.getLocation().trim());
        job.setJobType(request.getJobType());
        job.setExperience(request.getExperience().trim());
        if (request.getSalary() != null) job.setSalary(request.getSalary().trim());
        if (request.getOpenings() != null) job.setOpenings(request.getOpenings());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        Job updated = jobRepository.save(job);
        JobResponse res = JobResponse.fromEntity(updated);
        res.setApplicantCount(applicationRepository.findByJobIdOrderByApplicationDateDesc(job.getId()).size());
        return res;
    }

    @Transactional
    public void deleteJob(Long id, String recruiterEmail) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getRecruiter().getEmail().equalsIgnoreCase(recruiterEmail)) {
            throw new AccessDeniedException("You are not authorized to delete this job");
        }

        jobRepository.delete(job);
    }

    public List<JobResponse> getJobsByRecruiter(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found: " + recruiterEmail));

        List<Job> jobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId());

        return jobs.stream().map(job -> {
            JobResponse res = JobResponse.fromEntity(job);
            res.setApplicantCount(applicationRepository.findByJobIdOrderByApplicationDateDesc(job.getId()).size());
            return res;
        }).collect(Collectors.toList());
    }
}
