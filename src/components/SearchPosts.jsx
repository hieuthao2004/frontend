import React, { useState } from 'react'
import axios from 'axios'
// import './SearchPosts.css'

const SearchPosts = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search posts..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      <div className="search-results">
        {searchResults.length === 0 ? (
          searchQuery ? <p className="no-results">No posts found</p> : null
        ) : (
          <div className="posts-grid">
            {searchResults.map((post) => (
              <div key={post.objectID} className="post-card">
                <div className="post-header">
                  <h3 className="post-creator">{post.p_creater}</h3>
                  <small className="post-date">
                    {new Date(post.p_create_at).toLocaleString()}
                  </small>
                </div>
                <p className="post-content">{post.p_content}</p>
                {post.p_image_url && post.p_image_url !== "" && (
                  <img 
                    src={post.p_image_url} 
                    alt="Post content" 
                    className="post-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
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