import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SearchPosts = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`/api/search_posts?q=${encodeURIComponent(searchQuery)}`, {
        withCredentials: true
      })
      console.log('Search results:', response.data)
      setSearchResults(response.data || [])
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search posts')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <div className="search-input-container">
          <svg className="search-icon" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="search-input"
          />
          {searchQuery && (
            <button 
              type="button" 
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
        <button 
          type="submit" 
          style={{ display: 'none' }} 
          disabled={loading}
        >
          Search
        </button>
      </form>

      {loading && <div className="search-loading">Searching...</div>}
      {error && <div className="search-error">{error}</div>}

      <div className="search-results">
        {searchResults.length === 0 ? (
          searchQuery && !loading ? 
            <div className="search-empty-state">No posts found</div> : null
        ) : (
          <div className="post-feed">
            {searchResults.map((post) => (
              <div key={post.objectID || post.p_id} className="post-item">
                <div className="post-header">
                  <div className="post-author-avatar">
                    <div className="default-avatar">
                      {post.p_creater ? post.p_creater.charAt(0).toUpperCase() : '?'}
                    </div>
                  </div>
                  <div className="post-info">
                    <h3 className="post-author-name">{post.p_creater}</h3>
                    <small className="post-timestamp">
                      {new Date(post.p_create_at).toLocaleString()}
                    </small>
                  </div>
                </div>
                <p className="post-content">{post.p_content}</p>
                {post.p_image_url && post.p_image_url !== "" && (
                  <div className="post-image">
                    <img 
                      src={post.p_image_url} 
                      alt="Post content" 
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPosts