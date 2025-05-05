# Full Stack Todo Application

A modern, feature-rich todo application with a React frontend and Node.js/Express backend.

![Todo App Screenshot](https://via.placeholder.com/800x400?text=Todo+App+Screenshot)

## Features

- **User Authentication**
  - Sign up with email verification
  - Login with JWT authentication
  - Password reset functionality
  - Profile management

- **Todo Management**
  - Create, view, edit and delete todos
  - Set priorities (low, medium, high)
  - Set due dates
  - Mark todos as active or finished
  - Responsive UI

- **Security Features**
  - JWT authentication
  - Password hashing
  - XSS protection
  - Rate limiting
  - CORS configuration

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Axios
- Material UI components
- Tailwind CSS
- Cloudinary (for image uploads)
- Formik & Yup (for form validation)

### Backend
- Node.js
- Express.js
- MongoDB
- Custom MongoDB-Sequelize adapter
- JWT for authentication
- Nodemailer (for sending emails)
- Swagger (API documentation)

## Project Structure

```
backendTodoApp/
├── backendSequel/              # Backend Node.js server
│   ├── controllers/            # Request handlers
│   ├── db/                     # Database configuration
│   ├── middleware/             # Express middleware
│   ├── models/                 # Data models
│   ├── routes/                 # API routes
│   └── utils/                  # Utility functions
│
└── frontendtodoapp/            # React frontend
    ├── public/                 # Static files
    └── src/
        ├── components/         # React components
        │   ├── Auth/           # Authentication components
        │   ├── common/         # Shared components
        │   ├── Layout/         # Layout components
        │   ├── Profile/        # User profile components
        │   └── Todo/           # Todo management components
        ├── config/             # Configuration files
        ├── context/            # React context
        ├── services/           # API services
        └── store/              # Redux store
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backendSequel
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5001
   CONNECTION_URL=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   EMAIL_USER=your_email_for_sending_verification
   EMAIL_PASS=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontendtodoapp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

### Running Both Frontend and Backend Concurrently

From the root directory, you can run both the frontend and backend concurrently:
```
npm run dev
```

## API Documentation

Once the backend server is running, you can access the Swagger API documentation at:
```
http://localhost:5001/todolist/api-docs
```

## Color Theme

The application uses a pink color theme for UI elements including:
- Buttons
- Focus states
- Loading animations
- Accent colors

## License

MIT

## Author

Almira Rana