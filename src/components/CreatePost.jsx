import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'

const CreatePost = () => {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const socketRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io('http://localhost:3001')
    
    // Listen for post creation confirmation
    socketRef.current.on('post_created', (post) => {
      console.log('Post created via socket:', post)
      setIsSubmitting(false)
      setContent('')
      setFile(null)
      setPreviewUrl('')
      setMessage('Post created successfully!')
      
      // Auto-clear success message
      setTimeout(() => setMessage(''), 3000)
    })
    
    // Listen for errors
    socketRef.current.on('post_error', (error) => {
      console.error('Error via socket:', error)
      setIsSubmitting(false)
      setMessage(error.message || 'Failed to create post')
    })
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }
  
  // Clear selected image
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
      if (file) {
        // For files, use socket.io with binary support
        // Convert the file to base64 for socket transmission
        const reader = new FileReader()
        
        reader.onload = () => {
          // Get base64 data
          const base64File = reader.result
          
          // Emit the post data with the file
          socketRef.current.emit('create_post', {
            content: content.trim(),
            image: {
              data: base64File,
              name: file.name,
              type: file.type
            }
          })
        }
        
        reader.readAsDataURL(file)
      } else {
        // For text-only posts, emit without an image
        socketRef.current.emit('create_post', {
          content: content.trim()
        })
      }
      
      // Don't reset the form yet, wait for confirmation from server
      console.log('Post data sent via socket')
      
    } catch (error) {
      console.error('Error sending data:', error)
      setMessage('Failed to create post')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-post">
      {message && <p className={message.includes('successfully') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
          disabled={isSubmitting}
        />
        
        <div className="file-upload">
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <label htmlFor="image-upload">
            {file ? 'Change Image' : 'Add Image'}
          </label>
          
          {previewUrl && (
            <div className="image-preview-wrapper">
              <img src={previewUrl} alt="Preview" className="image-preview" />
              <button 
                type="button" 
                className="remove-image" 
                onClick={handleRemoveImage}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost