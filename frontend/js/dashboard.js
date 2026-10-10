/**
 * JobConnect - Dashboard Statistics & Metrics
 */

const Dashboard = {
  // Load Seeker Dashboard Metrics
  async loadSeekerDashboard() {
    try {
      const res = await API.get('/dashboard/seeker');
      const data = res.data || {};

      document.getElementById('seeker-total-apps').textContent = data.totalApplications || 0;
      document.getElementById('seeker-applied-count').textContent = data.appliedCount || 0;
      document.getElementById('seeker-shortlisted-count').textContent = data.shortlistedCount || 0;
      document.getElementById('seeker-interview-count').textContent = data.interviewCount || 0;
      document.getElementById('seeker-selected-count').textContent = data.selectedCount || 0;

      const recentContainer = document.getElementById('seeker-recent-apps-body');
      if (recentContainer) {
        const recent = data.recentApplications || [];
        if (recent.length === 0) {
          recentContainer.innerHTML = `
            <tr>
              <td colspan="5" class="text-center py-4 text-muted">
                No job applications submitted yet.
              </td>
            </tr>
          `;
        } else {
          recentContainer.innerHTML = recent.map(app => {
            const dateStr = new Date(app.applicationDate || Date.now()).toLocaleDateString();
            return `
              <tr>
                <td>
                  <div class="fw-bold text-dark">${app.jobTitle || 'Role'}</div>
                  <small class="text-muted"><i class="bi bi-geo-alt"></i> ${app.location || 'Remote'}</small>
                </td>
                <td class="text-primary fw-semibold">${app.companyName || 'Company'}</td>
                <td><span class="badge-job-type">${app.jobType ? app.jobType.replace('_', ' ') : 'Full Time'}</span></td>
                <td>${dateStr}</td>
                <td>${Applications.getStatusBadge(app.status)}</td>
              </tr>
            `;
          }).join('');
        }
      }
    } catch (err) {
      console.error('Failed to load seeker dashboard:', err);
    }
  },

  // Load Recruiter Dashboard Metrics
  async loadRecruiterDashboard() {
    try {
      const res = await API.get('/dashboard/recruiter');
      const data = res.data || {};

      document.getElementById('recruiter-total-jobs').textContent = data.totalJobsPosted || 0;
      document.getElementById('recruiter-active-jobs').textContent = data.activeJobs || 0;
      document.getElementById('recruiter-total-apps').textContent = data.totalApplications || 0;
      document.getElementById('recruiter-shortlisted-count').textContent = data.shortlistedCount || 0;
      document.getElementById('recruiter-interview-count').textContent = data.interviewCount || 0;
      document.getElementById('recruiter-selected-count').textContent = data.selectedCount || 0;

      // Recent Applications Table
      const appsContainer = document.getElementById('recruiter-recent-apps-body');
      if (appsContainer) {
        const recent = data.recentApplications || [];
        if (recent.length === 0) {
          appsContainer.innerHTML = `
            <tr>
              <td colspan="5" class="text-center py-4 text-muted">
                No candidate applications received yet.
              </td>
            </tr>
          `;
        } else {
          appsContainer.innerHTML = recent.map(app => {
            return `
              <tr>
                <td>
                  <div class="fw-bold">${app.seekerName || 'Candidate'}</div>
                  <small class="text-muted">${app.seekerEmail || ''}</small>
                </td>
                <td class="text-primary fw-medium">${app.jobTitle || 'Job'}</td>
                <td>${Applications.getStatusBadge(app.status)}</td>
                <td>
                  <a href="applicants.html" class="btn btn-sm btn-outline-primary">Review</a>
                </td>
              </tr>
            `;
          }).join('');
        }
      }
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    }
  }
};
