# Job Search App

## Overview

The _Job Search App_ is a modern and efficient platform designed to streamline the job search process for users. It provides an intuitive interface, advanced filtering options, and a seamless experience for both job seekers and employers.

## Features

- _Advanced Job Filtering_: Users can search for jobs based on location, industry, job type, and salary range.
- _User Authentication_: Secure registration and login functionalities with role-based access control.
- _Profile Management_: Users can create, update, and manage their profiles, including resumes and skills.
- _Job Applications_: Allows users to apply for jobs, track application status, and receive notifications.
- _Company Management_: Employers can create and manage job postings, review applications, and communicate with candidates.
- _Admin Dashboard_: Provides an overview of platform activity, including user and job listing statistics.
- _Messaging System_: Enables direct communication between employers and job seekers.
- _Error Handling & Validation_: Ensures smooth user experience with informative error messages and form validation.

## Technologies Used

- _Backend_: Node.js, Express.js
- _Database_: MongoDB (Mongoose)
- _Authentication_: JWT-based authentication
- _Storage_: Cloudinary for resume and profile image uploads
- _Email Notifications_: Nodemailer for job alerts and application status updates

## Getting Started

### Prerequisites

- Node.js (Latest LTS Version)
- MongoDB or PostgreSQL
- Cloudinary Account (for image storage)

### Installation

1. Clone the repository:
   sh
   git clone https://github.com/yourusername/job-search-app.git
   cd job-search-app
2. Install dependencies:
   sh
   npm install
3. Set up environment variables in a .env file:
   env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_URL=your_cloudinary_url
4. Start the application:
   sh
   npm start
