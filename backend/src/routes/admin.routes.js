import express from 'express';
import {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  enrollUserInCourse,
  unenrollUser,
  getPlatformStats,
  updateCourseSyllabus,
  bulkUserOperations
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/bulk', bulkUserOperations);

// Enrollment management
router.post('/users/:userId/enroll/:courseId', enrollUserInCourse);
router.delete('/users/:userId/enroll/:courseId', unenrollUser);

// Course management
router.put('/courses/:id/syllabus', updateCourseSyllabus);

// Platform statistics
router.get('/stats', getPlatformStats);

export default router;