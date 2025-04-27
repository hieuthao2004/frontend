import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = ({ userData, isOwnProfile }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
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

  if (loading) return <div className="profile-loading">Loading profile...</div>;
  if (error) return <div className="profile-error">Error: {error}</div>;
  if (!profile) return <div className="profile-not-found">Profile not found</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar && (
            <img 
              src={profile.avatar}
              alt={`${profile.username}'s avatar`} 
              className="avatar-image"
            />
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          {profile.fullname && <h2>{profile.fullname}</h2>}
          <p className="profile-bio">{profile.bio}</p>
          <p className="profile-email">{profile.email}</p>
          {profile.createAt && (
            <p className="profile-joined">
              Joined: {profile.createAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      
      <div className="user-posts-section">
        <h2>Posts</h2>
        <div className="posts-grid">
          {userPosts.length === 0 ? (
            <p className="no-posts">No posts yet</p>
          ) : (
            userPosts.map(post => (
              <div key={post.p_id} className="post-card">
                <div className="post-header">
                  <small>{new Date(post.p_create_at).toLocaleString()}</small>
                </div>
                <p className="post-content">{post.p_content}</p>
                {post.p_image_url && (
                  <img 
                    src={post.p_image_url} 
                    alt="Post content" 
                    className="post-image"
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;