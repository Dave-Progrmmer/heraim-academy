import React, { useState } from 'react';

// Type definitions
type SyllabusWeek = {
  week: number;
  title: string;
  topics: string[];
};

export type Course = {
  id: number;
  title: string;
  level: string;
  duration: string;
  description: string;
  instructor: string;
  students: number;
  syllabus: SyllabusWeek[];
};

const coursesData: Course[] = [
  {
    id: 1,
    title: 'HTML & CSS Fundamentals',
    level: 'Beginner',
    duration: '4 weeks',
    description: 'Master the building blocks of web development. Learn to create beautiful, responsive websites from scratch.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'Introduction to HTML',
        topics: [
          'HTML basics and structure',
          'Common HTML tags and elements',
          'Forms and input types',
          'Semantic HTML5'
        ]
      },
      {
        week: 2,
        title: 'CSS Fundamentals',
        topics: [
          'CSS syntax and selectors',
          'Box model and positioning',
          'Colors, fonts, and text styling',
          'CSS units and measurements'
        ]
      },
      {
        week: 3,
        title: 'Advanced CSS',
        topics: [
          'Flexbox layout',
          'CSS Grid',
          'Responsive design principles',
          'Media queries'
        ]
      },
      {
        week: 4,
        title: 'Project Week',
        topics: [
          'Building a complete responsive website',
          'Best practices and optimization',
          'Browser compatibility',
          'Deployment basics'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'JavaScript Essentials',
    level: 'Beginner',
    duration: '6 weeks',
    description: 'Learn the fundamentals of JavaScript programming and add interactivity to your websites.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'JavaScript Basics',
        topics: [
          'Variables and data types',
          'Operators and expressions',
          'Control flow (if/else, switch)',
          'Loops and iterations'
        ]
      },
      {
        week: 2,
        title: 'Functions and Scope',
        topics: [
          'Function declarations and expressions',
          'Arrow functions',
          'Scope and closures',
          'Higher-order functions'
        ]
      },
      {
        week: 3,
        title: 'DOM Manipulation',
        topics: [
          'Selecting elements',
          'Modifying content and styles',
          'Event handling',
          'Form validation'
        ]
      },
      {
        week: 4,
        title: 'Arrays and Objects',
        topics: [
          'Array methods (map, filter, reduce)',
          'Object manipulation',
          'JSON and data structures',
          'ES6+ features'
        ]
      },
      {
        week: 5,
        title: 'Asynchronous JavaScript',
        topics: [
          'Callbacks and promises',
          'Async/await',
          'Fetch API',
          'Error handling'
        ]
      },
      {
        week: 6,
        title: 'Project Week',
        topics: [
          'Building interactive web applications',
          'Local storage',
          'API integration',
          'Code organization and best practices'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'React Development',
    level: 'Intermediate',
    duration: '8 weeks',
    description: 'Build modern, dynamic web applications using React, the most popular JavaScript library.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'React Fundamentals',
        topics: [
          'Introduction to React',
          'JSX and components',
          'Props and state',
          'Event handling'
        ]
      },
      {
        week: 2,
        title: 'Component Lifecycle',
        topics: [
          'Class components vs functional components',
          'useEffect hook',
          'Component lifecycle methods',
          'Conditional rendering'
        ]
      },
      {
        week: 3,
        title: 'Advanced Hooks',
        topics: [
          'useState and useEffect deep dive',
          'useContext for state management',
          'useReducer hook',
          'Custom hooks'
        ]
      },
      {
        week: 4,
        title: 'React Router',
        topics: [
          'Client-side routing',
          'Route parameters',
          'Nested routes',
          'Navigation and redirects'
        ]
      },
      {
        week: 5,
        title: 'State Management',
        topics: [
          'Context API',
          'Redux basics',
          'Redux Toolkit',
          'State management patterns'
        ]
      },
      {
        week: 6,
        title: 'API Integration',
        topics: [
          'Fetching data in React',
          'Loading and error states',
          'Data caching',
          'React Query basics'
        ]
      },
      {
        week: 7,
        title: 'Forms and Validation',
        topics: [
          'Controlled components',
          'Form libraries (Formik, React Hook Form)',
          'Validation schemas',
          'File uploads'
        ]
      },
      {
        week: 8,
        title: 'Final Project',
        topics: [
          'Building a full-featured React app',
          'Performance optimization',
          'Testing basics',
          'Deployment to production'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Node.js & Express',
    level: 'Intermediate',
    duration: '6 weeks',
    description: 'Learn server-side JavaScript development with Node.js and build RESTful APIs with Express.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'Node.js Fundamentals',
        topics: [
          'Introduction to Node.js',
          'NPM and package management',
          'Modules and require',
          'File system operations'
        ]
      },
      {
        week: 2,
        title: 'Express Framework',
        topics: [
          'Setting up Express',
          'Routing and middleware',
          'Request and response handling',
          'Error handling'
        ]
      },
      {
        week: 3,
        title: 'RESTful APIs',
        topics: [
          'REST principles',
          'CRUD operations',
          'HTTP methods and status codes',
          'API design best practices'
        ]
      },
      {
        week: 4,
        title: 'Authentication & Security',
        topics: [
          'JWT authentication',
          'Password hashing',
          'Authorization and roles',
          'Security best practices'
        ]
      },
      {
        week: 5,
        title: 'Database Integration',
        topics: [
          'Connecting to databases',
          'MongoDB with Mongoose',
          'Data validation',
          'Relationships and population'
        ]
      },
      {
        week: 6,
        title: 'Advanced Topics',
        topics: [
          'File uploads with Multer',
          'Email sending',
          'Payment integration basics',
          'API documentation and deployment'
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'SQL & Databases',
    level: 'Intermediate',
    duration: '5 weeks',
    description: 'Master SQL and learn to design, query, and manage relational databases effectively.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'Database Basics',
        topics: [
          'Introduction to databases',
          'Relational database concepts',
          'Database design principles',
          'Primary and foreign keys'
        ]
      },
      {
        week: 2,
        title: 'SQL Fundamentals',
        topics: [
          'SELECT queries',
          'WHERE clause and filtering',
          'ORDER BY and LIMIT',
          'Aggregate functions (COUNT, SUM, AVG)'
        ]
      },
      {
        week: 3,
        title: 'Advanced SQL',
        topics: [
          'JOINs (INNER, LEFT, RIGHT, FULL)',
          'Subqueries',
          'GROUP BY and HAVING',
          'UNION and set operations'
        ]
      },
      {
        week: 4,
        title: 'Data Manipulation',
        topics: [
          'INSERT, UPDATE, DELETE',
          'Transactions',
          'Indexes and performance',
          'Views and stored procedures'
        ]
      },
      {
        week: 5,
        title: 'Real-world Applications',
        topics: [
          'Database normalization',
          'Query optimization',
          'Backup and recovery',
          'Working with Node.js/Express'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Full Stack Project',
    level: 'Advanced',
    duration: '10 weeks',
    description: 'Put all your skills together and build a complete full-stack application from scratch.',
    instructor: 'Heraim Team',
    students: 0,
    syllabus: [
      {
        week: 1,
        title: 'Project Planning',
        topics: [
          'Requirement analysis',
          'System design',
          'Database schema design',
          'API planning'
        ]
      },
      {
        week: 2,
        title: 'Backend Setup',
        topics: [
          'Project structure',
          'Database setup',
          'Authentication system',
          'Core API endpoints'
        ]
      },
      {
        week: 3,
        title: 'Advanced Backend',
        topics: [
          'File upload functionality',
          'Email notifications',
          'Data validation',
          'Error handling'
        ]
      },
      {
        week: 4,
        title: 'Frontend Setup',
        topics: [
          'React project structure',
          'State management setup',
          'Routing configuration',
          'Component library'
        ]
      },
      {
        week: 5,
        title: 'UI Development',
        topics: [
          'Building main pages',
          'Forms and validation',
          'Responsive design',
          'User experience'
        ]
      },
      {
        week: 6,
        title: 'API Integration',
        topics: [
          'Connecting frontend to backend',
          'Authentication flow',
          'CRUD operations',
          'Loading and error states'
        ]
      },
      {
        week: 7,
        title: 'Advanced Features',
        topics: [
          'Real-time updates',
          'Search and filtering',
          'Pagination',
          'Data visualization'
        ]
      },
      {
        week: 8,
        title: 'Testing',
        topics: [
          'Unit testing',
          'Integration testing',
          'End-to-end testing',
          'Bug fixing'
        ]
      },
      {
        week: 9,
        title: 'Optimization',
        topics: [
          'Performance optimization',
          'Code refactoring',
          'Security hardening',
          'Accessibility'
        ]
      },
      {
        week: 10,
        title: 'Deployment',
        topics: [
          'Preparing for production',
          'Deployment strategies',
          'Monitoring and logging',
          'Maintenance and updates'
        ]
      }
    ]
  }
];

type CourseDetailsModalProps = {
  course: Course;
  onClose: () => void;
  onEnroll: (course: Course) => void;
};

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({ course, onClose, onEnroll }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-black/5 to-black/10 p-6 rounded-t-2xl border-b border-black/10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-black">{course.title}</h2>
                <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-black border border-black/20">
                  {course.level}
                </span>
              </div>
              <p className="text-black/70 mb-3">{course.description}</p>
              <div className="flex gap-4 text-sm text-black/60">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                  </svg>
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                  <span>{course.students} students enrolled</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white rounded-full transition-colors"
              type="button"
            >
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Syllabus Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            Course Syllabus
          </h3>
          
          <div className="space-y-4">
            {course.syllabus.map((week, index) => (
              <div
                key={index}
                className="bg-white border border-black/10 rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {week.week}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-black mb-2">{week.title}</h4>
                    <ul className="space-y-2">
                      {week.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-start gap-2 text-black/70">
                          <svg className="w-5 h-5 text-black flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/5 p-6 rounded-b-2xl border-t border-black/10">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg border-2 border-black/20 hover:bg-black/5 transition-colors font-medium"
              type="button"
            >
              Close
            </button>
            <button
              onClick={() => onEnroll(course)}
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors font-medium flex items-center justify-center gap-2"
              type="button"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              Enroll via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo Component
export default function CourseDetailsDemo() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleEnroll = (course: Course) => {
    const message = `Hello Heraim Coding Hub! 👋

I would like to enroll in:

📚 *Course:* ${course.title}
📊 *Level:* ${course.level}
⏱️ *Duration:* ${course.duration}

Course Syllabus:
${course.syllabus.map((week) => 
  `\n*Week ${week.week}: ${week.title}*
${week.topics.map(topic => `  • ${topic}`).join('\n')}`
).join('\n')}

I'm excited to start learning! Please provide me with enrollment details.

Thank you! 🚀`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2349057843965?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">Available Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg hover:border-black/30 transition-all cursor-pointer group"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-black group-hover:underline">
                  {course.title}
                </h4>
                <span className="text-xs font-medium px-2 py-1 bg-black/10 rounded-full text-black">
                  {course.level}
                </span>
              </div>
              <p className="text-sm text-black/60 mb-4">
                Duration: {course.duration}
              </p>
              <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors text-sm font-medium" type="button">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCourse && (
        <CourseDetailsModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
        />
      )}
    </div>
  );
}