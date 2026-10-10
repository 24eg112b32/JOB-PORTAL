package com.jobconnect.repository;

import com.jobconnect.entity.Application;
import com.jobconnect.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findBySeekerIdOrderByApplicationDateDesc(Long seekerId);

    List<Application> findByJobIdOrderByApplicationDateDesc(Long jobId);

    Optional<Application> findByJobIdAndSeekerId(Long jobId, Long seekerId);

    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);

    long countBySeekerId(Long seekerId);

    long countBySeekerIdAndStatus(Long seekerId, ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId ORDER BY a.applicationDate DESC")
    List<Application> findByRecruiterId(@Param("recruiterId") Long recruiterId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.recruiter.id = :recruiterId")
    long countByRecruiterId(@Param("recruiterId") Long recruiterId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.recruiter.id = :recruiterId AND a.status = :status")
    long countByRecruiterIdAndStatus(@Param("recruiterId") Long recruiterId, @Param("status") ApplicationStatus status);
}
