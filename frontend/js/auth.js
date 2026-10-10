/**
 * JobConnect - Authentication & Session Manager
 * Handles login, register, role checks, JWT storage, and dynamic navbar state.
 */

const Auth = {
  TOKEN_KEY: 'jobconnect_jwt_token',
  USER_KEY: 'jobconnect_user_info',

  saveSession(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },

  getUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  isSeeker() {
    const user = this.getUser();
    return user && user.role === 'ROLE_JOB_SEEKER';
  },

  isRecruiter() {
    const user = this.getUser();
    return user && user.role === 'ROLE_RECRUITER';
  },

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = 'login.html';
  },

  // Route Guard for Protected Pages
  requireAuth(requiredRole = null) {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return false;
    }

    const user = this.getUser();
    if (requiredRole && user.role !== requiredRole) {
      if (user.role === 'ROLE_JOB_SEEKER') {
        window.location.href = 'seeker-dashboard.html';
      } else {
        window.location.href = 'recruiter-dashboard.html';
      }
      return false;
    }
    return true;
  },

  // Dynamic Navbar Renderer
  initNavbar() {
    const navAuthContainer = document.getElementById('nav-auth-section');
    if (!navAuthContainer) return;

    if (this.isLoggedIn()) {
      const user = this.getUser();
      const isRecruiter = user.role === 'ROLE_RECRUITER';
      const dashboardUrl = isRecruiter ? 'recruiter-dashboard.html' : 'seeker-dashboard.html';
      const roleLabel = isRecruiter ? 'Recruiter' : 'Job Seeker';

      navAuthContainer.innerHTML = `
        <li class="nav-item d-flex align-items-center me-2">
          <a class="nav-link fw-semibold" href="${dashboardUrl}">
            <i class="bi bi-speedometer2 me-1"></i> Dashboard
          </a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
            <span class="user-avatar-sm">${user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            <span class="d-none d-md-inline fw-semibold">${user.name}</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 py-2">
            <li class="px-3 py-1">
              <div class="fw-bold">${user.name}</div>
              <small class="text-muted">${user.email}</small>
              <div><span class="badge bg-primary-subtle text-primary mt-1">${roleLabel}</span></div>
            </li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item py-2" href="${isRecruiter ? 'company-profile.html' : 'seeker-profile.html'}">
                <i class="bi bi-person me-2"></i> Profile
              </a>
            </li>
            ${isRecruiter ? `
              <li><a class="dropdown-item py-2" href="post-job.html"><i class="bi bi-plus-circle me-2"></i> Post Job</a></li>
              <li><a class="dropdown-item py-2" href="manage-jobs.html"><i class="bi bi-briefcase me-2"></i> Manage Jobs</a></li>
              <li><a class="dropdown-item py-2" href="applicants.html"><i class="bi bi-people me-2"></i> View Applicants</a></li>
            ` : `
              <li><a class="dropdown-item py-2" href="my-applications.html"><i class="bi bi-file-earmark-check me-2"></i> My Applications</a></li>
              <li><a class="dropdown-item py-2" href="jobs.html"><i class="bi bi-search me-2"></i> Find Jobs</a></li>
            `}
            <li><hr class="dropdown-divider"></li>
            <li>
              <a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="Auth.logout()">
                <i class="bi bi-box-arrow-right me-2"></i> Logout
              </a>
            </li>
          </ul>
        </li>
      `;
    } else {
      navAuthContainer.innerHTML = `
        <li class="nav-item">
          <a class="nav-link" href="login.html">Login</a>
        </li>
        <li class="nav-item ms-lg-2">
          <a class="btn btn-primary" href="register.html">Sign Up</a>
        </li>
      `;
    }
  }
};

// Global DOM Hook for Login/Register Pages
document.addEventListener('DOMContentLoaded', () => {
  Auth.initNavbar();

  // Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      if (!email || !password) {
        API.showAlert('Please fill in all fields', 'danger');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

        const res = await API.post('/auth/login', { email, password });
        if (res.success && res.data) {
          Auth.saveSession(res.data.token, res.data);
          API.showAlert('Login successful! Redirecting...', 'success');
          setTimeout(() => {
            if (res.data.role === 'ROLE_RECRUITER') {
              window.location.href = 'recruiter-dashboard.html';
            } else {
              window.location.href = 'seeker-dashboard.html';
            }
          }, 800);
        } else {
          API.showAlert(res.message || 'Login failed', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Sign In';
        }
      } catch (err) {
        API.showAlert(err.message || 'Invalid email or password', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign In';
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const roleElem = document.querySelector('input[name="role"]:checked');
      const submitBtn = registerForm.querySelector('button[type="submit"]');

      if (!roleElem) {
        API.showAlert('Please select your role (Job Seeker or Recruiter)', 'danger');
        return;
      }

      if (password !== confirmPassword) {
        API.showAlert('Passwords do not match', 'danger');
        return;
      }

      if (password.length < 6) {
        API.showAlert('Password must be at least 6 characters', 'danger');
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';

        const res = await API.post('/auth/register', {
          name,
          email,
          password,
          confirmPassword,
          role: roleElem.value
        });

        if (res.success && res.data) {
          Auth.saveSession(res.data.token, res.data);
          API.showAlert('Registration successful! Welcome to JobConnect.', 'success');
          setTimeout(() => {
            if (res.data.role === 'ROLE_RECRUITER') {
              window.location.href = 'recruiter-dashboard.html';
            } else {
              window.location.href = 'seeker-dashboard.html';
            }
          }, 900);
        } else {
          API.showAlert(res.message || 'Registration failed', 'danger');
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Create Account';
        }
      } catch (err) {
        API.showAlert(err.message || 'Registration failed. Email might already exist.', 'danger');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Account';
      }
    });
  }
});
