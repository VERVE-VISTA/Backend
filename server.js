import express from 'express';
import mongoose from 'mongoose';
import config from './config.js';  // Configuration file import
import routes from './routes/routes.js';  // Routes file import

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());  // Parse JSON bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://safeG:safeG@cluster0.bzykoxx.mongodb.net/MarketingManagement?retryWrites=true&w=majority')

.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Routes
app.use('/api', routes);  // Prefix all routes with /api

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
