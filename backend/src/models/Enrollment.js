import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedLectures: [{
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: {
      type: Number, // in seconds
      default: 0
    }
  }],
  lastAccessedLecture: {
    type: mongoose.Schema.Types.ObjectId
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: String,
  notes: [{
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    content: {
      type: String,
      required: true,
      maxLength: 2000
    },
    timestamp: {
      type: Number, // video timestamp in seconds
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one enrollment per user per course
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ user: 1, lastAccessedAt: -1 });

// Method to update progress
enrollmentSchema.methods.updateProgress = async function() {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course);
  
  if (!course) return;

  const totalLectures = course.totalLectures;
  const completedCount = this.completedLectures.length;

  this.progress = totalLectures > 0 ? Math.round((completedCount / totalLectures) * 100) : 0;

  // Check if course is completed
  if (this.progress >= 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
};

// Method to mark lecture as completed
enrollmentSchema.methods.completeLecture = async function(lectureId, watchTime) {
  const alreadyCompleted = this.completedLectures.some(
    cl => cl.lecture.toString() === lectureId.toString()
  );

  if (!alreadyCompleted) {
    this.completedLectures.push({
      lecture: lectureId,
      watchTime: watchTime || 0
    });
    
    await this.updateProgress();
  }

  this.lastAccessedLecture = lectureId;
  this.lastAccessedAt = new Date();
};

export default mongoose.model('Enrollment', enrollmentSchema);