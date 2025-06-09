// src/components/UserRegistrationForm.js

import React, { useState } from 'react';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const regions = [
    "Tigray",
    "Amhara",
    "Addis Ababa",
    "Oromia",
    "Harer",
    "Afar",
    "Debub",
    "Wolaita",
    "Somalia",
    "Diredawa"
];

const countries = [
    "Ethiopia",
    "Kenya",
    "Uganda",
    "Sudan",
    "South Sudan",
    "Djibouti",
    "Eritrea",
    "Somalia",
    "USA",
    "Canada",
    "Germany",
    "UK",
    "France",
    "Italy",
    "Spain",
    "India",
    "China",
    "Japan",
    "UAE",
    "Saudi Arabia"
    // You can add more countries here
];

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: null,
        gender: '',
        region_code: '',
    });

    const [addressData, setAddressData] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
    });

    const [photoFile, setPhotoFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        setAddressData({
            ...addressData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setPhotoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Step 1: Register user
            const userResponse = await api.post('/users/register', {
                ...formData,
                date_of_birth: formData.date_of_birth
                    ? formData.date_of_birth.toISOString().split('T')[0]
                    : ''
            });

            const nationalId = userResponse.data.national_id;

            // Step 2: Get user_id from /users/by_national_id
            const userByIdResponse = await api.get(`/users/by_national_id/${nationalId}`);
            const userId = userByIdResponse.data.id;

            // Step 3: Register auth
            await api.post('/auth/register', {
                user_id: userId,
                password: 'toor4321'
            });

            // Step 4: Upload profile photo (if selected)
            if (photoFile && userId) {
                const formDataPhoto = new FormData();
                formDataPhoto.append('user_id', userId);
                formDataPhoto.append('image_file', photoFile);

                await api.post('/photos/upload', formDataPhoto, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Step 5: Add address
            await api.post('/addresses', {
                user_id: userId,
                ...addressData
            });

            setMessage(`Identity registered successfully! National ID: ${nationalId}. Default password: toor4321`);

            // Reset form
            setFormData({
                first_name: '',
                last_name: '',
                date_of_birth: null,
                gender: '',
                region_code: '',
            });
            setAddressData({
                street: '',
                city: '',
                state: '',
                country: '',
                postal_code: '',
            });
            setPhotoFile(null);

        } catch (error) {
            console.error('Error registering identity:', error);
            setMessage('Failed to register identity.');
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
                <div className="row">
                    {/* Left Column: Card → User Info + Photo */}
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">User Information</h5>

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
                                    <label className="form-label"></label>
                                    <DatePicker
                                        selected={formData.date_of_birth}
                                        onChange={(date) => setFormData({ ...formData, date_of_birth: date })}
                                        dateFormat="MMMM d, yyyy"
                                        placeholderText="Select Date of Birth"
                                        className="form-control"
                                        required
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
                                    <select
                                        name="region_code"
                                        value={formData.region_code}
                                        onChange={handleChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Upload Profile Photo (optional)</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="form-control"
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Card → Address */}
                    <div className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Address</h5>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="street"
                                        placeholder="Street"
                                        value={addressData.street}
                                        onChange={handleAddressChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        value={addressData.city}
                                        onChange={handleAddressChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="State"
                                        value={addressData.state}
                                        onChange={handleAddressChange}
                                        required
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <select
                                        name="country"
                                        value={addressData.country}
                                        onChange={handleAddressChange}
                                        required
                                        className="form-control"
                                    >
                                        <option value="">Select Country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <input
                                        type="text"
                                        name="postal_code"
                                        placeholder="Postal Code"
                                        value={addressData.postal_code}
                                        onChange={handleAddressChange}
                                        required
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button → full width → outside cards */}
                <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-success btn-lg w-100">
                        Register Identity
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserRegistrationForm;