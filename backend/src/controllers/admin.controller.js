import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: Number(page),
        total: count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user details
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses.course', 'title thumbnail')
      .populate('createdCourses', 'title status enrollmentCount')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get enrollment details
    const enrollments = await Enrollment.find({ user: user._id })
      .populate('course', 'title thumbnail')
      .lean();

    res.status(200).json({
      success: true,
      data: { user, enrollments }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message
    });
  }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, isActive, bio } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete user's enrollments
    await Enrollment.deleteMany({ user: user._id });

    // If instructor, handle their courses
    if (user.role === 'instructor') {
      await Course.updateMany(
        { instructor: user._id },
        { $set: { status: 'archived' } }
      );
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Enroll user in course
// @route   POST /api/admin/users/:userId/enroll/:courseId
// @access  Private (Admin only)
export const enrollUserInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'User is already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      user: userId,
      course: courseId
    });

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'User enrolled successfully',
      data: { enrollment }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error enrolling user',
      error: error.message
    });
  }
};

// @desc    Remove user from course
// @route   DELETE /api/admin/users/:userId/enroll/:courseId
// @access  Private (Admin only)
export const unenrollUser = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const enrollment = await Enrollment.findOneAndDelete({
      user: userId,
      course: courseId
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'User unenrolled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unenrolling user',
      error: error.message
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalEnrollments = await Enrollment.countDocuments();

    // Revenue (if you add payment functionality later)
    const totalRevenue = await Course.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$enrollmentCount'] } } } }
    ]);

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate('user', 'firstName lastName')
      .populate('course', 'title')
      .sort('-createdAt')
      .limit(10);

    // Top courses
    const topCourses = await Course.find({ isPublished: true })
      .sort('-enrollmentCount')
      .limit(5)
      .select('title enrollmentCount averageRating');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalInstructors,
          totalCourses,
          publishedCourses,
          totalEnrollments,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        recentEnrollments,
        topCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching platform statistics',
      error: error.message
    });
  }
};

// @desc    Update course syllabus/content
// @route   PUT /api/admin/courses/:id/syllabus
// @access  Private (Admin only)
export const updateCourseSyllabus = async (req, res) => {
  try {
    const { sections } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (sections) {
      course.sections = sections;
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: 'Course syllabus updated successfully',
      data: { course }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating course syllabus',
      error: error.message
    });
  }
};

// @desc    Bulk operations on users
// @route   POST /api/admin/users/bulk
// @access  Private (Admin only)
export const bulkUserOperations = async (req, res) => {
  try {
    const { operation, userIds } = req.body;

    if (!['activate', 'deactivate', 'delete'].includes(operation)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operation'
      });
    }

    let result;

    switch (operation) {
      case 'activate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: true } }
        );
        break;
      case 'deactivate':
        result = await User.updateMany(
          { _id: { $in: userIds } },
          { $set: { isActive: false } }
        );
        break;
      case 'delete':
        // Prevent deleting self
        const filteredIds = userIds.filter(id => id !== req.user._id.toString());
        result = await User.deleteMany({ _id: { $in: filteredIds } });
        await Enrollment.deleteMany({ user: { $in: filteredIds } });
        break;
    }

    res.status(200).json({
      success: true,
      message: `Bulk ${operation} completed successfully`,
      data: { modifiedCount: result.modifiedCount || result.deletedCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation',
      error: error.message
    });
  }
};