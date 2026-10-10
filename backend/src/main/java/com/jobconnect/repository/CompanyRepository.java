package com.jobconnect.repository;

import com.jobconnect.entity.Company;
import com.jobconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByRecruiter(User recruiter);
    Optional<Company> findByRecruiterId(Long recruiterId);
}
