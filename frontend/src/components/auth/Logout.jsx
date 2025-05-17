import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, LogOut } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performLogout = async () => {
      try {
        const res = await axios.post(
          'https://grokart-2.onrender.com/api/v1/admin/logout',
          {},
          { withCredentials: true }
        );
        setMessage(res.data.message);
        setStatus('success');

        // Wait for a bit before redirecting
        setTimeout(() => {
          navigate('/login'); // or your login path
        }, 2000);
      } catch (error) {
        setMessage('Failed to logout. Please try again.');
        setStatus('error');
      }
    };

    performLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center space-y-6 transition-all duration-300">
        <div className="flex justify-center">
          {status === 'loading' ? (
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          ) : (
            <LogOut className={`w-10 h-10 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
          )}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800">
          {status === 'loading' && 'Logging you out...'}
          {status === 'success' && 'Logged out successfully'}
          {status === 'error' && 'Logout failed'}
        </h2>

        <p className="text-gray-600">{message}</p>

        {status === 'success' && (
          <p className="text-sm text-gray-400">Redirecting to login page...</p>
        )}
      </div>
    </div>
  );
};

export default Logout;
