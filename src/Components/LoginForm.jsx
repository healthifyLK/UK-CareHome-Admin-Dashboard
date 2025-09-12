import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password', { position: 'top-right' });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Invalid email format', { position: 'top-right' });
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!', { position: 'top-right' });
      
      // Redirect after short delay to let user see success toast
      setTimeout(() => {
        navigate('/care-homes');
      }, 1000);
    } catch (err) {
      const errorMessage = err.message || 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage, { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-700">
      <div className='flex flex-col items-center justify-center bg-white rounded-lg p-10 gap-5'>
        <ToastContainer />
        <form
          onSubmit={handleSubmit}
          className="rounded w-xs"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <label className="block mb-4">
            <span className="block font-medium mb-1">Email address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Enter email"
              autoComplete="email"
            />
          </label>
          <label className="block mb-6">
            <span className="block font-medium mb-1">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Enter password"
              autoComplete="current-password"
            />
            <p onClick={() => navigate("/authentication")} className='text-right text-blue-600 my-3 font-normal cursor-pointer select-none'>forget password?</p>
          </label>
            
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;