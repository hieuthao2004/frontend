import React, { useState } from 'react'
import axios from 'axios'
// import './AvatarUpload.css'

const AvatarUpload = ({ onUpdate, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('avatar', selectedFile)

    try {
      const response = await axios.put(
        'http://localhost:3001/api/profile/avatar',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.avatarUrl) {
        onUpdate(response.data.avatarUrl)
        onClose()
      }
    } catch (error) {
      setError(error.response?.data?.msg || 'Failed to upload avatar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="avatar-upload-modal">
      <div className="modal-content">
        <h2>Update Avatar</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="preview-container">
            {preview && (
              <img 
                src={preview} 
                alt="Preview" 
                className="avatar-preview"
              />
            )}
          </div>

          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>

          <div className="button-group">
            <button 
              type="button" 
              onClick={onClose}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={!selectedFile || loading}
              className="submit-button"
            >
              {loading ? 'Uploading...' : 'Upload Avatar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AvatarUpload