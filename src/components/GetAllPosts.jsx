import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LikeButton from './LikeButton'
import RepostButton from './RepostButton'
import SaveButton from './SaveButton'
import './GetAllPosts.css'

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

  if (loading) return <div>Loading posts...</div>

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.p_id} className="post-card">
          <div className="post-header">
            <div className="post-creator-info">
              <h3 onClick={() => navigate(`/profile/${post.p_creater}`)}>
                {post.p_creater}
              </h3>
            </div>
            <small>{new Date(post.p_create_at).toLocaleString()}</small>
          </div>
          <p className="post-content">{post.p_content}</p>
          <div className="post-actions">
            <LikeButton 
              postId={post.p_id}  // Use p_id from post data
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
  )
}

export default GetAllPosts