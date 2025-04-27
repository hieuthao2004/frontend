import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [userRegister, setUserRegister] = useState({username: "", email: "", password: "", cfPassword: ""});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUserRegister((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        
        if (userRegister.password !== userRegister.cfPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        
        try {
            const response = await axios.post("/register", { 
                username: userRegister.username, 
                email: userRegister.email,
                password: userRegister.password 
            });
            
            if (response.status === 200) {
                setSuccess("Account created successfully!");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };
  
    return (
        <div className="auth-container">
            <div className="form-container">
                <div className="auth-logo">
                    <h1>Threads</h1>
                </div>
                
                <div className="form-header">
                    <h2 className="form-title">Create your account</h2>
                    <p className="form-subtitle">Join our community today</p>
                </div>
                
                {error && <div className="form-error">{error}</div>}
                {success && <div className="form-success">{success}</div>}
                
                <form onSubmit={fetchRegister}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input 
                            id="username"
                            className="form-input"
                            type="text" 
                            name="username"
                            placeholder="Choose a username"
                            value={userRegister.username}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input 
                            id="email"
                            className="form-input"
                            type="email" 
                            name="email"
                            placeholder="Enter your email"
                            value={userRegister.email}
                            onChange={handleInput}
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
                                name="password"
                                placeholder="Create a password"
                                value={userRegister.password}
                                onChange={handleInput}
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
                    
                    <div className="form-group">
                        <label htmlFor="cfPassword" className="form-label">Confirm Password</label>
                        <input 
                            id="cfPassword"
                            className="form-input"
                            type="password"
                            name="cfPassword"
                            placeholder="Confirm your password"
                            value={userRegister.cfPassword}
                            onChange={handleInput}
                            required
                        />
                    </div>
                    
                    <button 
                        className="form-button" 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>
                
                <div className="form-footer">
                    Already have an account? <Link to="/">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Register