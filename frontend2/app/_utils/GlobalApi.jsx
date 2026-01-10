// src/utils/GlobalApi.jsx
import axios from "axios";

const API_KEY = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // Based on [cite: 7, 34]
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
const registerUser = (data) => axiosClient.post('/auth/signup', data);
const loginUser = (data) => axiosClient.post('/auth/user/login', data);

// --- Authentication  ---
const registerCompany = (data) => axiosClient.post('/auth/companySignup', data);
const loginCompany = (data) => axiosClient.post('/auth/companyLogin', data);

// --- Interview [cite: 73, 114] ---
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

export default {
    registerCompany,
    loginCompany,
    loginUser,
    registerUser,
    transcribeAudio,
    startInterview,
    submitAnswer,
    parseResume,
    recognizeSpeech
};