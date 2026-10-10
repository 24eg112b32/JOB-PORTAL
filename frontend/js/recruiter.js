/**
 * JobConnect - Recruiter Management Module
 * Handles company profile, job posting, job editing/deletion, and applicant review.
 */

const Recruiter = {
  // Load and save Company Profile
  async loadCompanyProfile() {
    const form = document.getElementById('company-profile-form');
    if (!form) return;

    try {
      const res = await API.get('/companies/my');
      const comp = res.data || {};

      document.getElementById('company-name').value = comp.companyName || '';
      document.getElementById('company-description').value = comp.description || '';
      document.getElementById('company-website').value = comp.website || '';
      document.getElementById('company-industry').value = comp.industry || '';
      document.getElementById('company-location').value = comp.location || '';
      document.getElementById('company-email').value = comp.contactEmail || '';

      const nameDisplay = document.getElementById('company-preview-name');
      if (nameDisplay) nameDisplay.textContent = comp.companyName || 'My Company';
    } catch (err) {
      API.showAlert('Could not load company details: ' + err.message, 'danger');
    }
  },

  async saveCompanyProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-save-company');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    }

    const payload = {
      companyName: document.getElementById('company-name').value.trim(),
      description: document.getElementById('company-description').value.trim(),
      website: document.getElementById('company-website').value.trim(),
      industry: document.getElementById('company-industry').value.trim(),
      location: document.getElementById('company-location').value.trim(),
      contactEmail: document.getElementById('company-email').value.trim()
    };

    try {
      const res = await API.post('/companies', payload);
      if (res.success) {
        API.showAlert('Company profile saved successfully!', 'success');
        const nameDisplay = document.getElementById('company-preview-name');
        if (nameDisplay) nameDisplay.textContent = payload.companyName;
      } else {
        API.showAlert(res.message || 'Failed to save company profile', 'danger');
      }
    } catch (err) {
      API.showAlert(err.message || 'Error saving company', 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Save Company Profile';
      }
    }
  },

  // Post New Job
  async postJob(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-job');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Posting...';
    }

    const payload = {
      title: document.getElementById('job-title').value.trim(),
      companyName: document.getElementById('job-company')?.value.trim() || undefined,
      jobType: document.getElementById('job-type').value,
      location: document.getElementById('job-location').value.trim(),
      experience: document.getElementById('job-experience').value.trim(),
      salary: document.getElementById('job-salary').value.trim(),
      openings: parseInt(document.getElementById('job-openings').value) || 1,
      deadline: document.getElementById('job-deadline').value,
      skills: document.getElementById('job-skills').value.trim(),
      description: document.getElementById('job-description').value.trim(),
      requirements: document.getElementById('job-requirements').value.trim(),
      status: 'ACTIVE'
    };

    try {
      const res = await API.post('/jobs', payload);
      if (res.success) {
        API.showAlert('Job posted successfully! Candidates can now apply.', 'success');
        setTimeout(() => {
          window.location.href = 'manage-jobs.html';
        }, 1000);
      } else {
        API.showAlert(res.message || 'Failed to post job', 'danger');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-send me-1"></i> Publish Job';
        }
      }
    } catch (err) {
      API.showAlert(err.message || 'Error posting job', 'danger');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send me-1"></i> Publish Job';
      }
    }
  },

  // Load Recruiter's Posted Jobs
  async loadPostedJobs() {
    const tableBody = document.getElementById('posted-jobs-table-body');
    const totalCountElem = document.getElementById('recruiter-total-jobs-count');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="text-muted mt-2">Loading posted jobs...</div>
        </td>
      </tr>
    `;

    try {
      const res = await API.get('/jobs/recruiter/my');
      const jobs = res.data || [];

      if (totalCountElem) totalCountElem.textContent = jobs.length;

      if (jobs.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" class="text-center py-5">
              <i class="bi bi-briefcase display-6 text-muted mb-2 d-block"></i>
              <h5>No Jobs Posted Yet</h5>
              <p class="text-muted">You haven't posted any jobs yet. Create your first opening now!</p>
              <a href="post-job.html" class="btn btn-primary btn-sm">Post a Job</a>
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = jobs.map(j => {
        const isActive = j.status === 'ACTIVE';
        return `
          <tr>
            <td>
              <div class="fw-bold text-dark">${j.title}</div>
              <small class="text-muted"><i class="bi bi-geo-alt"></i> ${j.location}</small>
            </td>
            <td>
              <span class="badge-job-type">${j.jobType ? j.jobType.replace('_', ' ') : 'Full Time'}</span>
            </td>
            <td>
              <a href="applicants.html?jobId=${j.id}" class="badge bg-primary text-decoration-none px-2 py-1">
                <i class="bi bi-people-fill me-1"></i> ${j.applicantCount || 0} Applicants
              </a>
            </td>
            <td><small class="text-muted">${j.deadline || 'None'}</small></td>
            <td>
              <button class="btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-secondary'}" onclick="Recruiter.toggleJobStatus(${j.id}, '${isActive ? 'INACTIVE' : 'ACTIVE'}')">
                <i class="bi ${isActive ? 'bi-toggle-on text-success' : 'bi-toggle-off'} me-1"></i> ${j.status}
              </button>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <a href="job-details.html?id=${j.id}" class="btn btn-outline-secondary" title="Preview Job"><i class="bi bi-eye"></i></a>
                <button class="btn btn-outline-primary" onclick="Recruiter.openEditModal(${j.id})" title="Edit Job"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger" onclick="Recruiter.deleteJob(${j.id})" title="Delete Job"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-4">Failed to load jobs: ${err.message}</td></tr>`;
    }
  },

  async toggleJobStatus(jobId, newStatus) {
    try {
      const res = await API.get(`/jobs/${jobId}`);
      const job = res.data;
      job.status = newStatus;
      await API.put(`/jobs/${jobId}`, job);
      API.showAlert(`Job status set to ${newStatus}`, 'success');
      this.loadPostedJobs();
    } catch (err) {
      API.showAlert('Failed to update status: ' + err.message, 'danger');
    }
  },

  async deleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job posting? All candidate applications will also be removed.')) {
      return;
    }

    try {
      await API.delete(`/jobs/${jobId}`);
      API.showAlert('Job deleted successfully', 'success');
      this.loadPostedJobs();
    } catch (err) {
      API.showAlert('Failed to delete job: ' + err.message, 'danger');
    }
  },

  async openEditModal(jobId) {
    try {
      const res = await API.get(`/jobs/${jobId}`);
      const job = res.data;

      document.getElementById('edit-job-id').value = job.id;
      document.getElementById('edit-job-title').value = job.title;
      document.getElementById('edit-job-type').value = job.jobType;
      document.getElementById('edit-job-location').value = job.location;
      document.getElementById('edit-job-experience').value = job.experience;
      document.getElementById('edit-job-salary').value = job.salary || '';
      document.getElementById('edit-job-openings').value = job.openings || 1;
      document.getElementById('edit-job-deadline').value = job.deadline || '';
      document.getElementById('edit-job-skills').value = job.skills || '';
      document.getElementById('edit-job-description').value = job.description || '';
      document.getElementById('edit-job-requirements').value = job.requirements || '';
      document.getElementById('edit-job-status').value = job.status || 'ACTIVE';

      const modal = new bootstrap.Modal(document.getElementById('editJobModal'));
      modal.show();
    } catch (err) {
      API.showAlert('Could not fetch job for editing: ' + err.message, 'danger');
    }
  },

  async submitEditJob(e) {
    e.preventDefault();
    const jobId = document.getElementById('edit-job-id').value;
    const payload = {
      title: document.getElementById('edit-job-title').value.trim(),
      jobType: document.getElementById('edit-job-type').value,
      location: document.getElementById('edit-job-location').value.trim(),
      experience: document.getElementById('edit-job-experience').value.trim(),
      salary: document.getElementById('edit-job-salary').value.trim(),
      openings: parseInt(document.getElementById('edit-job-openings').value) || 1,
      deadline: document.getElementById('edit-job-deadline').value,
      skills: document.getElementById('edit-job-skills').value.trim(),
      description: document.getElementById('edit-job-description').value.trim(),
      requirements: document.getElementById('edit-job-requirements').value.trim(),
      status: document.getElementById('edit-job-status').value
    };

    try {
      await API.put(`/jobs/${jobId}`, payload);
      API.showAlert('Job updated successfully!', 'success');
      const modalElem = document.getElementById('editJobModal');
      const modal = bootstrap.Modal.getInstance(modalElem);
      if (modal) modal.hide();
      this.loadPostedJobs();
    } catch (err) {
      API.showAlert('Error updating job: ' + err.message, 'danger');
    }
  },

  // Load Applicants for Applicants Page
  async loadApplicants() {
    const tableBody = document.getElementById('applicants-table-body');
    const jobSelect = document.getElementById('filter-applicant-job');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="text-muted mt-2">Loading candidate applications...</div>
        </td>
      </tr>
    `;

    try {
      // First populate jobs filter dropdown if needed
      const jobsRes = await API.get('/jobs/recruiter/my');
      const myJobs = jobsRes.data || [];

      if (jobSelect && jobSelect.children.length <= 1) {
        myJobs.forEach(job => {
          const opt = document.createElement('option');
          opt.value = job.id;
          opt.textContent = `${job.title} (${job.location})`;
          jobSelect.appendChild(opt);
        });
      }

      // Read query param if passed
      const params = new URLSearchParams(window.location.search);
      const selectedJobId = params.get('jobId') || (jobSelect ? jobSelect.value : '');

      if (jobSelect && selectedJobId) {
        jobSelect.value = selectedJobId;
      }

      let res;
      if (selectedJobId) {
        res = await API.get(`/applications/job/${selectedJobId}`);
      } else {
        res = await API.get('/applications/recruiter/all');
      }

      const applicants = res.data || [];
      const countDisplay = document.getElementById('total-applicants-count');
      if (countDisplay) countDisplay.textContent = applicants.length;

      if (applicants.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5">
              <i class="bi bi-people display-6 text-muted mb-2 d-block"></i>
              <h5>No Applications Found</h5>
              <p class="text-muted">No candidates have applied to the selected criteria yet.</p>
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = applicants.map(app => {
        const dateStr = new Date(app.applicationDate || Date.now()).toLocaleDateString();
        return `
          <tr>
            <td>
              <div class="fw-bold text-dark">${app.seekerName || 'Candidate'}</div>
              <small class="text-muted">${app.seekerEmail || 'No email'}</small>
            </td>
            <td>
              <div class="fw-semibold text-primary">${app.jobTitle || 'Role'}</div>
            </td>
            <td>${dateStr}</td>
            <td>${Applications.getStatusBadge(app.status)}</td>
            <td>
              <div class="text-truncate small text-muted" style="max-width: 150px;">
                ${app.recruiterNotes || 'No notes'}
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" onclick="Recruiter.viewCandidateDetails(${encodeURIComponent(JSON.stringify(app))})">
                  <i class="bi bi-person-lines-fill me-1"></i> Review
                </button>
                <button class="btn btn-primary" onclick="Recruiter.openStatusModal(${app.id}, '${app.status}', '${(app.recruiterNotes || '').replace(/'/g, "\\'")}')">
                  Update Status
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-danger text-center py-4">Failed to load applicants: ${err.message}</td></tr>`;
    }
  },

  viewCandidateDetails(appDataStr) {
    const app = typeof appDataStr === 'string' ? JSON.parse(decodeURIComponent(appDataStr)) : appDataStr;

    document.getElementById('modal-cand-name').textContent = app.seekerName || 'N/A';
    document.getElementById('modal-cand-email').textContent = app.seekerEmail || 'N/A';
    document.getElementById('modal-cand-phone').textContent = app.seekerPhone || 'Not provided';
    document.getElementById('modal-cand-location').textContent = app.seekerLocation || 'Not provided';
    document.getElementById('modal-cand-education').textContent = app.seekerEducation || 'Not provided';
    document.getElementById('modal-cand-experience').textContent = app.seekerExperience || 'Not provided';
    document.getElementById('modal-cand-skills').textContent = app.seekerSkills || 'Not provided';
    document.getElementById('modal-cand-job').textContent = app.jobTitle || 'N/A';

    const resumeContainer = document.getElementById('modal-cand-resume-container');
    if (app.seekerResume) {
      resumeContainer.innerHTML = `
        <span class="badge bg-success-subtle text-success p-2">
          <i class="bi bi-file-earmark-pdf me-1"></i> ${app.seekerResume}
        </span>
      `;
    } else {
      resumeContainer.innerHTML = `<span class="text-muted">Resume not uploaded</span>`;
    }

    const modal = new bootstrap.Modal(document.getElementById('candidateModal'));
    modal.show();
  },

  openStatusModal(appId, currentStatus, currentNotes) {
    document.getElementById('status-app-id').value = appId;
    document.getElementById('status-select').value = currentStatus || 'Applied';
    document.getElementById('status-notes').value = currentNotes || '';

    const modal = new bootstrap.Modal(document.getElementById('updateStatusModal'));
    modal.show();
  },

  async submitStatusUpdate(e) {
    e.preventDefault();
    const appId = document.getElementById('status-app-id').value;
    const status = document.getElementById('status-select').value;
    const recruiterNotes = document.getElementById('status-notes').value.trim();

    try {
      await API.put(`/applications/${appId}/status`, { status, recruiterNotes });
      API.showAlert('Candidate status updated successfully!', 'success');
      const modal = bootstrap.Modal.getInstance(document.getElementById('updateStatusModal'));
      if (modal) modal.hide();
      this.loadApplicants();
    } catch (err) {
      API.showAlert('Error updating status: ' + err.message, 'danger');
    }
  }
};
