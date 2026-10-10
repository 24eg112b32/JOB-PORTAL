/**
 * JobConnect - Central API Utility (Fetch API + Dual-Mode Fallback)
 * Handles REST calls, JWT Authorization header injection, and client-side simulation
 * when the Spring Boot backend is not yet started locally.
 */

// If running in development preview or static server, check port 8080 first
const API_BASE_URL = (window.location.port === '8080')
  ? '/api'
  : 'http://localhost:8080/api';

// Seed Initial Mock Database in localStorage if empty
function initializeMockStorage() {
  if (!localStorage.getItem('jobconnect_initialized')) {
    const defaultUsers = [
      {
        id: 1,
        name: 'Alex Morgan',
        email: 'recruiter@demo.com',
        role: 'ROLE_RECRUITER',
        password: 'password123'
      },
      {
        id: 2,
        name: 'Sarah Jenkins',
        email: 'seeker@demo.com',
        role: 'ROLE_JOB_SEEKER',
        password: 'password123'
      }
    ];

    const defaultCompany = {
      id: 1,
      recruiterId: 1,
      companyName: 'CloudScale Technologies',
      description: 'Leading enterprise cloud infrastructure and modern developer tooling solutions.',
      website: 'https://cloudscale.example.com',
      industry: 'Information Technology',
      location: 'San Francisco, CA',
      contactEmail: 'careers@cloudscale.example.com'
    };

    const defaultProfile = {
      userId: 2,
      phone: '+1 (555) 234-5678',
      location: 'Austin, TX',
      skills: 'Java, Spring Boot, MySQL, REST APIs, JavaScript, Git, Docker',
      education: 'B.S. in Computer Science, University of Texas (2018-2022)',
      experience: '2+ years as Junior Software Engineer at TechCorp. Built scalable microservices and RESTful backends.',
      resume: 'sarah_jenkins_resume.pdf'
    };

    const defaultJobs = [
      {
        id: 1,
        recruiterId: 1,
        title: 'Senior Java Spring Boot Developer',
        companyName: 'CloudScale Technologies',
        description: 'We are looking for a Senior Java Developer to design, develop and maintain mission-critical enterprise microservices with Spring Boot, Hibernate, and MySQL.',
        requirements: '5+ years Java experience, solid understanding of Spring Security, RESTful APIs, and distributed systems.',
        skills: 'Java, Spring Boot, Spring Security, MySQL, Docker, AWS',
        location: 'San Francisco, CA (Hybrid)',
        jobType: 'FULL_TIME',
        experience: '5+ Years',
        salary: '$135,000 - $165,000 / yr',
        openings: 3,
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        recruiterId: 1,
        title: 'Full Stack Web Developer',
        companyName: 'CloudScale Technologies',
        description: 'Join our core platform team building intuitive web portals using modern JavaScript, HTML5/CSS3, and Spring Boot REST APIs.',
        requirements: 'Proficiency in frontend and backend technologies, REST API design, responsive UI design.',
        skills: 'Java, Spring Boot, JavaScript, HTML5, CSS3, Bootstrap, MySQL',
        location: 'Remote',
        jobType: 'REMOTE',
        experience: '2-4 Years',
        salary: '$95,000 - $125,000 / yr',
        openings: 2,
        deadline: new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      },
      {
        id: 3,
        recruiterId: 1,
        title: 'Backend Software Engineer',
        companyName: 'FinTech Nova',
        description: 'Design resilient transactional financial services, payment pipelines, and high-throughput database interactions.',
        requirements: 'Strong knowledge of Java 17, Spring Data JPA, relational database design and JWT auth.',
        skills: 'Java, Spring Boot, Spring Data JPA, MySQL, Redis, JWT',
        location: 'New York, NY',
        jobType: 'FULL_TIME',
        experience: '3-5 Years',
        salary: '$120,000 - $145,000 / yr',
        openings: 2,
        deadline: new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 4 * 86400000).toISOString()
      },
      {
        id: 4,
        recruiterId: 1,
        title: 'Software Engineering Intern',
        companyName: 'FinTech Nova',
        description: 'Exciting 6-month internship for aspiring software engineers to work on real-world financial analytics services.',
        requirements: 'Currently enrolled or recent graduate in Computer Science or related degree.',
        skills: 'Java, Spring Boot, SQL, Git, Problem Solving',
        location: 'Remote',
        jobType: 'INTERNSHIP',
        experience: 'Freshers / 0-1 Year',
        salary: '$4,500 / month',
        openings: 4,
        deadline: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ];

    const defaultApplications = [
      {
        id: 1,
        jobId: 2,
        seekerId: 2,
        applicationDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'Shortlisted',
        recruiterNotes: 'Strong match on Spring Boot and modern JavaScript. Scheduling initial technical phone screening.'
      }
    ];

    localStorage.setItem('jobconnect_users', JSON.stringify(defaultUsers));
    localStorage.setItem('jobconnect_companies', JSON.stringify([defaultCompany]));
    localStorage.setItem('jobconnect_profiles', JSON.stringify([defaultProfile]));
    localStorage.setItem('jobconnect_jobs', JSON.stringify(defaultJobs));
    localStorage.setItem('jobconnect_applications', JSON.stringify(defaultApplications));
    localStorage.setItem('jobconnect_initialized', 'true');
  }
}

initializeMockStorage();

// Storage helper functions for mock mode
const MockDB = {
  getUsers: () => JSON.parse(localStorage.getItem('jobconnect_users') || '[]'),
  saveUsers: (data) => localStorage.setItem('jobconnect_users', JSON.stringify(data)),
  getJobs: () => JSON.parse(localStorage.getItem('jobconnect_jobs') || '[]'),
  saveJobs: (data) => localStorage.setItem('jobconnect_jobs', JSON.stringify(data)),
  getCompanies: () => JSON.parse(localStorage.getItem('jobconnect_companies') || '[]'),
  saveCompanies: (data) => localStorage.setItem('jobconnect_companies', JSON.stringify(data)),
  getProfiles: () => JSON.parse(localStorage.getItem('jobconnect_profiles') || '[]'),
  saveProfiles: (data) => localStorage.setItem('jobconnect_profiles', JSON.stringify(data)),
  getApplications: () => JSON.parse(localStorage.getItem('jobconnect_applications') || '[]'),
  saveApplications: (data) => localStorage.setItem('jobconnect_applications', JSON.stringify(data)),
};

// Mock Backend Dispatcher
async function mockDispatch(method, endpoint, body) {
  const user = Auth.getUser();
  const cleanEndpoint = endpoint.split('?')[0];
  const queryString = endpoint.includes('?') ? endpoint.split('?')[1] : '';
  const params = new URLSearchParams(queryString);

  // AUTH ENDPOINTS
  if (cleanEndpoint === '/auth/register' && method === 'POST') {
    const users = MockDB.getUsers();
    if (users.find(u => u.email.toLowerCase() === body.email.toLowerCase())) {
      throw new Error('Email already registered: ' + body.email);
    }
    const newUser = {
      id: Date.now(),
      name: body.name,
      email: body.email.toLowerCase(),
      role: body.role,
      password: body.password
    };
    users.push(newUser);
    MockDB.saveUsers(users);

    const token = 'mock_jwt_token_' + newUser.id + '_' + Date.now();
    return {
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        type: 'Bearer',
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
  }

  if (cleanEndpoint === '/auth/login' && method === 'POST') {
    const users = MockDB.getUsers();
    const found = users.find(u => u.email.toLowerCase() === body.email.toLowerCase() && u.password === body.password);
    if (!found) {
      throw new Error('Invalid email or password');
    }
    const token = 'mock_jwt_token_' + found.id + '_' + Date.now();
    return {
      success: true,
      message: 'Login successful',
      data: {
        token,
        type: 'Bearer',
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role
      }
    };
  }

  // USER PROFILE
  if (cleanEndpoint === '/users/profile') {
    if (!user) throw new Error('Unauthorized');
    const users = MockDB.getUsers();
    const current = users.find(u => u.id === user.id) || user;

    if (method === 'GET') {
      const profiles = MockDB.getProfiles();
      const profile = profiles.find(p => p.userId === user.id) || {};
      const companies = MockDB.getCompanies();
      const company = companies.find(c => c.recruiterId === user.id) || null;

      return {
        success: true,
        data: {
          id: current.id,
          name: current.name,
          email: current.email,
          role: current.role,
          ...profile,
          company
        }
      };
    }

    if (method === 'PUT') {
      if (body.name) {
        current.name = body.name;
        MockDB.saveUsers(users);
        Auth.setUser({ ...user, name: body.name });
      }
      const profiles = MockDB.getProfiles();
      let profile = profiles.find(p => p.userId === user.id);
      if (!profile) {
        profile = { userId: user.id };
        profiles.push(profile);
      }
      Object.assign(profile, body);
      MockDB.saveProfiles(profiles);

      return {
        success: true,
        message: 'Profile updated successfully',
        data: { ...current, ...profile }
      };
    }
  }

  // JOBS ENDPOINTS
  if (cleanEndpoint === '/jobs') {
    if (method === 'GET') {
      const kw = params.get('keyword')?.toLowerCase() || '';
      const loc = params.get('location')?.toLowerCase() || '';
      const skl = params.get('skills')?.toLowerCase() || '';
      const type = params.get('jobType');
      const exp = params.get('experience');

      let jobs = MockDB.getJobs().filter(j => j.status === 'ACTIVE');
      const applications = MockDB.getApplications();

      if (kw) {
        jobs = jobs.filter(j => j.title.toLowerCase().includes(kw) || j.companyName.toLowerCase().includes(kw) || j.description.toLowerCase().includes(kw));
      }
      if (loc) {
        jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
      }
      if (skl) {
        jobs = jobs.filter(j => j.skills.toLowerCase().includes(skl));
      }
      if (type && type !== 'ALL') {
        jobs = jobs.filter(j => j.jobType === type);
      }
      if (exp && exp !== 'ALL') {
        jobs = jobs.filter(j => j.experience.toLowerCase().includes(exp.toLowerCase()));
      }

      const mapped = jobs.map(j => ({
        ...j,
        applicantCount: applications.filter(a => a.jobId === j.id).length
      }));

      return { success: true, data: mapped };
    }

    if (method === 'POST') {
      if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
      const jobs = MockDB.getJobs();
      const companies = MockDB.getCompanies();
      const company = companies.find(c => c.recruiterId === user.id);

      const newJob = {
        id: Date.now(),
        recruiterId: user.id,
        title: body.title,
        companyName: company?.companyName || body.companyName || user.name + ' Corp',
        description: body.description,
        requirements: body.requirements || '',
        skills: body.skills,
        location: body.location,
        jobType: body.jobType,
        experience: body.experience,
        salary: body.salary || 'Negotiable',
        openings: body.openings || 1,
        deadline: body.deadline,
        status: body.status || 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      jobs.unshift(newJob);
      MockDB.saveJobs(jobs);

      return { success: true, message: 'Job posted successfully', data: newJob };
    }
  }

  if (cleanEndpoint.startsWith('/jobs/') && !cleanEndpoint.includes('/recruiter/')) {
    const id = parseInt(cleanEndpoint.replace('/jobs/', ''));
    const jobs = MockDB.getJobs();
    const job = jobs.find(j => j.id === id);
    if (!job) throw new Error('Job not found');

    if (method === 'GET') {
      const apps = MockDB.getApplications();
      const hasApplied = user ? apps.some(a => a.jobId === id && a.seekerId === user.id) : false;
      return {
        success: true,
        data: {
          ...job,
          applicantCount: apps.filter(a => a.jobId === id).length,
          hasApplied
        }
      };
    }

    if (method === 'PUT') {
      if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
      Object.assign(job, body);
      MockDB.saveJobs(jobs);
      return { success: true, message: 'Job updated successfully', data: job };
    }

    if (method === 'DELETE') {
      if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
      const filtered = jobs.filter(j => j.id !== id);
      MockDB.saveJobs(filtered);
      return { success: true, message: 'Job deleted successfully' };
    }
  }

  if (cleanEndpoint === '/jobs/recruiter/my' && method === 'GET') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const jobs = MockDB.getJobs().filter(j => j.recruiterId === user.id);
    const apps = MockDB.getApplications();
    const mapped = jobs.map(j => ({
      ...j,
      applicantCount: apps.filter(a => a.jobId === j.id).length
    }));
    return { success: true, data: mapped };
  }

  // APPLICATIONS ENDPOINTS
  if (cleanEndpoint === '/applications' && method === 'POST') {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') throw new Error('Only job seekers can apply');
    const apps = MockDB.getApplications();
    if (apps.some(a => a.jobId === body.jobId && a.seekerId === user.id)) {
      throw new Error('You have already applied for this job');
    }
    const newApp = {
      id: Date.now(),
      jobId: body.jobId,
      seekerId: user.id,
      applicationDate: new Date().toISOString(),
      status: 'Applied',
      recruiterNotes: ''
    };
    apps.unshift(newApp);
    MockDB.saveApplications(apps);
    return { success: true, message: 'Application submitted successfully', data: newApp };
  }

  if (cleanEndpoint === '/applications/my' && method === 'GET') {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') throw new Error('Unauthorized');
    const apps = MockDB.getApplications().filter(a => a.seekerId === user.id);
    const jobs = MockDB.getJobs();
    const mapped = apps.map(a => {
      const j = jobs.find(job => job.id === a.jobId) || {};
      return {
        ...a,
        jobTitle: j.title,
        companyName: j.companyName,
        location: j.location,
        jobType: j.jobType
      };
    });
    return { success: true, data: mapped };
  }

  if (cleanEndpoint.startsWith('/applications/job/') && method === 'GET') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const jobId = parseInt(cleanEndpoint.replace('/applications/job/', ''));
    const apps = MockDB.getApplications().filter(a => a.jobId === jobId);
    const users = MockDB.getUsers();
    const profiles = MockDB.getProfiles();
    const jobs = MockDB.getJobs();
    const currentJob = jobs.find(j => j.id === jobId);

    const mapped = apps.map(a => {
      const u = users.find(usr => usr.id === a.seekerId) || {};
      const p = profiles.find(prof => prof.userId === a.seekerId) || {};
      return {
        ...a,
        jobTitle: currentJob?.title || '',
        companyName: currentJob?.companyName || '',
        seekerName: u.name,
        seekerEmail: u.email,
        seekerPhone: p.phone,
        seekerLocation: p.location,
        seekerSkills: p.skills,
        seekerEducation: p.education,
        seekerExperience: p.experience,
        seekerResume: p.resume
      };
    });
    return { success: true, data: mapped };
  }

  if (cleanEndpoint === '/applications/recruiter/all' && method === 'GET') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const myJobs = MockDB.getJobs().filter(j => j.recruiterId === user.id);
    const myJobIds = myJobs.map(j => j.id);
    const apps = MockDB.getApplications().filter(a => myJobIds.includes(a.jobId));
    const users = MockDB.getUsers();
    const profiles = MockDB.getProfiles();

    const mapped = apps.map(a => {
      const u = users.find(usr => usr.id === a.seekerId) || {};
      const p = profiles.find(prof => prof.userId === a.seekerId) || {};
      const j = myJobs.find(job => job.id === a.jobId) || {};
      return {
        ...a,
        jobTitle: j.title,
        companyName: j.companyName,
        seekerName: u.name,
        seekerEmail: u.email,
        seekerPhone: p.phone,
        seekerLocation: p.location,
        seekerSkills: p.skills,
        seekerEducation: p.education,
        seekerExperience: p.experience,
        seekerResume: p.resume
      };
    });
    return { success: true, data: mapped };
  }

  if (cleanEndpoint.startsWith('/applications/') && cleanEndpoint.endsWith('/status') && method === 'PUT') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const id = parseInt(cleanEndpoint.replace('/applications/', '').replace('/status', ''));
    const apps = MockDB.getApplications();
    const app = apps.find(a => a.id === id);
    if (!app) throw new Error('Application not found');
    app.status = body.status;
    if (body.recruiterNotes !== undefined) app.recruiterNotes = body.recruiterNotes;
    MockDB.saveApplications(apps);
    return { success: true, message: 'Application status updated successfully', data: app };
  }

  // COMPANIES ENDPOINTS
  if (cleanEndpoint === '/companies/my') {
    if (!user) throw new Error('Unauthorized');
    const companies = MockDB.getCompanies();
    const comp = companies.find(c => c.recruiterId === user.id) || {
      companyName: user.name + ' Corp',
      recruiterId: user.id,
      contactEmail: user.email
    };
    return { success: true, data: comp };
  }

  if (cleanEndpoint === '/companies' && method === 'POST') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const companies = MockDB.getCompanies();
    let comp = companies.find(c => c.recruiterId === user.id);
    if (!comp) {
      comp = { id: Date.now(), recruiterId: user.id };
      companies.push(comp);
    }
    Object.assign(comp, body);
    MockDB.saveCompanies(companies);
    return { success: true, message: 'Company profile saved successfully', data: comp };
  }

  // DASHBOARD ENDPOINTS
  if (cleanEndpoint === '/dashboard/seeker') {
    if (!user || user.role !== 'ROLE_JOB_SEEKER') throw new Error('Unauthorized');
    const apps = MockDB.getApplications().filter(a => a.seekerId === user.id);
    const jobs = MockDB.getJobs();
    const recent = apps.slice(0, 5).map(a => {
      const j = jobs.find(job => job.id === a.jobId) || {};
      return {
        ...a,
        jobTitle: j.title,
        companyName: j.companyName,
        location: j.location,
        jobType: j.jobType
      };
    });

    return {
      success: true,
      data: {
        totalApplications: apps.length,
        appliedCount: apps.filter(a => a.status === 'Applied').length,
        shortlistedCount: apps.filter(a => a.status === 'Shortlisted').length,
        interviewCount: apps.filter(a => a.status === 'Interview').length,
        selectedCount: apps.filter(a => a.status === 'Selected').length,
        rejectedCount: apps.filter(a => a.status === 'Rejected').length,
        recentApplications: recent
      }
    };
  }

  if (cleanEndpoint === '/dashboard/recruiter') {
    if (!user || user.role !== 'ROLE_RECRUITER') throw new Error('Unauthorized');
    const jobs = MockDB.getJobs().filter(j => j.recruiterId === user.id);
    const jobIds = jobs.map(j => j.id);
    const apps = MockDB.getApplications().filter(a => jobIds.includes(a.jobId));
    const users = MockDB.getUsers();

    const recentApps = apps.slice(0, 5).map(a => {
      const u = users.find(usr => usr.id === a.seekerId) || {};
      const j = jobs.find(job => job.id === a.jobId) || {};
      return {
        ...a,
        jobTitle: j.title,
        companyName: j.companyName,
        seekerName: u.name,
        seekerEmail: u.email
      };
    });

    return {
      success: true,
      data: {
        totalJobsPosted: jobs.length,
        activeJobs: jobs.filter(j => j.status === 'ACTIVE').length,
        totalApplications: apps.length,
        shortlistedCount: apps.filter(a => a.status === 'Shortlisted').length,
        interviewCount: apps.filter(a => a.status === 'Interview').length,
        selectedCount: apps.filter(a => a.status === 'Selected').length,
        recentApplications: recentApps,
        recentJobs: jobs.slice(0, 5)
      }
    };
  }

  throw new Error('Not found: ' + endpoint);
}

// Master API Client wrapper
const API = {
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const token = Auth.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      // First attempt to reach the Spring Boot backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800); // 1.8s timeout for instant mock fallback if backend not running

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Request failed with status ' + response.status);
      }
      return data;
    } catch (networkError) {
      // Fallback seamlessly to local simulation
      console.warn(`Backend at ${API_BASE_URL} unreachable or errored. Using built-in store:`, networkError.message);
      const parsedBody = options.body ? JSON.parse(options.body) : null;
      return await mockDispatch(options.method || 'GET', endpoint, parsedBody);
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Toast / Alert Notification
  showAlert(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success text-white' : type === 'danger' ? 'bg-danger text-white' : 'bg-primary text-white';
    toast.className = `toast align-items-center ${bgClass} border-0 show shadow-lg mb-2`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body fw-medium py-3 px-3">
          <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : type === 'danger' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
