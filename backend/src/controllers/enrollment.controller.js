import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Enroll in a course
// @route   POST /api/enrollments/:courseId
// @access  Private
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enroll in unpublished course'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId
    });

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Enrolled successfully',
      data: { enrollment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling in course',
      error: error.message
    });
  }
};

// @desc    Get user enrollments
// @route   GET /api/enrollments
// @access  Private
export const getMyEnrollments = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    const query = { user: req.user._id };

    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'in-progress') {
      query.isCompleted = false;
    }

    const enrollments = await Enrollment.find(query)
      .populate({
        path: 'course',
        select: 'title thumbnail instructor sections totalDuration totalLectures',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .sort('-lastAccessedAt')
      .lean();

    res.status(200).json({
      success: true,
      data: { enrollments, count: enrollments.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollments',
      error: error.message
    });
  }
};

// @desc    Get single enrollment details
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollmentDetails = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName avatar bio'
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this enrollment'
      });
    }

    res.status(200).json({
      success: true,
      data: { enrollment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching enrollment details',
      error: error.message
    });
  }
};

// @desc    Mark lecture as completed
// @route   POST /api/enrollments/:enrollmentId/lectures/:lectureId/complete
// @access  Private
export const completeLecture = async (req, res) => {
  try {
    const { enrollmentId, lectureId } = req.params;
    const { watchTime } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await enrollment.completeLecture(lectureId, watchTime);
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Lecture marked as completed',
      data: { 
        enrollment,
        progress: enrollment.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing lecture',
      error: error.message
    });
  }
};

// @desc    Add note to lecture
// @route   POST /api/enrollments/:enrollmentId/notes
// @access  Private
export const addNote = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const { lecture, content, timestamp } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    enrollment.notes.push({
      lecture,
      content,
      timestamp: timestamp || 0
    });

    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: { enrollment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
};

// @desc    Get notes for enrollment
// @route   GET /api/enrollments/:enrollmentId/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .select('notes user');

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      data: { notes: enrollment.notes }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
};

// @desc    Update note
// @route   PUT /api/enrollments/:enrollmentId/notes/:noteId
// @access  Private
export const updateNote = async (req, res) => {
  try {
    const { enrollmentId, noteId } = req.params;
    const { content } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const note = enrollment.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.content = content;
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: { note }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/enrollments/:enrollmentId/notes/:noteId
// @access  Private
export const deleteNote = async (req, res) => {
  try {
    const { enrollmentId, noteId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    enrollment.notes.pull(noteId);
    await enrollment.save();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
};

// @desc    Get learning progress analytics
// @route   GET /api/enrollments/analytics
// @access  Private
export const getLearningAnalytics = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title category');

    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter(e => e.isCompleted).length;
    const inProgressCourses = totalCourses - completedCourses;
    
    const totalLecturesCompleted = enrollments.reduce(
      (sum, e) => sum + e.completedLectures.length, 0
    );

    const averageProgress = totalCourses > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / totalCourses
      : 0;

    // Category breakdown
    const categoryBreakdown = {};
    enrollments.forEach(enrollment => {
      const category = enrollment.course.category;
      if (!categoryBreakdown[category]) {
        categoryBreakdown[category] = { total: 0, completed: 0 };
      }
      categoryBreakdown[category].total++;
      if (enrollment.isCompleted) {
        categoryBreakdown[category].completed++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCourses,
          completedCourses,
          inProgressCourses,
          totalLecturesCompleted,
          averageProgress: Math.round(averageProgress)
        },
        categoryBreakdown,
        recentActivity: enrollments
          .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
          .slice(0, 5)
          .map(e => ({
            course: e.course.title,
            progress: e.progress,
            lastAccessed: e.lastAccessedAt
          }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};