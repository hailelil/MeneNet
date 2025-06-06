// src/pages/UpdatePasswordPage.js

import React from 'react';
import PasswordUpdateForm from '../components/PasswordUpdateForm';

const UpdatePasswordPage = () => {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div style={{
                width: '400px',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
            }}>
                <h2 className="text-center mb-4 fw-bold">Update Password</h2>

                <PasswordUpdateForm />
            </div>
        </div>
    );
};

export default UpdatePasswordPage;