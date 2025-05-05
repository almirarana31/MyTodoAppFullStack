import { config } from 'dotenv';
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { serve, setup } from 'swagger-ui-express';
import { connectDB } from './db/connection.js';

// import routes
import todoRoute from './routes/todoRoute.js';
import usersRoute from './routes/usersRoute.js';

// swagger config
import swaggerSpec from './utils/swagger.js';

config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));

app.use(helmet()); 
app.use(mongoSanitize()); 
app.use(xss()); 

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser());

app.use("/service/todo", todoRoute);
app.use("/service/user", usersRoute);

app.use("/todolist/api-docs", serve, setup(swaggerSpec, { 
  customSiteTitle: "Todo List Management API",
  customCss: '.swagger-ui .topbar { display: none }'
}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

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