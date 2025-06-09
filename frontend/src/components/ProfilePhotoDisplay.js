// src/components/ProfilePhotoDisplay.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';

const ProfilePhotoDisplay = ({ userId }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        api.get(`/photos/${userId}`)
            .then(response => {
                console.log('Photo API response:', response.data);  // Debug line
                setImageUrl(`http://127.0.0.1:5000${response.data.image_url}`);
            })
            .catch(error => {
                console.log('No photo found yet.');
            });
    }, [userId]);

    return (
        <div className="text-center mb-4">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '4px solid #ddd',
                        marginBottom: '10px'
                    }}
                />
            ) : (
                <div
                    className="rounded-circle bg-secondary"
                    style={{
                        width: '150px',
                        height: '150px',
                        lineHeight: '150px',
                        color: '#fff',
                        fontSize: '24px',
                        textAlign: 'center',
                        margin: '0 auto',
                        marginBottom: '10px'
                    }}
                >
                    No Photo
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoDisplay;