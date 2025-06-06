// src/components/PhotoUploader.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';

const PhotoUploader = ({ userId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        api.get(`/photos/${userId}`)
            .then(response => {
                setImageUrl(`http://127.0.0.1:5000${response.data.image_url}`);
            })
            .catch(error => {
                console.log('No photo found yet.');
            });
    }, [userId, uploadMessage]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('image_file', selectedFile);

        try {
            const response = await api.post('/photos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUploadMessage(response.data.message);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading photo:', error);
            setUploadMessage('Failed to upload photo.');
        }
    };

    return (
        <div>
            {imageUrl && (
                <div className="mb-3 text-center">
                    <img
                        src={imageUrl}
                        alt="Profile"
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '3px solid #00AEEF'
                        }}
                        className="mb-3"
                    />
                </div>
            )}

            {uploadMessage && (
                <div className={`alert ${uploadMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    {uploadMessage}
                </div>
            )}

            <div className="mb-3">
                <label className="form-label">Select New Profile Photo</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
            </div>

            <div className="d-grid">
                <button onClick={handleUpload} className="btn btn-primary btn-lg w-100">
                    Upload Photo
                </button>
            </div>
        </div>
    );
};

export default PhotoUploader;