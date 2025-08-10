const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ msg: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains: { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
  
};

module.exports = authMiddleware;
