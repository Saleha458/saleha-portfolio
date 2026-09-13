# SALEHA — Developer Portfolio

A modern, responsive, and dynamic personal portfolio built to showcase my work as a **Full Stack MERN Developer**.

The portfolio provides a complete overview of my projects, technical skills, experience, education, certifications, and resume. It also includes a private admin dashboard for managing portfolio content and an AI Digital Twin that allows visitors to interact with my professional profile.

## Live Portfolio

**Live Website:**  
https://saleha-portfolio.vercel.app

## Overview

This portfolio was designed as a dynamic professional platform rather than a static website.

Portfolio content is managed through a private admin dashboard and stored in Firebase Firestore, allowing projects, skills, experience, education, certificates, resume information, and other content to be updated without changing the frontend code.

The application also includes an AI Digital Twin that uses current portfolio data to answer visitor questions about my professional background.

## Features

Dynamic personal portfolio
Responsive design for mobile, tablet, and desktop
Light and dark theme
Dynamic Projects section
Tech Stack / Skills section
Experience and Education sections
Certificates showcase with certificate preview
Dedicated Resume page
Resume download functionality
Contact form with email notifications
Private Admin Dashboard
Firebase Authentication for admin access
Firestore-based content management
Project, Skill, Experience, Education and Certificate management
Resume and personal information management
Contact message management
AI Digital Twin
Configurable AI Twin settings
Loading and error states
SPA routing
SEO essentials including sitemap and robots configuration

## AI Digital Twin

The portfolio includes an interactive **AI Digital Twin** that helps visitors learn more about my professional profile.

It can answer portfolio-related questions using information from areas such as:

Projects
Skills
Experience
Education
Certifications
Professional information

The AI Twin uses dynamic portfolio data, so updates made through the admin dashboard can be reflected in its knowledge.

## Admin Dashboard

The portfolio includes a private administration dashboard for managing website content.

The dashboard provides management for:

Projects
Skills
Experience
Education
Certificates
Resume
Personal Information
Contact Messages
AI Twin Settings

Admin authentication is handled through Firebase Authentication.


## Tech Stack

### Frontend
React.js
JavaScript
Vite
Tailwind CSS
Framer Motion
React Router

### Backend Services & Database
Firebase
Cloud Firestore
Firebase Authentication
Firebase App Check

### AI
Firebase AI Logic

### Additional Services
Cloudinary — resume and certificate assets
EmailJS — contact email notifications
reCAPTCHA Enterprise — application protection

### Deployment
Vercel
GitHub


## Project Structure

```text
client/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

### Main Application Areas

**Components**  
Contains the public portfolio sections, admin management components, AI Digital Twin, forms, navigation, and reusable UI states.

**Pages**  
Contains the main portfolio, admin authentication/dashboard, and resume pages.

**Services**  
Handles communication with Firebase and external services for projects, skills, education, experience, certificates, resume, contact messages, personal information, and AI functionality.

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Public Portfolio |
| `/resume` | Resume |
| `/admin` | Admin Login |
| `/dashboard` | Admin Dashboard |
| `/admin/dashboard` | Admin Dashboard |

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Saleha458/saleha-portfolio.git
```

### 2. Open the project

```bash
cd saleha-portfolio
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and configure the required Firebase, Cloudinary, EmailJS, and reCAPTCHA environment variables.

Do not commit private environment configuration to the repository.

### 5. Start development server

```bash
npm run dev
```

### 6. Create production build

```bash
npm run build
```

---

## Deployment

The portfolio is deployed on **Vercel** and connected to the GitHub `main` branch.

Updates pushed to the production branch can be automatically deployed through Vercel.

**Production Website:**  
https://saleha-portfolio.vercel.app

## Contact

**SALEHA**  
Full Stack MERN Developer

GitHub: https://github.com/Saleha458  
LinkedIn: https://www.linkedin.com/in/saleha-imtiaz  
Email: salehaimtiaz55@gmail.com

© 2026 SALEHA. All rights reserved.
