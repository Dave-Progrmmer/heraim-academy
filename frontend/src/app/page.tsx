'use client'
import { useState } from 'react';

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

// Eye icon SVGs
const EyeIcon = ({ open = false }: { open: boolean }) => open ? (
  // Eye Open
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M1.458 12C2.732 7.943 6.523 5 12 5c5.478 0 9.268 2.943 10.542 7-.325 1.14-1.263 3.103-3.285 5.22-1.906 1.992-4.518 3.78-7.257 3.78s-5.351-1.788-7.257-3.78C2.721 15.104 1.783 13.141 1.458 12z"/>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
) : (
  // Eye Closed
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.478 0-9.268-2.943-10.542-7a13.086 13.086 0 012.799-4.119M21.542 12.001a12.074 12.074 0 00-1.33-2.447M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.1 6.1l11.8 11.8"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/>
  </svg>
);

export default function AuthScreens() {
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
        setSuccess('Login successful! Welcome back.');
        // Store token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Reset
        setLoginData({ email: '', password: '' });
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
        setSuccess('Account created successfully! Welcome aboard.');
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Reset
        setSignupData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'student'
        });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Heraim Academy
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Start your learning journey'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
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
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 focus:outline-none"
                    aria-label={loginPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={loginPasswordVisible} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button className="text-blue-600 hover:text-blue-700 hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading || !loginData.email || !loginData.password}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          ) : (
            /* Signup Form */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData({ ...signupData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>
                <select
                  value={signupData.role}
                  onChange={(e) =>
                    setSignupData({ ...signupData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-black"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={signupPasswordVisible ? "text" : "password"}
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setSignupPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 focus:outline-none"
                    aria-label={signupPasswordVisible ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon open={signupPasswordVisible} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setSignupConfirmPasswordVisible(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 focus:outline-none"
                    aria-label={signupConfirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    <EyeIcon open={signupConfirmPasswordVisible} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSignup}
                disabled={loading || !signupData.firstName || !signupData.lastName || !signupData.email || !signupData.password}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          By continuing, you agree to our{' '}
          <button className="text-blue-600 hover:underline">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-blue-600 hover:underline">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
}