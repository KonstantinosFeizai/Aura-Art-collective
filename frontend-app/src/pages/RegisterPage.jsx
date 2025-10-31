// frontend-app/src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages
    setLoading(true);

    try {
      await AuthService.register(username, email, password);
      setMessage("Registration successful! Redirecting to login...");
      
      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      // Display the error message returned from the service/backend
      setMessage(error); 
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white shadow-2xl rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create Account</h1>
      
      <form onSubmit={handleRegister}>
        {/* Username Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        {/* Email Input */}
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
            {loading ? "Creating..." : "Register"}
          </button>
        </div>
        
        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-3 text-center rounded ${message.includes("successful") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

      </form>
    </div>
  );
};

export default RegisterPage;