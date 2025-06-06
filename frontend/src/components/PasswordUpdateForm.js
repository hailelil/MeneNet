// src/components/PasswordUpdateForm.js

import React, { useState } from 'react';
import api from '../services/api';

const PasswordUpdateForm = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        old_password: '',
        new_password: '',
        confirm_password: '',  // new field
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

        // ✅ First check: new_password === confirm_password
        if (formData.new_password !== formData.confirm_password) {
            setMessage('New Password and Confirm Password do not match.');
            return;  // do not submit if mismatch
        }

        try {
            const response = await api.post('/auth/update_password', {
                user_id: formData.user_id,
                old_password: formData.old_password,
                new_password: formData.new_password
            });

            setMessage(response.data.message);

            // Reset form
            setFormData({
                user_id: '',
                old_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (error) {
            console.error('Error updating password:', error.response ? error.response.data : error.message);
            setMessage('Failed to update password. Please check your inputs.');
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
                        name="user_id"
                        placeholder="User ID (National ID)"
                        value={formData.user_id}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        name="old_password"
                        placeholder="Current Password"
                        value={formData.old_password}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        name="new_password"
                        placeholder="New Password"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm New Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordUpdateForm;