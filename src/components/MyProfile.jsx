import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './MyProfile.css'
import EditProfile from './EditProfile'
import AvatarUpload from './AvatarUpload'

// Thêm biến cho default avatar
const DEFAULT_AVATAR = '/images/default-avatar.png'

const MyProfile = ({ userData }) => {
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAvatarUpload, setShowAvatarUpload] = useState(false)
  const navigate = useNavigate()

  const fetchProfile = useCallback(async () => {
    try {
      let targetUsername;
      
      if (!userData?.user?.username) {
        throw new Error('User data not loaded')
      }
      targetUsername = userData.user.username

      console.log('Fetching profile for:', targetUsername)

      const profileResponse = await axios.get(`http://localhost:3001/api/profile/@${targetUsername}`, {
        withCredentials: true
      })

      if (!profileResponse.data?.userData) {
        throw new Error('Profile data not found')
      }

      setProfile(profileResponse.data.userData)

      // Fetch user's posts
      const postsResponse = await axios.get('http://localhost:3001/api/profile/posts', {
        withCredentials: true
      })

      if (postsResponse.data?.allUserPosts) {
        setUserPosts(postsResponse.data.allUserPosts)
      }

    } catch (error) {
      console.error('Error in profile:', error)
      setError(error.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [userData])

  useEffect(() => {
    if (userData === undefined) {
      return // Wait for userData to be available
    }
    fetchProfile()
  }, [fetchProfile, userData])

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(prev => ({
      ...prev,
      ...updatedProfile
    }))
  }

  const handleAvatarUpdate = (newAvatarUrl) => {
    setProfile(prev => ({
      ...prev,
      avatar: newAvatarUrl
    }))
  }

  if (loading) return <div className="loading-state">Loading profile...</div>
  if (error) return <div className="error-state">Error: {error}</div>

  return (
    <div className="my-profile-container">
      <div className="profile-header">
        <div 
          className="profile-avatar"
          onClick={() => setShowAvatarUpload(true)}
          title="Click to update avatar"
        >
          {profile?.u_avatar ? (
            <img 
              src={profile.u_avatar}
              alt={`${profile.u_username}'s avatar`}
              onError={(e) => {
                // Chỉ set default một lần để tránh vòng lặp
                e.target.onerror = null
                e.target.src = DEFAULT_AVATAR
              }}
            />
          ) : (
            <img 
              src={DEFAULT_AVATAR}
              alt="Default avatar"
            />
          )}
        </div>
        <div className="profile-info">
          <h1>{profile?.u_username}</h1>
          <h2>{profile?.u_fullname}</h2>
          <p className="bio">{profile?.u_bio || 'No bio yet'}</p>
          <div className="stats">
            <div className="stat">
              <span className="count">{userPosts.length}</span>
              <span className="label">Posts</span>
            </div>
            <div className="stat">
              <span className="count">{profile?.followers?.length || 0}</span>
              <span className="label">Followers</span>
            </div>
            <div className="stat">
              <span className="count">{profile?.following?.length || 0}</span>
              <span className="label">Following</span>
            </div>
          </div>
          <button 
            onClick={() => setShowEditProfile(true)}
            className="edit-profile-button"
          >
            Edit Profile
          </button>
        </div>
      </div>
      
      <div className="user-posts-section">
        <h2>My Posts</h2>
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

      {showEditProfile && (
        <EditProfile
          profile={profile}
          onUpdate={handleProfileUpdate}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {showAvatarUpload && (
        <AvatarUpload
          onUpdate={handleAvatarUpdate}
          onClose={() => setShowAvatarUpload(false)}
        />
      )}
    </div>
  )
}

export default MyProfile