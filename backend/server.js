const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorHandler')
const apiLimiter = require('./middleware/rateLimiter')
const attendanceRoutes = require('./routes/attendance')


// Import routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')

const PORT = process.env.PORT || 8008;

const app = express();
dotenv.config();
connectDB();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('This is Smart attendance')
})

app.listen(PORT, () => { console.log('Server Started') })