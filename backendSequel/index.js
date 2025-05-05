// index.js
import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { serve, setup } from 'swagger-ui-express';

// Import database connection
import { connectDB } from './db/connection.js';

// Import routes
import todoRoute from './routes/todoRoute.js';
import usersRoute from './routes/usersRoute.js';

// Import Swagger config
import swaggerSpec from './utils/swagger.js';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 5001;

// Body parsing middleware
app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));

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



// Cookie parser middleware
app.use(cookieParser());

// Routes
app.use("/service/todo", todoRoute);
app.use("/service/user", usersRoute);

// API documentation endpoint
app.use("/todolist/api-docs", serve, setup(swaggerSpec, { 
  customSiteTitle: "Todo List Management API",
  customCss: '.swagger-ui .topbar { display: none }'
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Connect to database and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
      console.log(`API Documentation available at: http://localhost:${PORT}/todolist/api-docs`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });