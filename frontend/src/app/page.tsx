'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// API Base URL
const API_URL = 'https://heraim.vercel.app/api';

// Types
interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
    token: string;
  };
  error?: string;
  errors?: string[];
}

const CodeIcon = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="inline-block animate-bounce"
    style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
  >
    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </div>
);

// Welcome Screen Component
const WelcomeScreen = ({ onContinue }: { onContinue: () => void }) => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const features = [
    {
      icon: "🎯",
      title: "Interactive Classes",
      description: "Join us on Discord for live, screen-sharing sessions where we will guide you through the world of coding."
    },
    {
      icon: "📚",
      title: "Comprehensive Curriculum",
      description: "Master HTML, CSS, JavaScript, Node.js, React, and SQL with our carefully crafted courses."
    },
    {
      icon: "💻",
      title: "Hands-on Learning",
      description: "Get practical experience and feedback from our supportive community."
    },
    {
      icon: "⏰",
      title: "Flexible Schedule",
      description: "Learn at your own pace, anytime, anywhere."
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-black/5 rounded-full blur-xl animate-float"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div 
        className={`relative max-w-4xl w-full transition-all duration-1000 transform ${
          fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-black/10">
          {/* Header with Animation */}
          <div className="text-center mb-8">
            <div className="flex justify-center gap-2 mb-4">
              <CodeIcon delay={0} />
              <CodeIcon delay={200} />
              <CodeIcon delay={400} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 animate-pulse">
              Welcome to Heraim Coding Hub!
            </h1>
            <p className="text-lg text-black max-w-2xl mx-auto leading-relaxed">
              Join our vibrant community and embark on a coding journey like no other! We're not a traditional school, 
              but a <span className="font-semibold text-black underline">dynamic collective</span> of tech enthusiasts and like-minded learners.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-6 rounded-xl border-2 border-black/10 hover:border-black transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:underline transition-colors">
                  {feature.title}
                </h3>
                <p className="text-black/80 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Technologies */}
          <div className="bg-black/5 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-black mb-4 text-center">
              🚀 Technologies You'll Master
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'SQL'].map((tech, index) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-black shadow-md hover:shadow-lg transform hover:scale-110 border border-black/10 transition-all duration-300 cursor-pointer"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-4">
            <p className="text-lg text-black font-medium">
              Don't miss this opportunity to transform your passion into a skill!
            </p>
            <p className="text-xl font-bold text-black">
              You won't regret it! 🎉
            </p>
            <p className="text-black/80 mb-6">
              Our community is dedicated to helping you succeed, and we are committed to ensuring you become a proficient coder.
            </p>
            
            <button
              onClick={onContinue}
              className="group relative px-8 py-4 bg-black text-white text-lg font-bold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </button>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="mt-6 text-center animate-bounce">
          <span className="inline-block bg-black/10 backdrop-blur px-6 py-2 rounded-full text-sm font-medium text-black shadow-lg">
            ✨ Come for the learning, stay for the community!
          </span>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(20px);
          }
        }

        .animate-float {
          animation: float infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Eye icon SVGs
const EyeIcon = ({ open = false }: { open: boolean }) => open ? (
  // Eye Open
  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.458 12C2.732 7.943 6.523 5 12 5c5.478 0 9.268 2.943 10.542 7-.325 1.14-1.263 3.103-3.285 5.22-1.906 1.992-4.518 3.78-7.257 3.78s-5.351-1.788-7.257-3.78C2.721 15.104 1.783 13.141 1.458 12z"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
) : (
  // Eye Closed
  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.478 0-9.268-2.943-10.542-7a13.086 13.086 0 012.799-4.119M21.542 12.001a12.074 12.074 0 00-1.33-2.447M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.1 6.1l11.8 11.8"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/>
  </svg>
);

export default function AuthScreens() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Visibility state for password fields
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [signupPasswordVisible, setSignupPasswordVisible] = useState(false);
  const [signupConfirmPasswordVisible, setSignupConfirmPasswordVisible] = useState(false);

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup Form State
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });

  // Handle Login
  const handleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        setSuccess('Login successful! Redirecting...');
        // Store token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Reset form
        setLoginData({ email: '', password: '' });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async () => {
    setError('');
    setSuccess('');

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.data) {
        setSuccess('Account created successfully! Redirecting...');
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Reset form
        setSignupData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        });
        
        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setError(data.message || data.errors?.join(', ') || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <WelcomeScreen onContinue={() => setShowWelcome(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Heraim Coding Hub
          </h1>
          <p className="text-black/80">
            {isLogin ? 'Welcome back!' : 'Start your learning journey'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-black/10">
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-6 bg-black/5 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white text-black shadow-sm border border-black/20'
                  : 'text-black/50 hover:text-black'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-white text-black shadow-sm border border-black/20'
                  : 'text-black/50 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={loginPasswordVisible ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 focus:outline-none"
                    aria-label={loginPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={loginPasswordVisible} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  <span className="text-black/60">Remember me</span>
                </label>
                <button className="text-black/70 hover:text-black hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !loginData.email || !loginData.password}
                className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-black/80 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            /* Signup Form */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  I am a
                </label>
                <select
                  value={signupData.role}
                  onChange={(e) =>
                    setSignupData({ ...signupData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={signupPasswordVisible ? "text" : "password"}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setSignupPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 focus:outline-none"
                    aria-label={signupPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={signupPasswordVisible} />
                  </button>
                </div>
                <p className="text-xs text-black/50 mt-1">
                  Minimum 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={signupConfirmPasswordVisible ? "text" : "password"}
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                    className="w-full px-4 py-2 border border-black/20 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition bg-white text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setSignupConfirmPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 focus:outline-none"
                    aria-label={signupConfirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    <EyeIcon open={signupConfirmPasswordVisible} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={loading || !signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password}
                className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-black/80 transition-colors disabled:bg-black/30 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-black/60">
          By continuing, you agree to our{' '}
          <button className="text-black hover:underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-black hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}