import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the database using ID in the token, excluding the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      return next();
    } catch (error) {
      console.error(`Auth verification error: ${error.message}`);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin validation - Ensure request is made by an Admin user
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Requires administrator privilege' });
  }
};
