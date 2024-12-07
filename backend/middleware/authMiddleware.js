const jwt = require('jsonwebtoken');

// Use environment variable or fallback secret for token verification
const JWT_SECRET = process.env.JWT_SECRET || 'a7d9a8d9d5b7f3494f6a1b9ab1f8b68c2e678c9d0348a39b349ac4f77d2ecbd8';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    req.user = decoded.user; // Attach decoded payload to the request
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, access denied' });
    }
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Token verification failed' });
  }
};

// Export the middleware
module.exports = authMiddleware;



