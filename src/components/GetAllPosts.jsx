import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import RepostButton from './RepostButton'
import SaveButton from './SaveButton'
import CreatePost from './CreatePost'

const GetAllPosts = ({ currentUserId }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3001/api/posts', {
        withCredentials: true
      })
      console.log('Posts data:', response.data)
      setPosts(response.data.allPosts || [])
      setError(null)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts])
  }

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`)
  }

  return (
    <div className="post-feed-container">
      <CreatePost onPostCreated={handlePostCreated} />
      
      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={fetchPosts} 
            className="secondary-button"
            style={{ marginLeft: '10px' }}
          >
            Retry
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="no-posts-message">
          <p>No posts found. Start following people to see their posts!</p>
        </div>
      ) : (
        <div className="post-feed">
          {posts.map((post) => (
            <div 
              key={post.p_id} 
              className="post-item" 
              onClick={() => handlePostClick(post.p_id)}
            >
              <div className="post-header">
                <div 
                  className="post-author-avatar"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/profile/${post.p_creater}`)
                  }}
                >
                  {post.u_profile_pic ? (
                    <img src={post.u_profile_pic} alt={post.p_creater} />
                  ) : (
                    <div className="default-avatar">
                      {post.p_creater.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="post-info">
                  <span 
                    className="post-author-name" 
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/profile/${post.p_creater}`)
                    }}
                  >
                    {post.p_creater}
                  </span>
                  <span className="post-timestamp">
                    {new Date(post.p_create_at).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <button 
                  className="post-more-options"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Future implementation for post options
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                  </svg>
                </button>
              </div>
              
              <p className="post-content">{post.p_content}</p>
              
              {post.p_image_url && post.p_image_url !== "" && (
                <div className="post-image">
                  <img 
                    src={post.p_image_url} 
                    alt="Post content" 
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              
              <div className="post-actions" onClick={(e) => e.stopPropagation()}>
                <LikeButton 
                  postId={post.p_id}
                  initialIsLiked={post.isLiked}
                  currentUserId={currentUserId}
                />
                <RepostButton 
                  postId={post.p_id}
                  initialIsReposted={post.isReposted}
                  currentUserId={currentUserId}
                />
                <SaveButton
                  postId={post.p_id}
                  initialIsSaved={post.isSaved}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GetAllPosts