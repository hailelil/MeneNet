// src/pages/UserProfilePage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../services/api';
import FamilyTree from '../components/FamilyTree';
import AddressList from '../components/AddressList';
import AddAddressForm from '../components/AddAddressForm';
import PhotoUploader from '../components/PhotoUploader';
import ProfilePhotoDisplay from '../components/ProfilePhotoDisplay';

const UserProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showPhotoUploader, setShowPhotoUploader] = useState(false);
    const [showAddresses, setShowAddresses] = useState(true);
    const [showFamily, setShowFamily] = useState(true);

    useEffect(() => {
        api.get(`/users/${id}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                setError('User not found.');
            });
    }, [id]);

    const handleGenerateCard = async () => {
        try {
            const response = await fetch('http://localhost:6000/generate_card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: user.id })
            });

            const data = await response.json();

            if (data.card_url) {
                // Open PDF in new tab
                window.open(`http://localhost:6000${data.card_url}`, '_blank');
            } else {
                console.error('Failed to generate card:', data.error);
            }
        } catch (error) {
            console.error('Error generating card:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold">User Profile</h2>
            <div className="mb-3">
                <Link to="/users" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left"></i> Back to Users
                </Link>
            </div>

            {error ? (
                <p className="alert alert-danger text-center">{error}</p>
            ) : !user ? (
                <p className="text-center">Loading user profile...</p>
            ) : (
                <div className="row">
                    {/* Left column → Main display */}
                    <div className="col-md-8">

                        {/* Profile Photo + Name on top */}
                        {/* Profile Photo + Name side by side */}
                        <div className="card mb-4 p-4">
                            <div className="d-flex align-items-center justify-content-center flex-wrap">
                                <div className="me-4 mb-3 mb-md-0">
                                    <ProfilePhotoDisplay userId={user.id} />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">{user.first_name} {user.last_name}</h3>
                                    <p className="text-muted mb-1">{user.national_id}</p>
                                    <p className="text-muted mb-0">  
                                        {new Date(user.date_of_birth).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="card mb-4">
                            <div className="card-header fw-bold">User Information</div>
                            <div className="card-body">
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>First Name:</strong> {user.first_name}</p>
                                <p><strong>Last Name:</strong> {user.last_name}</p>
                                <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
                                <p><strong>Gender:</strong> {user.gender}</p>
                                <p><strong>National ID:</strong> {user.national_id}</p>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="card mb-4">
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowAddresses(!showAddresses)}
                            >
                                <h5 className="mb-0">Addresses</h5>
                                <i className={`bi ${showAddresses ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            {showAddresses && (
                                <div className="card-body">
                                    <AddressList userId={user.id} />
                                </div>
                            )}
                        </div>

                        {/* Family Tree */}
                        <div className="card mb-4">
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowFamily(!showFamily)}
                            >
                                <h5 className="mb-0">Family Relationships</h5>
                                <i className={`bi ${showFamily ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            {showFamily && (
                                <div className="card-body">
                                    <FamilyTree userId={user.id} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column → Collapsible tools */}
                    <div className="col-md-4">
                        {/* Add Address */}
                        <div className="card mb-4">
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowAddAddress(!showAddAddress)}
                            >
                                <h5 className="mb-0">Add New Address</h5>
                                <i className={`bi ${showAddAddress ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            {showAddAddress && (
                                <div className="card-body">
                                    <AddAddressForm userId={user.id} />
                                </div>
                            )}
                        </div>

                        {/* Change Photo collapsible (optional) */}
                        <div className="card mb-4">
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowPhotoUploader(!showPhotoUploader)}
                            >
                                <h5 className="mb-0">Change Photo</h5>
                                <i className={`bi ${showPhotoUploader ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            {showPhotoUploader && (
                                <div className="card-body text-center">
                                    <PhotoUploader userId={user.id} />
                                </div>
                            )}
                        </div>
                        
                        <div className="d-grid mt-3">
                            <button
                                className="btn btn-primary"
                                onClick={handleGenerateCard}
                            >
                                Download Identity Card (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;