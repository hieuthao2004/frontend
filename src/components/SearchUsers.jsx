import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
import './SearchUsers.css'

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
    <div className="search-users-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="search-error">{error}</div>}

      <div className="search-results">
        {searchResults.length === 0 ? (
          searchQuery ? <p className="no-results">No users found</p> : null
        ) : (
          <div className="users-grid">
            {searchResults.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-info">
                    <h3 onClick={() => navigate(`/profile/${user.username}`)}>
                      {user.username}
                    </h3>
                  </div>
                  {user.id !== currentUserId && (
                    <FollowButton 
                      targetUserId={user.id}
                      currentUserId={currentUserId}
                      initialIsFollowing={user.isFollowing}
                    />
                  )}
                </div>
                <p className="fullname">{user.fullname || 'No name set'}</p>
                <p className="bio">{user.bio || 'No bio yet'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchUsers