import React, { useState } from 'react'
import axios from 'axios'

const SaveButton = ({ postId, initialIsSaved = false }) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSaveAction = async () => {
    if (!postId) {
      console.error('Missing post ID:', postId)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isSaved) {
        const response = await axios.delete(`/api/profile/posts/${postId}/unsaved`, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
        
        if (response.data.unsaved) {
          setIsSaved(false)
        } else {
          throw new Error(response.data.msg || 'Failed to unsave post')
        }
      } else {
        const response = await axios.post(`/api/profile/posts/${postId}/saved`, {}, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })

        if (response.data.saved) {
          setIsSaved(true)
        } else {
          throw new Error(response.data.msg || 'Failed to save post')
        }
      }
    } catch (error) {
      console.error('Save/Unsave action failed:', error)
      setError(error.response?.data?.msg || 'Failed to update save status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSaveAction}
      disabled={loading}
      className={`action-button save-button ${isSaved ? 'active' : ''} ${loading ? 'button-loading' : ''}`}
      title={isSaved ? 'Remove from saved' : 'Save post'}
    >
      <svg className="button-icon" viewBox="0 0 24 24">
        {isSaved ? (
          <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3Z" />
        ) : (
          <path d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5A2,2 0 0,0 17,3M17,18L12,15.82L7,18V5H17V18Z" />
        )}
      </svg>
      <span className="action-button-text">Save</span>
      {error && <div className="error-message">{error}</div>}
    </button>
  )
}

export default SaveButton