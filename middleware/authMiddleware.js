import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {

    // Check for the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch full user data (leaving out password)
        const user = await User.findById(decoded.userId).select('-password');

                if (!user) {
                return res.status(404).json({ message: 'User not found'});
                }
        
                // Attach user to request and call next middleware
                req.user = user;
                next();
            } catch (error) {
                return res.status(401).json({ message: 'Token is not valid' });
            }
        };

