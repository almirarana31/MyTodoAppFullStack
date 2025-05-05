// middleware/auth.js
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token has expired" });
        }
        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: "Invalid token" });
        }
        return res.status(401).json({ message: "Token verification failed" });
      }

      // Add the decoded user to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
};