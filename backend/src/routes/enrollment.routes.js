import express from 'express';
import {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentDetails,
  completeLecture,
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  getLearningAnalytics
} from '../controllers/enrollment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All enrollment routes require authentication
router.use(protect);

// Enrollment management
router.post('/:courseId', enrollInCourse);
router.get('/', getMyEnrollments);
router.get('/analytics', getLearningAnalytics);
router.get('/:id', getEnrollmentDetails);

// Progress tracking
router.post('/:enrollmentId/lectures/:lectureId/complete', completeLecture);

// Notes management
router.post('/:enrollmentId/notes', addNote);
router.get('/:enrollmentId/notes', getNotes);
router.put('/:enrollmentId/notes/:noteId', updateNote);
router.delete('/:enrollmentId/notes/:noteId', deleteNote);

export default router;