import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';
import GetAllPosts from './GetAllPosts';
import SearchPosts from './SearchPosts';
import SearchUsers from './SearchUsers';
import './Homepage.css';

function Homepage({ userData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData) {
      setError('User data not loaded');
      setLoading(false);
      return;
    }
    
    if (!userData.user?.username) {
      setError('Invalid user data');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [userData]);

  const goToMyProfile = () => {
    navigate('/my-profile');
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Homepage</h1>
        <button 
          onClick={goToMyProfile}
          className="profile-button"
        >
          View Profile
        </button>
      </div>
      
      <p className="welcome-text">
        Hi {userData.user.username}
      </p>
      
      <div className="search-section">
        <div className="search-tabs">
          <h2>Search</h2>
          <div className="search-components">
            <SearchUsers currentUserId={userData.user.id} />
            <SearchPosts currentUserId={userData.user.id} />
          </div>
        </div>
      </div>

      <CreatePost currentUserId={userData.user.id} />
      <GetAllPosts currentUserId={userData.user.id} />
    </div>
  );
}

export default Homepage;