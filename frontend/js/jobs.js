/**
 * JobConnect - Job Search, Listing & Details Module
 */

const Jobs = {
  async loadJobs(filters = {}) {
    const listContainer = document.getElementById('jobs-list-container');
    const countContainer = document.getElementById('job-results-count');
    if (!listContainer) return;

    listContainer.innerHTML = `
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <div class="text-muted mt-2">Loading opportunities...</div>
      </div>
    `;

    try {
      const query = new URLSearchParams();
      if (filters.keyword) query.append('keyword', filters.keyword);
      if (filters.location) query.append('location', filters.location);
      if (filters.skills) query.append('skills', filters.skills);
      if (filters.jobType && filters.jobType !== 'ALL') query.append('jobType', filters.jobType);
      if (filters.experience && filters.experience !== 'ALL') query.append('experience', filters.experience);

      const res = await API.get('/jobs?' + query.toString());
      const jobs = res.data || [];

      if (countContainer) {
        countContainer.textContent = `${jobs.length} Job${jobs.length === 1 ? '' : 's'} Found`;
      }

      if (jobs.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state">
            <i class="bi bi-search"></i>
            <h4>No Jobs Found</h4>
            <p class="text-muted">No positions match your selected criteria. Try adjusting your search keywords or filters.</p>
            <button class="btn btn-outline-primary btn-sm mt-2" onclick="Jobs.resetFilters()">Clear Filters</button>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = jobs.map(job => this.renderJobCard(job)).join('');
    } catch (err) {
      listContainer.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-octagon me-2"></i> Failed to load jobs: ${err.message}
        </div>
      `;
    }
  },

  renderJobCard(job) {
    const typeLabel = job.jobType ? job.jobType.replace('_', ' ') : 'Full Time';
    const skillsList = job.skills ? job.skills.split(',').map(s => s.trim()) : [];
    const formattedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

    return `
      <div class="job-card">
        <div class="job-card-header">
          <div>
            <h5 class="mb-1"><a href="job-details.html?id=${job.id}" class="job-title">${job.title}</a></h5>
            <div class="job-company"><i class="bi bi-building"></i> ${job.companyName}</div>
          </div>
          <span class="badge-job-type text-uppercase">${typeLabel}</span>
        </div>

        <div class="job-meta-row">
          <span class="job-meta-item"><i class="bi bi-geo-alt"></i> ${job.location}</span>
          <span class="job-meta-item"><i class="bi bi-briefcase"></i> ${job.experience}</span>
          <span class="job-meta-item"><i class="bi bi-cash-stack"></i> ${job.salary || 'Competitive'}</span>
          <span class="job-meta-item"><i class="bi bi-people"></i> ${job.openings || 1} Openings</span>
        </div>

        <p class="text-muted small mb-3 text-truncate-2">
          ${job.description ? job.description.substring(0, 150) + '...' : ''}
        </p>

        <div class="job-skills-wrap">
          ${skillsList.slice(0, 5).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          ${skillsList.length > 5 ? `<span class="skill-tag text-muted">+${skillsList.length - 5} more</span>` : ''}
        </div>

        <div class="job-card-footer">
          <span class="job-posted-date"><i class="bi bi-clock me-1"></i> Posted ${formattedDate}</span>
          <div class="d-flex gap-2">
            <a href="job-details.html?id=${job.id}" class="btn btn-sm btn-outline-primary">View Details</a>
            ${Auth.isSeeker() ? `
              <button class="btn btn-sm btn-primary" onclick="Applications.quickApply(${job.id}, this)">
                Apply Now
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  resetFilters() {
    const form = document.getElementById('job-filter-form');
    if (form) form.reset();
    this.loadJobs();
  },

  async loadJobDetails() {
    const detailsContainer = document.getElementById('job-details-root');
    if (!detailsContainer) return;

    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    if (!jobId) {
      detailsContainer.innerHTML = `
        <div class="alert alert-warning">
          <h5>No Job Selected</h5>
          <p>Please browse our open positions and select a job to see full details.</p>
          <a href="jobs.html" class="btn btn-primary">Browse Jobs</a>
        </div>
      `;
      return;
    }

    try {
      const res = await API.get(`/jobs/${jobId}`);
      const job = res.data;

      if (!job) throw new Error('Job not found');

      const skillsList = job.skills ? job.skills.split(',').map(s => s.trim()) : [];
      const isJobSeeker = Auth.isSeeker();
      const isRecruiter = Auth.isRecruiter();
      const hasApplied = !!job.hasApplied;

      detailsContainer.innerHTML = `
        <div class="row g-4">
          <!-- Main Details -->
          <div class="col-lg-8">
            <div class="job-details-header-card">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div>
                  <span class="badge-job-type text-uppercase mb-2 d-inline-block">${job.jobType}</span>
                  <h2 class="fw-bold mb-2">${job.title}</h2>
                  <h5 class="text-primary fw-semibold mb-3">
                    <i class="bi bi-building me-1"></i> ${job.companyName}
                  </h5>
                  <div class="job-meta-row">
                    <span class="job-meta-item"><i class="bi bi-geo-alt"></i> ${job.location}</span>
                    <span class="job-meta-item"><i class="bi bi-cash-stack"></i> ${job.salary || 'Competitive'}</span>
                    <span class="job-meta-item"><i class="bi bi-people"></i> ${job.applicantCount || 0} Applicants</span>
                  </div>
                </div>

                <div>
                  ${hasApplied ? `
                    <button class="btn btn-success px-4 py-2" disabled>
                      <i class="bi bi-check-circle-fill me-1"></i> Applied
                    </button>
                  ` : isJobSeeker ? `
                    <button id="btn-apply-job" class="btn btn-primary px-4 py-2" onclick="Applications.applyForJob(${job.id})">
                      <i class="bi bi-send-fill me-1"></i> Apply Now
                    </button>
                  ` : isRecruiter ? `
                    <span class="badge bg-secondary-subtle text-secondary p-2">Recruiter View</span>
                  ` : `
                    <a href="login.html?redirect=job-details.html?id=${job.id}" class="btn btn-primary px-4 py-2">
                      Login to Apply
                    </a>
                  `}
                </div>
              </div>
            </div>

            <!-- Job Description -->
            <div class="job-details-body-card">
              <h4 class="fw-bold mb-3">Job Description</h4>
              <p class="text-muted leading-relaxed" style="white-space: pre-line;">${job.description}</p>

              ${job.requirements ? `
                <h4 class="fw-bold mt-4 mb-3">Responsibilities & Requirements</h4>
                <p class="text-muted leading-relaxed" style="white-space: pre-line;">${job.requirements}</p>
              ` : ''}

              <h4 class="fw-bold mt-4 mb-3">Required Skills & Technologies</h4>
              <div class="job-skills-wrap">
                ${skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
              </div>
            </div>
          </div>

          <!-- Job Overview Sidebar -->
          <div class="col-lg-4">
            <div class="job-overview-sidebar-card">
              <h5 class="fw-bold mb-4 pb-2 border-bottom">Job Overview</h5>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-calendar3"></i></div>
                <div>
                  <small class="text-muted d-block">Posted Date</small>
                  <span class="fw-semibold">${new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-hourglass-split"></i></div>
                <div>
                  <small class="text-muted d-block">Application Deadline</small>
                  <span class="fw-semibold text-danger">${job.deadline || 'Open'}</span>
                </div>
              </div>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-geo-alt"></i></div>
                <div>
                  <small class="text-muted d-block">Job Location</small>
                  <span class="fw-semibold">${job.location}</span>
                </div>
              </div>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-briefcase"></i></div>
                <div>
                  <small class="text-muted d-block">Experience Level</small>
                  <span class="fw-semibold">${job.experience}</span>
                </div>
              </div>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-cash-coin"></i></div>
                <div>
                  <small class="text-muted d-block">Offered Salary</small>
                  <span class="fw-semibold">${job.salary || 'Negotiable'}</span>
                </div>
              </div>

              <div class="overview-item">
                <div class="overview-icon"><i class="bi bi-person-workspace"></i></div>
                <div>
                  <small class="text-muted d-block">Job Type</small>
                  <span class="fw-semibold">${job.jobType}</span>
                </div>
              </div>

              <div class="mt-4 pt-3 border-top text-center">
                <a href="jobs.html" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-arrow-left me-1"></i> Back to All Jobs
                </a>
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      detailsContainer.innerHTML = `
        <div class="alert alert-danger">
          <h4>Failed to load job details</h4>
          <p>${err.message}</p>
          <a href="jobs.html" class="btn btn-outline-primary">Return to Jobs</a>
        </div>
      `;
    }
  }
};
