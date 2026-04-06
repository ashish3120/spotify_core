import { useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { MdCloudUpload } from 'react-icons/md';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Please select a music file');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('music', file);
      await API.post('/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Track uploaded successfully!');
      setTitle('');
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Upload Music</h1>
      <p className="page-subtitle">Share your music with the world</p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="auth-field">
          <label htmlFor="track-title">Track Title</label>
          <input
            id="track-title"
            type="text"
            placeholder="Give your track a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div
          className={`upload-dropzone ${dragActive ? 'upload-dropzone--active' : ''} ${file ? 'upload-dropzone--has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <MdCloudUpload size={48} />
          {file ? (
            <p className="upload-filename">{file.name}</p>
          ) : (
            <>
              <p>Drag and drop your audio file here</p>
              <p className="upload-hint">or click to browse</p>
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            hidden
          />
        </div>

        <button type="submit" className="auth-btn upload-btn" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner spinner--small"></div>
              Uploading...
            </>
          ) : (
            'Upload Track'
          )}
        </button>
      </form>
    </div>
  );
}
