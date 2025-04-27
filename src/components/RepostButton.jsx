import React, { useState } from 'react'
import axios from 'axios'
// No longer importing component-specific CSS

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
        className={`action-button repost-button ${isReposted ? 'active' : ''} ${loading ? 'button-loading' : ''}`}
      >
        <svg className="button-icon" viewBox="0 0 24 24">
          <path d="M7,7H17V10.1L21,6.1L17,2V5H5V11H7V7M17,17H7V13.9L3,17.9L7,22V19H19V13H17V17Z" />
        </svg>
        <span className="action-button-text">Repost</span>
      </button>

      {showRepostModal && (
        <div className="modal-overlay">
          <div className="create-post-modal">
            <div className="modal-header">
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setShowRepostModal(false)
                  setError(null)
                  setRepostContent('')
                }}
              >
                Cancel
              </button>
              <h3 className="modal-title">Repost</h3>
              <div style={{width: '50px'}}></div> {/* Spacer for alignment */}
            </div>

            <div className="modal-content">
              {error && <div className="error-message">{error}</div>}
              <textarea
                value={repostContent}
                onChange={(e) => setRepostContent(e.target.value)}
                placeholder="Add your thoughts... (optional)"
                maxLength={280}
                className="modal-textarea"
              />
              <div className="modal-tools">
                <div></div> {/* Spacer for alignment */}
                <button 
                  onClick={handleSubmitRepost}
                  className="modal-post-btn"
                  disabled={loading}
                >
                  {loading ? 'Reposting...' : 'Repost'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RepostButton