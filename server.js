const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Load environment variables
dotenv.config({ path: './config.env' });

// Replace <PASSWORD> with the actual password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ DB connection successful!'))
  .catch((err) => console.error('❌ DB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
