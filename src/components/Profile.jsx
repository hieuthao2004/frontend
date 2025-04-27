import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
import LikeButton from './LikeButton'
import RepostButton from './RepostButton'
import SaveButton from './SaveButton'
import './Profile.css'

const Profile = ({ userData, isOwnProfile }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [stats, setStats] = useState({ posts: 0, followers: 0, following: 0 });
  const navigate = useNavigate();
  console.log(userData);
  

  const fetchProfile = useCallback(async () => {
    try {
      let targetUsername;
      
      if (isOwnProfile) {
        if (!userData?.user?.username) {
          throw new Error('User data not loaded');
        }
        targetUsername = userData.user.username;
      } else {
        if (!username) {
          throw new Error('Username parameter missing');
        }
        targetUsername = username;
      }

      console.log('Fetching profile for:', targetUsername);

      const profileResponse = await axios.get(`http://localhost:3001/api/profile/@${targetUsername}`, {
        withCredentials: true
      });

      if (!profileResponse.data?.userData) {
        throw new Error('Profile data not found');
      }

      const profileData = profileResponse.data.userData;
      
      setProfile({
        username: targetUsername,
        id: profileData.u_id || profileData.id,
        avatar: profileData.u_avatar,
        bio: profileData.u_bio || 'No bio yet',
        fullname: profileData.u_fullname || 'No name set',
        email: profileData.u_email,
        createAt: profileData.u_createAt ? new Date(profileData.u_createAt.seconds * 1000) : null,
      });

      // Get stats for the profile
      try {
        const statsResponse = await axios.get(
          `http://localhost:3001/api/profile/@${targetUsername}/stats`,
          { withCredentials: true }
        );
        
        if (statsResponse.data) {
          setStats({
            posts: statsResponse.data.postsCount || 0,
            followers: statsResponse.data.followersCount || 0,
            following: statsResponse.data.followingCount || 0
          });
        }
      } catch (statsError) {
        console.error('Failed to fetch stats:', statsError);
      }
    } catch (error) {
      console.error('Error in profile:', error);
      setError(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [username, userData, isOwnProfile]);

  const fetchUserPosts = useCallback(async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/profile/@${username}/posts`,
        { withCredentials: true }
      );
      
      if (response.data.posts) {
        setUserPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      setError('Failed to load user posts');
    }
  }, []);

  useEffect(() => {
    if (userData === undefined) {
      return; // Wait for userData to be available
    }
    fetchProfile();
  }, [fetchProfile, userData]);

  useEffect(() => {
    if (profile?.username) {
      fetchUserPosts(profile.username);
    }
  }, [profile, fetchUserPosts]);

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="primary-button"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!profile) return <div className="profile-not-found">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-banner"></div>
        
        <div className="profile-overview">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img 
                src={profile.avatar}
                alt={`${profile.username}'s avatar`} 
                className="avatar-image"
              />
            ) : (
              <div className="default-avatar large">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-actions">
            {isOwnProfile ? (
              <button 
                onClick={handleEditProfile}
                className="edit-profile-button"
              >
                Edit profile
              </button>
            ) : (
              <FollowButton 
                targetUserId={profile.id} 
                currentUserId={userData?.user?.id} 
              />
            )}
          </div>
        </div>
        
        <div className="profile-details">
          <h1 className="profile-username">{profile.username}</h1>
          {profile.fullname && <h2 className="profile-fullname">{profile.fullname}</h2>}
          <p className="profile-bio">{profile.bio}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.posts}</span>
              <span className="stat-label">posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.followers}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.following}</span>
              <span className="stat-label">following</span>
            </div>
          </div>
          
          {profile.createAt && (
            <p className="profile-joined">
              <svg className="joined-icon" viewBox="0 0 24 24">
                <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1" />
              </svg>
              Joined {profile.createAt.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`profile-tab ${activeTab === 'reposts' ? 'active' : ''}`}
            onClick={() => setActiveTab('reposts')}
          >
            Reposts
          </button>
          <button 
            className={`profile-tab ${activeTab === 'likes' ? 'active' : ''}`}
            onClick={() => setActiveTab('likes')}
          >
            Likes
          </button>
        </div>
        
        <div className="profile-tab-content">
          {userPosts.length === 0 ? (
            <div className="no-posts-container">
              <div className="no-posts-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H5M13,17H8V15H13V17M16,13H8V11H16V13M16,9H8V7H16V9Z" />
                </svg>
              </div>
              <h3>No posts yet</h3>
              {isOwnProfile && (
                <p>When you create posts, they will appear here.</p>
              )}
            </div>
          ) : (
            <div className="post-feed">
              {userPosts.map(post => (
                <div
                  key={post.p_id}
                  className="post-item"
                  onClick={() => handlePostClick(post.p_id)}
                >
                  <div className="post-header">
                    <div className="post-author-avatar">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.username} />
                      ) : (
                        <div className="default-avatar">
                          {profile.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="post-info">
                      <span className="post-author-name">
                        {profile.username}
                      </span>
                      <span className="post-timestamp">
                        {new Date(post.p_create_at).toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <p className="post-content">{post.p_content}</p>
                  
                  {post.p_image_url && post.p_image_url !== "" && (
                    <div className="post-image">
                      <img 
                        src={post.p_image_url} 
                        alt="Post content" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="post-actions" onClick={(e) => e.stopPropagation()}>
                    <LikeButton 
                      postId={post.p_id}
                      initialIsLiked={post.isLiked}
                      currentUserId={userData?.user?.id}
                    />
                    <RepostButton 
                      postId={post.p_id}
                      initialIsReposted={post.isReposted}
                      currentUserId={userData?.user?.id}
                    />
                    <SaveButton
                      postId={post.p_id}
                      initialIsSaved={post.isSaved}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;