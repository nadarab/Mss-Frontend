// Example: Image Upload with Firebase Storage
// This shows how to upload images with progress tracking

import React, { useState } from 'react';
import { uploadFileWithProgress, uploadPortfolioImage } from '../index';

function ImageUploadExample() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');
    setUploadedUrl('');
    setUploadProgress(0);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');

    try {
      // Upload with progress tracking
      const url = await uploadFileWithProgress(
        selectedFile,
        `portfolio/${Date.now()}_${selectedFile.name}`,
        (progress) => {
          setUploadProgress(Math.round(progress));
        }
      );

      setUploadedUrl(url);
      console.log('Upload successful:', url);
      
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setUploadProgress(0);
      }, 2000);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setUploadedUrl('');
    setError('');
  };

  return (
    <div className="image-upload-container">
      <h2>Upload Portfolio Image</h2>

      <div className="upload-area">
        {!preview ? (
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="upload-placeholder">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>Click to select image</p>
              <p className="hint">Max size: 5MB</p>
            </div>
          </label>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            {!isUploading && !uploadedUrl && (
              <button onClick={handleReset} className="remove-btn">
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {selectedFile && !uploadedUrl && (
        <div className="file-info">
          <p><strong>File:</strong> {selectedFile.name}</p>
          <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
        </div>
      )}

      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="progress-text">{uploadProgress}% uploaded</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {uploadedUrl && (
        <div className="success-message">
          <p>✓ Upload successful!</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </div>
      )}

      <div className="actions">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || uploadedUrl}
          className="upload-btn"
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}

export default ImageUploadExample;

