import React, { useState } from 'react'
import axios from 'axios'
import './SaveButton.css'

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
      className={`save-button ${isSaved ? 'saved' : ''}`}
      title={isSaved ? 'Remove from saved' : 'Save post'}
    >
      <span className="save-icon">
        {isSaved ? '📥' : '🔖'}
      </span>
      {error && <div className="save-error">{error}</div>}
    </button>
  )
}

export default SaveButton