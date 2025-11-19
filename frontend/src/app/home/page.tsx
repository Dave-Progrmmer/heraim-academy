'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Courses</h3>
            </div>
            <p className="text-3xl font-bold text-black">0</p>
            <p className="text-sm text-black/60 mt-1">In Progress</p>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Assignments</h3>
            </div>
            <p className="text-3xl font-bold text-black">0</p>
            <p className="text-sm text-black/60 mt-1">Due This Week</p>
          </div>

          <div className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-black">Progress</h3>
            </div>
            <p className="text-3xl font-bold text-black">0%</p>
            <p className="text-sm text-black/60 mt-1">Overall Completion</p>
          </div>
        </div>

        {/* Available Courses */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-black mb-4">Available Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'HTML & CSS Fundamentals', level: 'Beginner', duration: '4 weeks' },
              { title: 'JavaScript Essentials', level: 'Beginner', duration: '6 weeks' },
              { title: 'React Development', level: 'Intermediate', duration: '8 weeks' },
              { title: 'Node.js & Express', level: 'Intermediate', duration: '6 weeks' },
              { title: 'SQL & Databases', level: 'Intermediate', duration: '5 weeks' },
              { title: 'Full Stack Project', level: 'Advanced', duration: '10 weeks' },
            ].map((course, index) => (
              <div
                key={index}
                className="bg-white border border-black/10 rounded-xl p-6 hover:shadow-lg hover:border-black/30 transition-all cursor-pointer group"
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
                <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-black/80 transition-colors text-sm font-medium">
                  Enroll Now
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
    </div>
  );
}