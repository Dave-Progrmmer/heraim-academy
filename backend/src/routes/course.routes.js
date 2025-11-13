import express from 'express';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  togglePublish,
  addSection,
  addLecture,
  addReview,
  getInstructorCourses
} from '../controllers/course.controller.js';
import { protect, authorize, checkOwnership, optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', optionalAuth, getCourse);

// Protected routes - Instructor & Admin
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.get('/instructor/my-courses', protect, authorize('instructor', 'admin'), getInstructorCourses);

// Course owner or admin routes
router.put('/:id', protect, checkOwnership('course'), updateCourse);
router.delete('/:id', protect, checkOwnership('course'), deleteCourse);
router.patch('/:id/publish', protect, checkOwnership('course'), togglePublish);
router.post('/:id/sections', protect, checkOwnership('course'), addSection);
router.post('/:id/sections/:sectionId/lectures', protect, checkOwnership('course'), addLecture);

// Reviews - any enrolled student
router.post('/:id/reviews', protect, addReview);

export default router;