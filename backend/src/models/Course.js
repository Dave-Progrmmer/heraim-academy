import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lecture title is required'],
    trim: true
  },
  description: String,
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 0
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'video', 'article', 'code', 'other']
    }
  }],
  order: {
    type: Number,
    default: 0
  },
  isFree: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Section title is required'],
    trim: true
  },
  description: String,
  lectures: [lectureSchema],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxLength: 1000
  }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxLength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxLength: 300
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'AI',
      'Design',
      'Business',
      'Marketing',
      'Photography',
      'Music',
      'Fitness',
      'Language',
      'Other'
    ]
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  },
  language: {
    type: String,
    default: 'English'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
    default: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  thumbnail: {
    url: String,
    publicId: String
  },
  previewVideo: {
    url: String,
    publicId: String
  },
  sections: [sectionSchema],
  totalDuration: {
    type: Number, // in minutes
    default: 0
  },
  totalLectures: {
    type: Number,
    default: 0
  },
  requirements: [String],
  whatYouWillLearn: [String],
  targetAudience: [String],
  tags: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1, isPublished: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ averageRating: -1 });
courseSchema.index({ enrollmentCount: -1 });

// Generate slug before saving
courseSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Calculate total duration and lectures
courseSchema.pre('save', function(next) {
  if (this.sections && this.sections.length > 0) {
    let totalDuration = 0;
    let totalLectures = 0;

    this.sections.forEach(section => {
      if (section.lectures && section.lectures.length > 0) {
        totalLectures += section.lectures.length;
        section.lectures.forEach(lecture => {
          totalDuration += lecture.duration || 0;
        });
      }
    });

    this.totalDuration = totalDuration;
    this.totalLectures = totalLectures;
  }
  next();
});

// Calculate average rating
courseSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
    this.ratingCount = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.ratingCount = 0;
  }
  next();
});

export default mongoose.model('Course', courseSchema);