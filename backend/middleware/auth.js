import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET; // Use environment variable in production

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ error: 'No token provided.' });
  
  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if(err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};
