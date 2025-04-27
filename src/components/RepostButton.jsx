import React, { useState } from 'react'
import axios from 'axios'
import './RepostButton.css'

const RepostButton = ({ postId, initialIsReposted = false, currentUserId }) => {
  const [isReposted, setIsReposted] = useState(initialIsReposted)
  const [loading, setLoading] = useState(false)
  const [repostContent, setRepostContent] = useState('')
  const [showRepostModal, setShowRepostModal] = useState(false)
  const [error, setError] = useState(null)

  const handleRepostAction = async () => {
    if (!postId || !currentUserId) {
      console.error('Missing IDs:', { postId, currentUserId })
      return
    }

    if (isReposted) {
      try {
        setLoading(true)
        await axios.delete(`/api/posts/${postId}/unreposted`, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
        setIsReposted(false)
      } catch (error) {
        console.error('Unrepost failed:', error)
        setError('Failed to remove repost')
      } finally {
        setLoading(false)
      }
    } else {
      setShowRepostModal(true)
    }
  }

  const handleSubmitRepost = async () => {
    if (!postId || !currentUserId) {
      setError('Missing required information')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Match the server's expected data structure
      const data = {
        repostContent: repostContent,
        post_id: postId,
        user_id: currentUserId
      }

      const response = await axios.post(
        `/api/posts/${postId}/reposted`,
        data,
        {
          withCredentials: true,
          baseURL: 'http://localhost:3001',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Repost response:', response.data) // Debug log

      if (response.data) {
        setIsReposted(true)
        setShowRepostModal(false)
        setRepostContent('')
      }
    } catch (error) {
      console.error('Repost submission failed:', error)
      setError(error.response?.data?.message || 'Failed to repost')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleRepostAction}
        disabled={loading}
        className={`repost-button ${isReposted ? 'reposted' : ''}`}
      >
        <span className="repost-icon">
          {isReposted ? '🔁' : '↻'}
        </span>
      </button>

      {showRepostModal && (
        <div className="repost-modal">
          <div className="repost-modal-content">
            <h3>Add a comment to your repost</h3>
            {error && <div className="repost-error">{error}</div>}
            <textarea
              value={repostContent}
              onChange={(e) => setRepostContent(e.target.value)}
              placeholder="Add your thoughts... (optional)"
              maxLength={280}
            />
            <div className="repost-modal-actions">
              <button 
                onClick={() => {
                  setShowRepostModal(false)
                  setError(null)
                  setRepostContent('')
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitRepost}
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Reposting...' : 'Repost'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RepostButton