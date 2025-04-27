import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
// No longer importing component-specific CSS

const SearchUsers = ({ currentUserId }) => {
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
      const response = await axios.get(`http://localhost:3001/api/searchs_users?q=${encodeURIComponent(searchQuery)}`, {
        withCredentials: true
      })
      console.log('Search results:', response.data)
      
      if (Array.isArray(response.data)) {
        setSearchResults(response.data)
      } else if (response.data && Array.isArray(response.data.users)) {
        setSearchResults(response.data.users)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search users')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const goToUserProfile = (username) => {
    navigate(`/profile/${username}`)
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
            placeholder="Search users..."
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
            <div className="search-empty-state">No users found</div> : null
        ) : (
          <>
            {searchResults.map((user) => (
              <div 
                key={user.id} 
                className="search-result-item" 
                onClick={() => navigate(`/profile/${user.username}`)}
              >
                <div className="search-result-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="search-result-info">
                  <div className="search-result-name">
                    {user.fullname || user.username}
                  </div>
                  <div className="search-result-username">
                    @{user.username}
                  </div>
                  {user.bio && (
                    <div className="search-result-bio">
                      {user.bio}
                    </div>
                  )}
                </div>
                {user.id !== currentUserId && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <FollowButton 
                      targetUserId={user.id}
                      currentUserId={currentUserId}
                      initialIsFollowing={user.isFollowing}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchUsers