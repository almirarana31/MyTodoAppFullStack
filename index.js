import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import swaggerUi from "swagger-ui-express"
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

import swaggerSpec from './utils/swagger.js'

import todoRoute from './Routes/todoRoute.js'
import usersRoute from './Routes/usersRoute.js'

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CONNECTION_URL = process.env.CONNECTION_URL || 'mongodb://localhost:27017/todoapp';

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Sanitize requests against NoSQL injection
app.use(xss()); // Sanitize requests against XSS attacks

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser());

// Routes
app.use("/service/todo", todoRoute)
app.use("/service/user", usersRoute)

// API documentation endpoint
app.use("/todolist/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
    customSiteTitle: "Todo List Management API",
    customCss: '.swagger-ui .topbar { display: none }'
}))

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start the server
mongoose.connect(CONNECTION_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port: ${PORT}`);
            console.log(`API Documentation available at: http://localhost:${PORT}/todolist/api-docs`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    });