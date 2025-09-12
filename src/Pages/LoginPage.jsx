import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /*if (!email || !password) {
      toast.error('Please enter both email and password', { position: 'top-right' });
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Invalid email format', { position: 'top-right' });
      return;
    }

    // Replace this with real authentication logic
    const isValidUser = email === 'test@example.com' && password === 'password123';

    if (!isValidUser) {
      toast.error('Invalid email or password', { position: 'top-right' });
      return;
    }
*/
    toast.success('Login successful!', { position: 'top-right' });

    // Redirect after short delay to let user see success toast
    setTimeout(() => {
      navigate('/care-homes');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-600">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <label className="block mb-4">
          <span className="block font-medium mb-1">Email address</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter email"
            autoComplete="email"
          />
        </label>
        <label className="block mb-6">
          <span className="block font-medium mb-1">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;