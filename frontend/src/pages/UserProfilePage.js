// src/pages/UserProfilePage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import FamilyTree from '../components/FamilyTree';
import AddressList from '../components/AddressList';
import AddAddressForm from '../components/AddAddressForm';
import PhotoUploader from '../components/PhotoUploader';

const UserProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // States for collapsible cards
    const [showAddAddress, setShowAddAddress] = useState(false);
    const [showPhotoUploader, setShowPhotoUploader] = useState(false);
    const [showAddresses, setShowAddresses] = useState(true);  // default open
    const [showFamily, setShowFamily] = useState(true);        // default open


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

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold">User Profile</h2>

            {error ? (
                <p className="alert alert-danger text-center">{error}</p>
            ) : !user ? (
                <p className="text-center">Loading user profile...</p>
            ) : (
                <div className="row">
                    {/* Left column */}
                    <div className="col-md-8">
                        {/* User Info card */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">User Information:</h5>
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>First Name:</strong> {user.first_name}</p>
                                <p><strong>Last Name:</strong> {user.last_name}</p>
                                <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
                                <p><strong>Gender:</strong> {user.gender}</p>
                                <p><strong>National ID:</strong> {user.national_id}</p>
                            </div>
                        </div>

                        {/* Addresses card */}
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

                        {/* Family Relationships card */}
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

                    {/* Right column */}
                    <div className="col-md-4">
                        {/* Add Address card → collapsible */}
                        <div className="card mb-4">
                            <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowAddAddress(!showAddAddress)}
                            >
                                <h5 className="mb-0">Update Address</h5>
                                <i className={`bi ${showAddAddress ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                            </div>
                            {showAddAddress && (
                                <div className="card-body">
                                    <AddAddressForm userId={user.id} />
                                </div>
                            )}
                        </div>

                        {/* Profile Photo card → collapsible */}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;