# ProjectMate – Collaborative Project Management Platform

ProjectMate is a full-stack project management platform that helps users discover projects, collaborate with team members, manage tasks, and track project progress.

## Overview

ProjectMate provides a centralized workspace where users can create projects, build teams, assign responsibilities, and monitor project activities.

## Features

- User Authentication and Authorization
- Create, Edit and Manage Projects
- Discover and Join Projects
- Send and Manage Join Requests
- Smart Skill-Based Project Matching
- Team Collaboration and Member Management
- Task Management with Kanban Board
- Task Assignment and Priority Management
- Automatic Project Progress Tracking
- Completed Project History
- Project Activity Tracking
- Responsive User Interface

## Tech Stack

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB
- Mongoose

**Tools**
- Git and GitHub
- VS Code
- Postman

## Project Structure

```text
ProjectMate/
├── client/
│   └── src/
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ProjectMate.git
cd ProjectMate
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the server directory.

Add the required configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add other environment variables required by your application, such as email configuration, if applicable.

### 5. Run the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

## Key Highlights

- Automated project progress calculation based on completed tasks.
- Role-based task management permissions.
- Skill-based project matching.
- Collaborative task tracking through a Kanban board.
- Completed project history for team members.

## Future Improvements

- Real-time collaboration
- Advanced analytics and reports
- Enhanced notification system

## Author

**Sakshi Singh**

[GitHub](https://github.com/Sakshi2905-creator)
