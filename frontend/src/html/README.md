# AI Hiring Platform - Frontend

A production-grade frontend for an AI-powered hiring platform built with plain HTML and custom CSS.

## Project Overview

This is a complete frontend prototype for a dual-sided hiring marketplace:
- **Job Seekers**: Browse jobs, apply with resumes, complete AI interviews
- **Companies**: Post jobs, review AI-scored applicants, manage hiring pipeline

## Design Philosophy

- **Clean & Functional**: Google/LinkedIn-style interface
- **No Frameworks**: Plain HTML + single global.css (no Tailwind, no libraries)
- **React-Ready**: Each page maps to future React components
- **Production-Quality**: Loading states, error handling, responsive design

## File Structure

| Page | Link | Description |
|------|------|-------------|
| Landing | [landing.html](https://underemployed.github.io/frontend_AI_Interviewer/landing.html) | Landing page with job seeker/company CTAs |
| Privacy | [privacy.html](https://underemployed.github.io/frontend_AI_Interviewer/privacy.html) | Privacy policy |
| 404 | [404.html](https://underemployed.github.io/frontend_AI_Interviewer/404.html) | Not found page |
| Error | [error.html](https://underemployed.github.io/frontend_AI_Interviewer/error.html) | Generic error page |
| User Login | [user-login.html](https://underemployed.github.io/frontend_AI_Interviewer/user-login.html) | Job seeker login (JWT) |
| User Signup | [user-signup.html](https://underemployed.github.io/frontend_AI_Interviewer/user-signup.html) | Job seeker registration |
| Company Login | [company-login.html](https://underemployed.github.io/frontend_AI_Interviewer/company-login.html) | Company login (JWT) |
| Company Signup | [company-signup.html](https://underemployed.github.io/frontend_AI_Interviewer/company-signup.html) | Company registration |
| User Dashboard | [user-dashboard.html](https://underemployed.github.io/frontend_AI_Interviewer/user-dashboard.html) | Application tracking dashboard |
| Jobs Listing | [jobs-listing.html](https://underemployed.github.io/frontend_AI_Interviewer/jobs-listing.html) | Browse available jobs |
| Job Detail | [job-detail.html](https://underemployed.github.io/frontend_AI_Interviewer/job-detail.html) | Detailed job description |
| Job Apply | [job-apply.html](https://underemployed.github.io/frontend_AI_Interviewer/job-apply.html) | Application form with resume upload |
| User Profile | [user-profile.html](https://underemployed.github.io/frontend_AI_Interviewer/user-profile.html) | Edit user profile |
| Interview Join | [interview-join.html](https://underemployed.github.io/frontend_AI_Interviewer/interview-join.html) | Pre-interview preparation |
| Interview | [interview.html](https://underemployed.github.io/frontend_AI_Interviewer/interview.html) | AI interview interface |
| Company Dashboard | [company-dashboard.html](https://underemployed.github.io/frontend_AI_Interviewer/company-dashboard.html) | Job postings overview |
| Create Job | [create-job.html](https://underemployed.github.io/frontend_AI_Interviewer/create-job.html) | Create/edit job posting |
| View Job | [view-job.html](https://underemployed.github.io/frontend_AI_Interviewer/view-job.html) | View applicants list with AI scores |
| Applicant Detail | [applicant-detail.html](https://underemployed.github.io/frontend_AI_Interviewer/applicant-detail.html) | Detailed applicant profile with AI analysis |


### Global Styles
- `global.css` - Single CSS file with all styles, components, and utilities

### Public Pages
- `landing.html` - Landing page with job seeker/company CTAs
- `privacy.html` - Privacy policy
- `404.html` - Not found page
- `error.html` - Generic error page

### Authentication
- `user-login.html` - Job seeker login (JWT)
- `user-signup.html` - Job seeker registration
- `company-login.html` - Company login (JWT)
- `company-signup.html` - Company registration

### Job Seeker Flow
- `user-dashboard.html` - Application tracking dashboard
- `jobs-listing.html` - Browse available jobs
- `job-detail.html` - Detailed job description
- `job-apply.html` - Application form with resume upload
- `user-profile.html` - Edit user profile
- `interview-join.html` - Pre-interview preparation
- `interview.html` - AI interview interface

### Company Flow
- `company-dashboard.html` - Job postings overview
- `create-job.html` - Create/edit job posting
- `view-job.html` - View applicants list with AI scores
- `applicant-detail.html` - Detailed applicant profile with AI analysis

## Key Features

### Authentication
- JWT-based authentication (ready for backend integration)
- Separate flows for job seekers and companies
- Token storage in localStorage

### Job Seeker Features
- Browse and search jobs
- Apply with resume upload (per-job basis)
- Track application status (submitted → reviewed → interview → shortlisted)
- Complete AI-powered interviews
- Editable profile

### Company Features
- Create and manage job postings
- View applicants with AI-generated scores
- Resume analysis breakdown
- Interview performance metrics
- Shortlist/reject actions

### UI Components
All components use semantic class names for easy React conversion:
- `.card` - Content cards
- `.job-card` - Job listing items
- `.applicant-card` - Applicant cards with scores
- `.status-badge` - Application status indicators
- `.modal-overlay` - Modal dialogs
- `.empty-state` - Empty state placeholders
- `.loading` - Loading spinners

## Backend Integration

All pages include placeholder fetch calls with JWT authentication:

```javascript
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
```

### Required API Endpoints

**Authentication:**
- POST `/api/auth/user/login`
- POST `/api/auth/user/signup`
- POST `/api/auth/company/login`
- POST `/api/auth/company/signup`

**Jobs:**
- GET `/api/jobs` - List all jobs
- GET `/api/jobs/:id` - Job details
- POST `/api/company/jobs` - Create job
- GET `/api/company/jobs` - Company's jobs

**Applications:**
- POST `/api/applications/submit` - Submit application
- GET `/api/user/applications` - User's applications
- GET `/api/company/jobs/:id/applicants` - Job applicants
- GET `/api/company/applicants/:id` - Applicant details

**Interviews:**
- POST `/api/interviews/submit` - Submit interview

**Profile:**
- GET `/api/user/profile`
- PUT `/api/user/profile`
- POST `/api/user/change-password`

## Responsive Design

All pages are responsive with breakpoints:
- Desktop: 1200px container
- Tablet: 768px breakpoint
- Mobile: 480px breakpoint

## Browser Compatibility

Compatible with all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Running Locally

Simply open any HTML file in a web browser. For full functionality:

1. Set up a local server (e.g., Python's http.server)
2. Connect to your backend API
3. Update API endpoints in JavaScript

## Converting to React

Each page is designed to map to React components:

```
landing.html → <LandingPage />
user-dashboard.html → <UserDashboard />
job-card → <JobCard />
applicant-card → <ApplicantCard />
```

Class names follow component patterns:
- `.job-card` → JobCard component
- `.applicant-card` → ApplicantCard component
- `.modal-overlay` → Modal component

## Notes

- Resume is uploaded per job application (no central storage)
- All AI scoring is placeholder data
- Interview voice input is placeholder (needs Web Speech API)
- JWT tokens stored in localStorage
- No backend implementation included

## Future Enhancements

- Real-time notifications
- Advanced search/filters
- Bulk applicant actions
- Interview scheduling
- Analytics dashboard
- Email templates
- Mobile app version

## License

Proprietary - AI Hiring Platform
