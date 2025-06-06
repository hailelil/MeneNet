// src/components/UserRegistrationForm.js

import React, { useState } from 'react';
import api from '../services/api';

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        region_code: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Register user
            const userResponse = await api.post('/users/register', formData);
            const nationalId = userResponse.data.national_id;

            // Step 2: Register auth with default password
           /* await api.post('/auth/register', {
                user_id: nationalId,
                password: 'toor4321'
            });*/

            setMessage(`User registered successfully! National ID: ${nationalId}. Default password: toor4321`);
            
            // Reset form
            setFormData({
                first_name: '',
                last_name: '',
                date_of_birth: '',
                gender: '',
                region_code: '',
            });

        } catch (error) {
            console.error('Error registering user:', error);
            setMessage('Failed to register user.');
        }
    };

    return (
        <div>
            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        required
                        className="form-control"
                        placeholder="Date of Birth"
                    />
                </div>

                <div className="mb-3">
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="form-control"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="region_code"
                        placeholder="Region Code"
                        value={formData.region_code}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg w-100">
                        Register User
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserRegistrationForm;