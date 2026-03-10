// src/utils/GlobalApi.jsx
import axios from "axios";

const API_KEY = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', 
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { Authorization: `Bearer ${API_KEY}` })
  },
});

// Update token dynamically if user logs in without refreshing
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Authentication  ---
const registerUser = (data) => axiosClient.post('/auth/user/signup', data);
const loginUser = (data) => axiosClient.post('/auth/user/login', data);

// --- Authentication  ---
const registerCompany = (data) => axiosClient.post('/auth/company/signup', data);
const loginCompany = (data) => axiosClient.post('/auth/company/login', data);

// --- Interview ---
const startInterview = (data) => axiosClient.post('/interview/start', data);
const submitAnswer = (data) => axiosClient.post('/interview/answer', data);

// --- Resume Parser (File Upload)  ---
const parseResume = (formData) => axiosClient.post('/resume/parse', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});


// --- Speech to Text (File Upload) [cite: 189] ---
const recognizeSpeech = (formData) => axiosClient.post('/speech/recognize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

const transcribeAudio = (formData) => axiosClient.post('/speech/transcribe', formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// --- NEW: Text to Speech (Voice Output) ---
const textToSpeech = (data) => axiosClient.post('/speech/tts', data, {
    responseType: 'blob' // Crucial: Tells Axios to expect an audio file, not JSON
});


/// wwwwwwwwwwwwwwwwwwwwwww
// --- Jobs ---

// Create Job (Company)
const createJob = (data) => axiosClient.post('/jobs', data);

// Get All Jobs (Public)
const getAllJobs = () => axiosClient.get('/jobs');

// Get Job by ID
const getJobById = (jobId) => axiosClient.get(`/jobs/${jobId}`);

// Get Logged-in Company Jobs
const getCompanyJobs = () => axiosClient.get('/jobs/company/my-jobs');

// Update Job
const updateJob = (jobId, data) =>
  axiosClient.put(`/jobs/${jobId}`, data);

// Delete Job
const deleteJob = (jobId) =>
    axiosClient.delete(`/jobs/${jobId}`);


// --- Applications ---

// Apply to Job (User)
const applyToJob = (formData) =>
  axiosClient.post('/applications/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

// Get Logged-in User Applications
const getMyApplications = () =>
  axiosClient.get('/applications/my-applications');

// Get Applicants for a Job (Company)
const getJobApplicants = (jobId) =>
  axiosClient.get(`/applications/job/${jobId}`);

// Update Application Status (Company)
const updateApplicationStatus = (applicationId, status) =>
  axiosClient.put(`/applications/${applicationId}/status`, { status });

// Get Application Details
const getApplicationDetails = (applicationId) =>
  axiosClient.get(`/applications/${applicationId}`);

  // Bulk update application statuses (company)
const bulkUpdateApplicationStatus = (jobId, applicationIds, status) =>
  axiosClient.put(`/applications/job/${jobId}/bulk/status`, {
    applicationIds, 
    status, 
  });

  // Fetch applicants for a job with filtering, search, sorting and pagination
  const fetchJobApplicants = (jobId, options = {}) => {
    const {
      status,
      search,
      minResumeScore,
      maxResumeScore,
      minInterviewScore,
      maxInterviewScore,
      sort = 'appliedAt',
      order = 'desc',
      page = 1,
      limit = 20,
    } = options;

    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    if (minResumeScore != null) params.minResumeScore = minResumeScore;
    if (maxResumeScore != null) params.maxResumeScore = maxResumeScore;
    if (minInterviewScore != null) params.minInterviewScore = minInterviewScore;
    if (maxInterviewScore != null) params.maxInterviewScore = maxInterviewScore;
    if (sort) params.sort = sort;
    if (order) params.order = order;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    return axiosClient.get(`/applications/jobs/${jobId}`, { params });
  };

export default {
  // Auth
  registerCompany,
  loginCompany,
  loginUser,
  registerUser,

  // Jobs
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,

  // Applications
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getApplicationDetails,
  bulkUpdateApplicationStatus,

  // Interview / AI
  startInterview,
  submitAnswer,

  // Resume / Speech
  parseResume,
  recognizeSpeech,
  transcribeAudio,
};

