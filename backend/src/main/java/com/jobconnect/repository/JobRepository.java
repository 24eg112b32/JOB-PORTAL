package com.jobconnect.repository;

import com.jobconnect.entity.Job;
import com.jobconnect.entity.JobStatus;
import com.jobconnect.entity.JobType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);

    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    long countByRecruiterId(Long recruiterId);

    long countByRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND (" +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:skills IS NULL OR LOWER(j.skills) LIKE LOWER(CONCAT('%', :skills, '%'))) AND " +
           "(:jobType IS NULL OR j.jobType = :jobType) AND " +
           "(:experience IS NULL OR LOWER(j.experience) LIKE LOWER(CONCAT('%', :experience, '%')))" +
           ") ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("skills") String skills,
            @Param("jobType") JobType jobType,
            @Param("experience") String experience
    );
}
