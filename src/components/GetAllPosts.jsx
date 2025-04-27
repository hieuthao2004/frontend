import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import RepostButton from './RepostButton'
import SaveButton from './SaveButton'
// Import styles from our shared styles folder instead of component-specific CSS
// import './GetAllPosts.css'

const GetAllPosts = ({ currentUserId }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/posts', {
          withCredentials: true
        })
        console.log('Posts data:', response.data) // Debug log
        setPosts(response.data.allPosts || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <div className="loading-indicator">Loading posts...</div>

  if (posts.length === 0) {
    return <div className="no-posts-message">No posts found. Start following people to see their posts!</div>
  }

  return (
    <div className="post-feed-container">
      <div className="post-feed">
        {posts.map((post) => (
          <div key={post.p_id} className="post-item">
            <div className="post-header">
              <div className="post-author-avatar">
                <div className="default-avatar">
                  {post.p_creater.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="post-info">
                <span 
                  className="post-author-name" 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${post.p_creater}`);
                  }}
                >
                  {post.p_creater}
                </span>
                <span className="post-timestamp">{new Date(post.p_create_at).toLocaleString()}</span>
              </div>
            </div>
            <p className="post-content">{post.p_content}</p>
            <div className="post-actions">
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
    </div>
  )
}

export default GetAllPosts