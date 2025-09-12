import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or session here
    localStorage.removeItem('authToken'); // Example: remove token, adapt as needed
    
    toast.success('Logged out successfully', { position: 'top-right' });

    // Redirect to login page
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
    >
      Logout
    </button>
  );
}

export default LogoutButton;