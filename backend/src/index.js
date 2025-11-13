import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';
import { connectDB } from './config/db.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@elearning.com' });

    if (adminExists) {
      console.log('⚠️  Admin user already exists');
      console.log('📧 Email: admin@elearning.com');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@elearning.com',
      password: 'Admin123!@#',
      role: 'admin',
      isVerified: true,
      isActive: true,
      bio: 'Platform Administrator'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@elearning.com');
    console.log('🔑 Password: Admin123!@#');
    console.log('⚠️  Please change the password after first login!');

    // Create a sample instructor
    const instructor = await User.create({
      firstName: 'John',
      lastName: 'Instructor',
      email: 'instructor@elearning.com',
      password: 'Instructor123!',
      role: 'instructor',
      isVerified: true,
      isActive: true,
      bio: 'Experienced educator with 10+ years of teaching'
    });

    console.log('\n✅ Sample instructor created!');
    console.log('📧 Email: instructor@elearning.com');
    console.log('🔑 Password: Instructor123!');

    // Create a sample student
    const student = await User.create({
      firstName: 'Jane',
      lastName: 'Student',
      email: 'student@elearning.com',
      password: 'Student123!',
      role: 'student',
      isVerified: true,
      isActive: true,
      bio: 'Passionate learner'
    });

    console.log('\n✅ Sample student created!');
    console.log('📧 Email: student@elearning.com');
    console.log('🔑 Password: Student123!');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedAdmin();