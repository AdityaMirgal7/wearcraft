const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin'); // Adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/your-db-name';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await Admin.create({
    fullName: 'Super Admin',
    email: 'admin@gmail.com',
    password: hashedPassword
  });

  console.log('✅ Admin created:', admin.email);
  process.exit();
}).catch(err => {
  console.error('❌ Failed to connect or create admin:', err);
  process.exit(1);
});
