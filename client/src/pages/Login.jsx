import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosInstance from '../services/axiosConfig';
import { setUser } from '../store/authSlice';
import { Mail, Lock } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [generalError, setGeneralError] = useState('');

  const onSubmit = async (data) => {
    try {
      setGeneralError('');
      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { accessToken, user } = response.data.data || response.data;
      dispatch(setUser({ accessToken, user }));
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-zinc-900">Welcome Back</h2>
          <p className="mt-2 text-zinc-500">
            Log in to your account to continue
          </p>
        </div>

        {/* Error Message */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {generalError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-zinc-400" size={20} />
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-zinc-900 text-white py-3 rounded font-medium hover:bg-zinc-800 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-zinc-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-zinc-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
