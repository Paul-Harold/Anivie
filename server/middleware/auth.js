const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
  // 1. Look for the VIP Pass in the headers
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ message: "Access Denied. No token provided." });

  // 2. Extract the token (Remove the "Bearer " part)
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Access Denied. Invalid token format." });

  try {
    // 3. Verify the token is real and hasn't been tampered with
    const verified = jwt.verify(token, JWT_SECRET);
    
    // 4. Attach the decoded user data (including their ID) to the request!
    req.user = verified;
    next(); // Let them pass!
  } catch (err) {
    res.status(400).json({ message: "Invalid Token." });
  }
};