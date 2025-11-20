'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { coursesData, CourseDetailsModal, Course } from '@/components/CourseDetails';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleEnroll = (course: Course) => {
    const priceText = course.price > 0 
      ? course.originalPrice && course.originalPrice > course.price
        ? `💰 *Price:* ₦${course.price.toLocaleString()} (Original: ₦${course.originalPrice.toLocaleString()})`
        : `💰 *Price:* ₦${course.price.toLocaleString()}`
      : '';
    
    const message = `Hello Heraim Coding Hub! 👋

I would like to enroll in:

📚 *Course:* ${course.title}
📊 *Level:* ${course.level}
⏱️ *Duration:* ${course.duration}
${priceText ? priceText + '\n' : ''}
Course Syllabus:
${course.syllabus.map((week) => 
  `\n*Week ${week.week}: ${week.title}*
${week.topics.map(topic => `  • ${topic}`).join('\n')}`
).join('\n')}

I'm excited to start learning! Please provide me with enrollment details.

Thank you! 🚀`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2347047249252?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-black/10 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <h1 className="text-2xl font-bold text-black">Heraim Coding Hub</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-black">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-black/60 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-black/5 to-black/10 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-black/70">
            Ready to continue your coding journey?
          </p>
        </div>

        {/* Available Courses */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-black mb-4">Available Courses</h3>
          
          {/* Packages Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {coursesData
              .filter(course => course.id === 9 || course.id === 10) // Frontend Package and Backend Package
              .map((course) => (
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
                  <p className="text-sm text-black/60 mb-2">
                    Duration: {course.duration}
                  </p>
                  {course.price > 0 && (
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-sm text-black/50 line-through">
                            ₦{course.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-bold text-black">
                          ₦{course.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <button 
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                    }}
                    type="button"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>

          {/* Separator Text */}
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-black/70">or select languages individually</p>
          </div>

          {/* Individual Courses Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coursesData
              .filter(course => 
                course.id === 1 || // HTML & CSS
                course.id === 2 || // JavaScript
                course.id === 4 || // Node.js
                course.id === 3 || // React
                course.id === 5 || // SQL
                course.id === 7    // MongoDB
              )
              .sort((a, b) => {
                // Order: HTML & CSS, JS, Node.js, React, SQL, MongoDB
                const order = [1, 2, 4, 3, 5, 7];
                return order.indexOf(a.id) - order.indexOf(b.id);
              })
              .map((course) => (
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
                  <p className="text-sm text-black/60 mb-2">
                    Duration: {course.duration}
                  </p>
                  {course.price > 0 && (
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-sm text-black/50 line-through">
                            ₦{course.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-bold text-black">
                          ₦{course.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                  <button 
                    className="w-full py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourse(course);
                    }}
                    type="button"
                  >
                    View Details
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-black/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-black mb-4">Join Our Community</h3>
          <p className="text-black/70 mb-4">
            Connect with fellow learners and instructors on our Discord server. Get help, share your progress, and participate in live coding sessions.
          </p>
          <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors font-medium">
            Join Discord Community
          </button>
        </div>
      </main>

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