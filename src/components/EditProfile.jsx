import React, { useState } from 'react'
import axios from 'axios'
import './EditProfile.css'

const EditProfile = ({ profile, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    fullname: profile?.u_fullname || '',
    bio: profile?.u_bio || '',
    email: profile?.u_email || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.put(
        `http://localhost:3001/api/profile/@${profile.u_username}`,
        formData,
        { withCredentials: true }
      )

      if (response.data.userData) {
        onUpdate(response.data.userData)
        onClose()
      } else {
        throw new Error('No user data returned')
      }
    } catch (error) {
      console.error('Update failed:', error)
      setError(error.response?.data?.msg || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-profile-modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={formData.fullname}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                fullname: e.target.value
              }))}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                bio: e.target.value
              }))}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="Enter your email"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="submit-button"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile