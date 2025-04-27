import React, { useState } from 'react'
import axios from 'axios'
import './LikeButton.css'

const LikeButton = ({ postId, initialIsLiked = false }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [loading, setLoading] = useState(false)

  const handleLikeAction = async () => {
    if (!postId) {
      console.error('Missing post ID:', postId)
      return
    }

    setLoading(true)
    try {
      console.log('Handling like action for post:', postId) // Debug log

      if (isLiked) {
        await axios.delete(`/api/posts/${postId}/disliked`, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
      } else {
        await axios.post(`/api/posts/${postId}/liked`, {}, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
      }

      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Like action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLikeAction}
      disabled={loading}
      className={`like-button ${isLiked ? 'liked' : ''}`}
    >
      <span className="like-icon">
        {isLiked ? '❤️' : '🤍'}
      </span>
    </button>
  )
}

export default LikeButton