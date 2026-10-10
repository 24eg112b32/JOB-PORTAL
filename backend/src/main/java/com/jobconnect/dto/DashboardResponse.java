package com.jobconnect.dto;

import java.util.List;

public class DashboardResponse {

    // Common/Seeker metrics
    private long totalApplications;
    private long appliedCount;
    private long shortlistedCount;
    private long interviewCount;
    private long selectedCount;
    private long rejectedCount;

    // Recruiter specific metrics
    private long totalJobsPosted;
    private long activeJobs;

    // Recent items
    private List<?> recentApplications;
    private List<?> recentJobs;

    public DashboardResponse() {}

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getAppliedCount() {
        return appliedCount;
    }

    public void setAppliedCount(long appliedCount) {
        this.appliedCount = appliedCount;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getInterviewCount() {
        return interviewCount;
    }

    public void setInterviewCount(long interviewCount) {
        this.interviewCount = interviewCount;
    }

    public long getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(long selectedCount) {
        this.selectedCount = selectedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public long getTotalJobsPosted() {
        return totalJobsPosted;
    }

    public void setTotalJobsPosted(long totalJobsPosted) {
        this.totalJobsPosted = totalJobsPosted;
    }

    public long getActiveJobs() {
        return activeJobs;
    }

    public void setActiveJobs(long activeJobs) {
        this.activeJobs = activeJobs;
    }

    public List<?> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<?> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public List<?> getRecentJobs() {
        return recentJobs;
    }

    public void setRecentJobs(List<?> recentJobs) {
        this.recentJobs = recentJobs;
    }
}
