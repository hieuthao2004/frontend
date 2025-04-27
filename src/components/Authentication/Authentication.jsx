import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Authentication = ({setAuthenticated}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:3001/api/auth", {username, password}, {
        withCredentials: true
      });
      console.log(response.data);
      if (response.data.message === "Logged in") {
        setAuthenticated(true)
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="form-container">
        <div className="auth-logo">
          <h1>Threads</h1>
        </div>
        
        <div className="form-header">
          <h2 className="form-title">Sign in</h2>
          <p className="form-subtitle">Welcome back! Please enter your details</p>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={fetchLogin}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              id="username"
              className="form-input"
              type="text" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="password-input-container">
              <input 
                id="password"
                className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <button 
            className="form-button" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <div className="form-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}

export default Authentication