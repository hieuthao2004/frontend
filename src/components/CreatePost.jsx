import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const socketRef = useRef()
  const fileInputRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:3001')
    
    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [])

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB')
        return
      }
      
      setFile(selectedFile)
      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // Remove selected image
  const handleRemoveImage = () => {
    setFile(null)
    setPreviewUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append('content', content.trim())
      
      if (file) {
        formData.append('image', file)
      }
      
      console.log('Sending post data with' + (file ? '' : 'out') + ' image')
      
      const response = await axios.post(
        'http://localhost:3001/api/create_post', 
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      console.log('Server response:', response.data)
      
      if (response.status === 200) {
        // Emit event with new post data
        socketRef.current.emit('new_post', response.data.post)
        
        // Reset form and close modal
        setContent('')
        setFile(null)
        setPreviewUrl('')
        setSuccess('Post created successfully!')
        
        // Call the callback to refresh posts
        if (onPostCreated) {
          onPostCreated(response.data.post)
        }
        
        // Close modal if open
        if (showModal) {
          setTimeout(() => {
            setShowModal(false)
            setSuccess('')
          }, 1500)
        } else {
          // Auto-clear success message
          setTimeout(() => setSuccess(''), 3000)
        }
      }
    } catch (error) {
      console.error('Error details:', error.response?.data)
      setError(error.response?.data?.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  // For the compact post creation UI in the feed
  const openCreatePostModal = () => {
    setShowModal(true)
  }

  return (
    <>
      {/* Compact UI for the main feed */}
      <div className="create-post">
        <div className="create-post-avatar-placeholder">
          {/* Show first letter of username when available */}
          ?
        </div>
        <div 
          className="create-post-input"
          onClick={openCreatePostModal}
        >
          <span className="create-post-placeholder">What's on your mind?</span>
        </div>
      </div>

      {/* Modal for expanded post creation UI */}
      {showModal && (
        <div className="modal-overlay">
          <div className="create-post-modal">
            <div className="modal-header">
              <button 
                className="modal-close-btn" 
                onClick={() => {
                  setShowModal(false)
                  setContent('')
                  setFile(null)
                  setPreviewUrl('')
                  setError('')
                  setSuccess('')
                }}
              >
                Cancel
              </button>
              <h3 className="modal-title">Create post</h3>
              <div style={{width: '50px'}}></div> {/* Spacer for alignment */}
            </div>

            <div className="modal-content">
              <div className="modal-user-info">
                <div className="modal-user-avatar">
                  {/* First letter of username when available */}
                  ?
                </div>
                <div>
                  <div className="modal-username">Username</div>
                  <div className="modal-user-context">Posting publicly</div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="modal-textarea"
                maxLength={500}
              />

              {previewUrl && (
                <div className="modal-image-preview">
                  <img src={previewUrl} alt="Preview" />
                  <button 
                    className="modal-remove-image"
                    onClick={handleRemoveImage}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="modal-tools">
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                  />
                  <button 
                    type="button" 
                    className="modal-tool-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSubmitting}
                  >
                    <svg className="tool-icon" viewBox="0 0 24 24">
                      <path d="M4,5H7L9,3H15L17,5H20A2,2 0 0,1 22,7V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V7A2,2 0 0,1 4,5M13.09,9.45V10.8H16.09V12.8H13.09V15.8H11.09V12.8H8.09V10.8H11.09V9.45H8.09L12,5.5L15.91,9.45H13.09Z" />
                    </svg>
                  </button>
                </div>
                <button 
                  onClick={handleSubmit}
                  className="modal-post-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CreatePost