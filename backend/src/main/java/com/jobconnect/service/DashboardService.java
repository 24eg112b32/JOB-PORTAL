package com.jobconnect.service;

import com.jobconnect.dto.ApplicationResponse;
import com.jobconnect.dto.DashboardResponse;
import com.jobconnect.dto.JobResponse;
import com.jobconnect.entity.Application;
import com.jobconnect.entity.ApplicationStatus;
import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobSeekerProfile;
import com.jobconnect.entity.User;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.ApplicationRepository;
import com.jobconnect.repository.JobRepository;
import com.jobconnect.repository.JobSeekerProfileRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobSeekerProfileRepository profileRepository;

    public DashboardResponse getSeekerDashboard(String seekerEmail) {
        User seeker = userRepository.findByEmail(seekerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + seekerEmail));

        DashboardResponse res = new DashboardResponse();
        res.setTotalApplications(applicationRepository.countBySeekerId(seeker.getId()));
        res.setAppliedCount(applicationRepository.countBySeekerIdAndStatus(seeker.getId(), ApplicationStatus.Applied));
        res.setShortlistedCount(applicationRepository.countBySeekerIdAndStatus(seeker.getId(), ApplicationStatus.Shortlisted));
        res.setInterviewCount(applicationRepository.countBySeekerIdAndStatus(seeker.getId(), ApplicationStatus.Interview));
        res.setSelectedCount(applicationRepository.countBySeekerIdAndStatus(seeker.getId(), ApplicationStatus.Selected));
        res.setRejectedCount(applicationRepository.countBySeekerIdAndStatus(seeker.getId(), ApplicationStatus.Rejected));

        List<Application> recentApps = applicationRepository.findBySeekerIdOrderByApplicationDateDesc(seeker.getId());
        JobSeekerProfile profile = profileRepository.findByUser(seeker).orElse(null);

        List<ApplicationResponse> recentResponses = recentApps.stream()
                .limit(5)
                .map(app -> ApplicationResponse.fromEntity(app, profile))
                .collect(Collectors.toList());
        res.setRecentApplications(recentResponses);

        return res;
    }

    public DashboardResponse getRecruiterDashboard(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found: " + recruiterEmail));

        DashboardResponse res = new DashboardResponse();
        res.setTotalJobsPosted(jobRepository.countByRecruiterId(recruiter.getId()));
        res.setActiveJobs(jobRepository.countByRecruiterIdAndStatus(recruiter.getId(), JobStatus.ACTIVE));
        res.setTotalApplications(applicationRepository.countByRecruiterId(recruiter.getId()));
        res.setShortlistedCount(applicationRepository.countByRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.Shortlisted));
        res.setInterviewCount(applicationRepository.countByRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.Interview));
        res.setSelectedCount(applicationRepository.countByRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.Selected));
        res.setAppliedCount(applicationRepository.countByRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.Applied));
        res.setRejectedCount(applicationRepository.countByRecruiterIdAndStatus(recruiter.getId(), ApplicationStatus.Rejected));

        List<Application> recentApps = applicationRepository.findByRecruiterId(recruiter.getId());
        List<ApplicationResponse> recentResponses = recentApps.stream()
                .limit(5)
                .map(app -> {
                    JobSeekerProfile p = profileRepository.findByUser(app.getSeeker()).orElse(null);
                    return ApplicationResponse.fromEntity(app, p);
                })
                .collect(Collectors.toList());
        res.setRecentApplications(recentResponses);

        List<Job> recentJobs = jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId());
        List<JobResponse> recentJobResponses = recentJobs.stream()
                .limit(5)
                .map(j -> {
                    JobResponse jr = JobResponse.fromEntity(j);
                    jr.setApplicantCount(applicationRepository.findByJobIdOrderByApplicationDateDesc(j.getId()).size());
                    return jr;
                })
                .collect(Collectors.toList());
        res.setRecentJobs(recentJobResponses);

        return res;
    }
}
