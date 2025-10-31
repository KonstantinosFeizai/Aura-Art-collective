// frontend-app/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Use the login function provided by AuthContext
      await login(email, password); 
      
      // Navigate to the homepage on success (no more window.location.reload())
      navigate("/"); 

    } catch (error) {
      setLoading(false);
      // The service throws the message, which we catch here.
      setMessage(error); 
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign In</h1>
      
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        {/* ... (email input) ... */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        {/* ... (password input) ... */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 text-center rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;