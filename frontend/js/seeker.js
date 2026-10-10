/**
 * JobConnect - Job Seeker Profile & Management
 */

const Seeker = {
  async loadProfile() {
    const form = document.getElementById('seeker-profile-form');
    if (!form) return;

    try {
      const res = await API.get('/users/profile');
      const data = res.data || {};

      document.getElementById('profile-name').value = data.name || '';
      document.getElementById('profile-email').value = data.email || '';
      document.getElementById('profile-phone').value = data.phone || '';
      document.getElementById('profile-location').value = data.location || '';
      document.getElementById('profile-skills').value = data.skills || '';
      document.getElementById('profile-education').value = data.education || '';
      document.getElementById('profile-experience').value = data.experience || '';
      document.getElementById('profile-resume').value = data.resume || '';

      const nameDisplay = document.getElementById('display-user-name');
      const emailDisplay = document.getElementById('display-user-email');
      const roleDisplay = document.getElementById('display-user-role');
      if (nameDisplay) nameDisplay.textContent = data.name || 'Job Seeker';
      if (emailDisplay) emailDisplay.textContent = data.email || '';
      if (roleDisplay) roleDisplay.textContent = 'Job Seeker';

    } catch (err) {
      API.showAlert('Could not load profile: ' + err.message, 'danger');
    }
  },

  async saveProfile(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-save-profile');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    }

    const payload = {
      name: document.getElementById('profile-name').value.trim(),
      phone: document.getElementById('profile-phone').value.trim(),
      location: document.getElementById('profile-location').value.trim(),
      skills: document.getElementById('profile-skills').value.trim(),
      education: document.getElementById('profile-education').value.trim(),
      experience: document.getElementById('profile-experience').value.trim(),
      resume: document.getElementById('profile-resume').value.trim()
    };

    try {
      const res = await API.put('/users/profile', payload);
      if (res.success) {
        API.showAlert('Profile updated successfully!', 'success');
        // Update local session name if changed
        const current = Auth.getUser();
        if (current && payload.name) {
          current.name = payload.name;
          Auth.setUser(current);
          Auth.initNavbar();
        }
      } else {
        API.showAlert(res.message || 'Failed to update profile', 'danger');
      }
    } catch (err) {
      API.showAlert(err.message || 'Error updating profile', 'danger');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i> Save Changes';
      }
    }
  }
};
