import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all courses with filters
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { 
      category, 
      level, 
      search, 
      sort = '-createdAt',
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      rating
    } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    // Execute query with pagination
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        courses,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName avatar bio')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        user: req.user._id,
        course: course._id
      });
      isEnrolled = !!enrollment;
    }

    res.status(200).json({
      success: true,
      data: { course, isEnrolled }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
      error: error.message
    });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
export const createCourse = async (req, res) => {
  try {
    // Set instructor to current user
    req.body.instructor = req.user._id;

    const course = await Course.create(req.body);

    // Add course to user's created courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: error.message
    });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course Owner/Admin)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: error.message
    });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Course Owner/Admin)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove from instructor's created courses
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { createdCourses: course._id }
    });

    // Delete all enrollments
    await Enrollment.deleteMany({ course: course._id });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting course',
      error: error.message
    });
  }
};

// @desc    Publish/unpublish course
// @route   PATCH /api/courses/:id/publish
// @access  Private (Course Owner/Admin)
export const togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.isPublished = !course.isPublished;
    course.status = course.isPublished ? 'published' : 'draft';
    if (course.isPublished && !course.publishedAt) {
      course.publishedAt = Date.now();
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling publish status',
      error: error.message
    });
  }
};

// @desc    Add section to course
// @route   POST /api/courses/:id/sections
// @access  Private (Course Owner/Admin)
export const addSection = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    course.sections.push(req.body);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding section',
      error: error.message
    });
  }
};

// @desc    Add lecture to section
// @route   POST /api/courses/:id/sections/:sectionId/lectures
// @access  Private (Course Owner/Admin)
export const addLecture = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const section = course.sections.id(req.params.sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    section.lectures.push(req.body);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Lecture added successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding lecture',
      error: error.message
    });
  }
};

// @desc    Add review to course
// @route   POST /api/courses/:id/reviews
// @access  Private (Enrolled students)
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled to review this course'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    course.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
};

// @desc    Get instructor courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private (Instructor)
export const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort('-createdAt')
      .lean();

    res.status(200).json({
      success: true,
      data: { courses, count: courses.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching instructor courses',
      error: error.message
    });
  }
};