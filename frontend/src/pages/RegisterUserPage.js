// src/pages/RegisterUserPage.js

import React from 'react';
import UserRegistrationForm from '../components/UserRegistrationForm';

const RegisterUserPage = () => {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4 fw-bold">Register New User</h2>

            {/* UserRegistrationForm already has row + columns inside */}
            <UserRegistrationForm />
        </div>
    );
};

export default RegisterUserPage;