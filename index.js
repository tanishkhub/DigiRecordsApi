const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Replace with your frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // For parsing application/json

// Handle preflight OPTIONS requests for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); // Change '*' to your allowed domain in production
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

// API Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/fields', require('./routes/fieldRoutes'));
app.use('/api/wards', require('./routes/wardRoutes'));
app.use('/api/education', require('./routes/education'));
app.use("/api/caste", require("./routes/casteRoutes"));
app.use("/api/subcaste", require("./routes/subCasteRoutes"));
app.use("/api/gotra", require("./routes/gotraRoutes"));
app.use("/api/district", require("./routes/districtRoutes"));
app.use("/api/tehsil", require("./routes/tehsilRoutes"));

// Root endpoint displays a list of available endpoints
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Available Endpoints</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background-color: #f0f0f0;
          }
          h1 {
            text-align: center;
          }
          ul {
            list-style: none;
            padding: 0;
          }
          li {
            margin: 10px 0;
          }
          a {
            text-decoration: none;
            color: #007bff;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Available Endpoints</h1>
        <ul>
          <li><a href="/api/admin">/api/admin</a></li>
          <li><a href="/api/users">/api/users</a></li>
          <li><a href="/api/fields">/api/fields</a></li>
          <li><a href="/api/wards">/api/wards</a></li>
          <li><a href="/api/education">/api/education</a></li>
          <li><a href="/api/caste">/api/caste</a></li>
          <li><a href="/api/subcaste">/api/subcaste</a></li>
          <li><a href="/api/gotra">/api/gotra</a></li>
          <li><a href="/api/district">/api/district</a></li>
          <li><a href="/api/tehsil">/api/tehsil</a></li>
        </ul>
      </body>
    </html>
  `);
});

// 404 handler for endpoints not found
app.use((req, res, next) => {
  res.status(404).send(`
    <html>
      <head>
        <title>Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
          }
          .error-message {
            font-size: 1.5em;
            color: red;
          }
        </style>
      </head>
      <body>
        <div class="error-message">Error is coming: Endpoint not found!</div>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
