// src/pages/LoginPage.js

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/auth/login', {
                user_id: userId,
                password: password
            });

            const token = response.data.token;
            localStorage.setItem('authToken', token);
            navigate('/users'); // Redirect to UsersPage
        } catch (err) {
            console.error('Login failed:', err);
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="d-flex vh-100">
            {/* Left side → Login form */}
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-white p-5">
                <div style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 className="mb-4 fw-bold">Log in to your account</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-grid mb-3">
                            <button type="submit" className="btn btn-primary btn-lg">
                                Log In
                            </button>
                        </div>

                        <div className="text-center">
                            <a href="#!" className="text-decoration-none">Forgot Password?</a>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side → Info / promo */}
            <div className="d-none d-md-flex flex-column justify-content-center align-items-center flex-grow-1 bg-light text-center p-5">
                <img src="https://www.oneidentity.com/images/patterns/zigzag/6-column/webimage-ai-95991-01.jpg" alt="MeneNet Logo" className="mb-4" />
                <h3 className="fw-bold">MeneNet Identity System</h3>
                <p className="text-muted">Secure and trusted digital identity platform for your organization. Manage users, family relationships, and more with ease.</p>
            </div>
        </div>
    );
};

export default LoginPage;