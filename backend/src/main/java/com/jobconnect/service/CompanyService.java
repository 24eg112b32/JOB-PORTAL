package com.jobconnect.service;

import com.jobconnect.dto.CompanyRequest;
import com.jobconnect.entity.Company;
import com.jobconnect.entity.Role;
import com.jobconnect.entity.User;
import com.jobconnect.exception.BadRequestException;
import com.jobconnect.exception.ResourceNotFoundException;
import com.jobconnect.repository.CompanyRepository;
import com.jobconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    public Company getCompanyById(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    public Company getCompanyByRecruiterEmail(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + recruiterEmail));

        return companyRepository.findByRecruiter(recruiter)
                .orElseGet(() -> {
                    Company newComp = new Company();
                    newComp.setRecruiter(recruiter);
                    newComp.setCompanyName(recruiter.getName() + " Tech");
                    newComp.setContactEmail(recruiter.getEmail());
                    return companyRepository.save(newComp);
                });
    }

    @Transactional
    public Company saveOrUpdateCompany(String recruiterEmail, CompanyRequest request) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + recruiterEmail));

        if (recruiter.getRole() != Role.ROLE_RECRUITER) {
            throw new BadRequestException("Only recruiters can configure company profiles");
        }

        Company company = companyRepository.findByRecruiter(recruiter)
                .orElseGet(() -> {
                    Company newComp = new Company();
                    newComp.setRecruiter(recruiter);
                    return newComp;
                });

        company.setCompanyName(request.getCompanyName().trim());
        if (request.getDescription() != null) company.setDescription(request.getDescription().trim());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite().trim());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry().trim());
        if (request.getLocation() != null) company.setLocation(request.getLocation().trim());
        if (request.getContactEmail() != null) company.setContactEmail(request.getContactEmail().trim());

        return companyRepository.save(company);
    }
}
