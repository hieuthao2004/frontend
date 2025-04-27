import React, { useState } from 'react'
import axios from 'axios'

const FollowButton = ({ targetUserId, currentUserId, initialIsFollowing = false }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollowAction = async () => {
    if (!targetUserId || !currentUserId) {
      console.error('Missing user IDs:', { targetUserId, currentUserId })
      return
    }

    setLoading(true)
    try {
      if (isFollowing) {
        await axios.delete(`/api/follows/${targetUserId}/unfollowed`, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
      } else {
        await axios.post(`/api/follows/${targetUserId}/followed`, {}, {
          withCredentials: true,
          baseURL: 'http://localhost:3001'
        })
      }

      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Follow action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!targetUserId || targetUserId === currentUserId) return null

  return (
    <button
      onClick={handleFollowAction}
      disabled={loading}
      className={`follow-button ${isFollowing ? 'following' : ''} ${loading ? 'button-loading' : ''}`}
    >
      {loading ? 'Processing...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

export default FollowButton