// src/components/AddAddressForm.js

import React, { useState } from 'react';
import api from '../services/api';

const AddAddressForm = ({ userId }) => {
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
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
            await api.post('/addresses', {
                user_id: userId,
                ...formData
            });

            setMessage('Address added successfully!');

            // Reset form
            setFormData({
                street: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
            });
        } catch (error) {
            console.error('Error adding address:', error.response ? error.response.data : error.message);
            setMessage('Failed to add address.');
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
                        name="street"
                        placeholder="Street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="postal_code"
                        placeholder="Postal Code"
                        value={formData.postal_code}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg w-100">
                        Add Address
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddAddressForm;