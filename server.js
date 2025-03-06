// api/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Adjust the relative path if needed

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"]; // Default if env variable is missing

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy does not allow this origin"));
      }
    },
    credentials: true, // Allow cookies if needed
  })
);

app.use(bodyParser.json());

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/fields", require("./routes/fieldRoutes"));
app.use("/api/wards", require("./routes/wardRoutes"));
app.use("/api/education", require("./routes/education"));

app.get("/", (req, res) => {
  res.send("DigiRecord API is running...");
});

// Port configuration for local development
const PORT = process.env.PORT || 5000;

// Check if running on Vercel or locally
if (process.env.VERCEL) {
  // On Vercel, export the serverless function using serverless-http
  const serverless = require("serverless-http");
  module.exports = serverless(app);
} else {
  // Locally, start the server normally
  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
  module.exports = app;
}
