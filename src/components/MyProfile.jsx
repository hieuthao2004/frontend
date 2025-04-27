import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './MyProfile.css'

const MyProfile = ({ userData }) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Add debug logging
  useEffect(() => {
    console.log('MyProfile userData:', userData)
    console.log('MyProfile user:', userData?.user)
  }, [userData])

  useEffect(() => {
    const fetchMyProfile = async () => {
      if (!userData || !userData.user) {
        setError('User data not loaded')
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/api/profile/@${userData.user.username}`,
          { withCredentials: true }
        )
        
        console.log('Profile response:', response.data)

        if (response.data?.userData) {
          setProfile(response.data.userData)
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchMyProfile()
  }, [userData])

  // Show loading and error states
  if (loading) {
    return <div className="loading-state">Loading profile...</div>
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>
  }

  return (
    <div className="my-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={profile?.u_avatar || '/default-avatar.png'} 
            alt="Profile" 
            onError={(e) => e.target.src = '/default-avatar.png'}
          />
        </div>
        <div className="profile-info">
          <h1>{profile?.u_username}</h1>
          <h2>{profile?.u_fullname}</h2>
          <p className="bio">{profile?.u_bio || 'No bio yet'}</p>
          <div className="stats">
            <div className="stat">
              <span className="count">{profile?.posts?.length || 0}</span>
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
        </div>
      </div>
    </div>
  )
}

export default MyProfile