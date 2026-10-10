/**
 * JobConnect - Applications Management Module
 */

const Applications = {
  async applyForJob(jobId) {
    if (!Auth.isLoggedIn()) {
      window.location.href = `login.html?redirect=job-details.html?id=${jobId}`;
      return;
    }

    if (!Auth.isSeeker()) {
      API.showAlert('Only registered Job Seekers can apply for jobs.', 'danger');
      return;
    }

    const btn = document.getElementById('btn-apply-job');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Applying...';
    }

    try {
      const res = await API.post('/applications', { jobId: Number(jobId) });
      if (res.success) {
        API.showAlert('Application submitted successfully! Track it in your dashboard.', 'success');
        if (btn) {
          btn.className = 'btn btn-success px-4 py-2';
          btn.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Applied';
        }
      } else {
        API.showAlert(res.message || 'Failed to submit application', 'danger');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-send-fill me-1"></i> Apply Now';
        }
      }
    } catch (err) {
      API.showAlert(err.message || 'Application error', 'danger');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send-fill me-1"></i> Apply Now';
      }
    }
  },

  async quickApply(jobId, buttonElem) {
    if (!Auth.isLoggedIn()) {
      window.location.href = `login.html?redirect=jobs.html`;
      return;
    }

    if (!Auth.isSeeker()) {
      API.showAlert('Only job seekers can apply for positions.', 'danger');
      return;
    }

    const originalText = buttonElem.innerHTML;
    buttonElem.disabled = true;
    buttonElem.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

    try {
      const res = await API.post('/applications', { jobId: Number(jobId) });
      if (res.success) {
        API.showAlert('Application submitted successfully!', 'success');
        buttonElem.className = 'btn btn-sm btn-success';
        buttonElem.innerHTML = '<i class="bi bi-check-lg"></i> Applied';
      } else {
        API.showAlert(res.message || 'Already applied', 'danger');
        buttonElem.disabled = false;
        buttonElem.innerHTML = originalText;
      }
    } catch (err) {
      API.showAlert(err.message || 'Unable to apply', 'danger');
      buttonElem.disabled = false;
      buttonElem.innerHTML = originalText;
    }
  },

  getStatusBadge(status) {
    const s = (status || 'Applied').toLowerCase();
    switch (s) {
      case 'applied':
        return `<span class="badge-status badge-status-applied"><i class="bi bi-file-earmark-text"></i> Applied</span>`;
      case 'shortlisted':
        return `<span class="badge-status badge-status-shortlisted"><i class="bi bi-star-fill"></i> Shortlisted</span>`;
      case 'interview':
        return `<span class="badge-status badge-status-interview"><i class="bi bi-calendar-event"></i> Interview</span>`;
      case 'selected':
        return `<span class="badge-status badge-status-selected"><i class="bi bi-check-circle-fill"></i> Selected</span>`;
      case 'rejected':
        return `<span class="badge-status badge-status-rejected"><i class="bi bi-x-circle-fill"></i> Rejected</span>`;
      default:
        return `<span class="badge-status badge-status-applied">${status}</span>`;
    }
  },

  async loadMyApplications() {
    const tableBody = document.getElementById('my-applications-body');
    const totalCountElem = document.getElementById('total-applications-count');
    if (!tableBody) return;

    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <div class="text-muted mt-2">Loading applications...</div>
        </td>
      </tr>
    `;

    try {
      const res = await API.get('/applications/my');
      const apps = res.data || [];

      if (totalCountElem) {
        totalCountElem.textContent = apps.length;
      }

      if (apps.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center py-5">
              <i class="bi bi-folder2-open display-6 text-muted mb-2 d-block"></i>
              <h5>No Applications Found</h5>
              <p class="text-muted">You haven't applied to any positions yet.</p>
              <a href="jobs.html" class="btn btn-primary btn-sm">Explore Open Jobs</a>
            </td>
          </tr>
        `;
        return;
      }

      tableBody.innerHTML = apps.map(app => {
        const dateStr = new Date(app.applicationDate || Date.now()).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', year: 'numeric'
        });

        return `
          <tr>
            <td>
              <div class="fw-bold text-dark">${app.jobTitle || 'Position'}</div>
              <small class="text-muted"><i class="bi bi-geo-alt"></i> ${app.location || 'Remote'}</small>
            </td>
            <td>
              <div class="fw-semibold text-primary">${app.companyName || 'Company'}</div>
            </td>
            <td>
              <span class="badge-job-type">${app.jobType ? app.jobType.replace('_', ' ') : 'Full Time'}</span>
            </td>
            <td>${dateStr}</td>
            <td>${this.getStatusBadge(app.status)}</td>
            <td>
              <div class="text-muted small">
                ${app.recruiterNotes ? `<em>"${app.recruiterNotes}"</em>` : '<span class="text-muted">No feedback yet</span>'}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4 text-danger">
            Failed to load applications: ${err.message}
          </td>
        </tr>
      `;
    }
  }
};
