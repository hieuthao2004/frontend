import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const socketRef = useRef()

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setMessage('Content cannot be empty')
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append('content', content.trim())
      
      if (file) {
        formData.append('image', file)
      }
      
      console.log('Sending post data with' + (file ? '' : 'out') + ' image')
      
      // Send the FormData instead of JSON object
      const response = await axios.post(
        'http://localhost:3001/api/create_post', 
        formData,  // Use formData instead of { content: content.trim() }
        {
          withCredentials: true,
          // Don't set Content-Type, axios will set it automatically with boundary for FormData
          headers: {}
        }
      )

      console.log('Server response:', response.data)
      
      if (response.status === 200) {
        // Emit event with new post data
        socketRef.current.emit('new_post', response.data.post)
        
        // Reset form
        setContent('')
        setFile(null)
        setPreviewUrl('')
        setMessage('Post created successfully!')
        
        // Auto-clear success message
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error details:', error.response?.data)
      setMessage(error.response?.data?.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-post">
      {message && (
        <p className={message.includes('successfully') ? 'success' : 'error'}>
          {message}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
        />
        
        <div className="image-upload">
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {file ? 'Change Image' : 'Add Image'}
          </label>
          
          {previewUrl && (
            <div className="image-preview-container">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview" 
              />
              <button 
                type="button" 
                onClick={handleRemoveImage}
                className="remove-image"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost