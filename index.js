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
app.use(cors());
app.use(express.json()); // For parsing application/json

// DigiRecord API routes
app.use('/api/admin', require('./routes/adminroutes'));
app.use('/api/users', require('./routes/userroutes'));
app.use('/api/fields', require('./routes/fieldroutes'));
app.use('/api/wards', require('./routes/wardroutes'));
app.use('/api/education', require('./routes/education'));

// Root route: Display an HTML page for any unmatched path
app.get('/', async (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f0f0f0;
          }
          .message {
            font-size: 1.5em;
            margin-bottom: 20px;
          }
          .link {
            font-size: 1.2em;
            color: #007bff;
            text-decoration: none;
          }
          .link:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="message">
          I think you are lost. Let me get you to the right path!
        </div>
        <a href="https://www.digirecords.vercel.app" class="link">Go to DigiRecord</a>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
