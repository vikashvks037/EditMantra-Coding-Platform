const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const morgan = require('morgan'); // For request logging
const { Server } = require('socket.io');
const http = require('http');
const User = require('./models/User'); // Ensure path correctness
const Admin = require('./models/Admin'); // Ensure path correctness
const Room = require('./models/Room');

const app = express();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize WebSocket server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Use environment variable for frontend URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow requests from the frontend (adjust this URL if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));

app.use(bodyParser.json());  // For parsing incoming JSON requests
app.use(helmet());  // Security middleware to set various HTTP headers
app.use(morgan('dev'));  // Logs HTTP requests for easier debugging

// Rate Limiting: Limiting requests to avoid abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // Max 100 requests per window per IP
});
app.use(limiter);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/EditMantra', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];  // Extract token from 'Bearer token'
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = user;  // Attach user info from the token to the request
    next();
  });
};

// Handle preflight requests (OPTIONS) for CORS
app.options('*', cors());  // Allow preflight requests for all routes

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Example of adding a user to a room
const addUserToRoom = async (roomId, userId, username) => {
  let room = await Room.findOne({ roomId });
  if (!room) {
    // Create new room if it doesn't exist
    room = new Room({
      roomId,
      users: [{ userId, username }],
      code: '', // Initialize with empty code
    });
    await room.save();
  } else {
    // Add user to existing room
    room.users.push({ userId, username });
    await room.save();
  }
};

// Route to /signup/user
app.post('/signup/user', async (req, res) => {
  const { name, email, username, password } = req.body;

  // Validate input
  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
    });
  }

  try {
    const [existingUser, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Log In Route (For both Users and Admins)
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }

  try {
    let user;

    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'user') {
      user = await User.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    if (!user) {
      return res.status(401).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} login successful`,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Profile Route (Requires Authentication)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;
    let user;

    if (role === 'admin') {
      user = await Admin.findById(req.user.userId).select('-password');
    } else if (role === 'user') {
      user = await User.findById(req.user.userId).select('-password');
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!user) {
      return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found.` });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ message: 'Error retrieving profile data.' });
  }
});

// Admin Sign Up Route
app.post('/signup/admin', async (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers, and symbols.',
    });
  }

  try {
    const [existingAdmin, existingUsername] = await Promise.all([
      Admin.findOne({ email }),
      Admin.findOne({ username })
    ]);

    if (existingAdmin) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully!' });
  } catch (error) {
    console.error('Error during admin signup:', error.message);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Verify Username Route
app.post('/verify-username', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    // Check if the username already exists in the database
    const user = await User.findOne({ username });

    if (user) {
      return res.status(200).json({ message: 'Username verified successfully' });
    } else {
      return res.status(404).json({ message: 'Username not found. Please register first.' });
    }
  } catch (error) {
    console.error('Error verifying username:', error.message);
    res.status(500).json({ message: 'Server error during username verification.' });
  }
});

// Start server on specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});