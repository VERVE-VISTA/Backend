import express from 'express';
import mongoose from 'mongoose';
import routes from './routes/routes.js';  // Routes file import
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://safeG:safeG@cluster0.bzykoxx.mongodb.net/MarketingManagement?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  });

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  next();  // Proceed to the next middleware or route handler
});

// Response Logging Middleware
app.use((req, res, next) => {
  // Wrap the res.send function to log the status code and response body
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`Response status: ${res.statusCode}`);
    console.log(`Response body: ${body}`);
    return originalSend.apply(this, arguments);
  };
  next();
});

// Routes
app.use('/api', routes);  // Prefix all routes with /api
app.use(notFoundError);
app.use(errorHandler);
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(`Error processing request: ${req.method} ${req.url}`);
  console.error(`Error details: ${err.message}`);
  res.status(err.status || 500).send(err.message);
});

// Handle unknown routes (404)
app.use((req, res) => {
  console.log('404 Not Found:', req.originalUrl);
  res.status(404).send('Route not found');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser and visit http://localhost:${PORT}`);
});
