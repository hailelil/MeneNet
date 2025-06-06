// src/components/Navbar.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const token = localStorage.getItem('authToken');

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('authToken');
            navigate('/login');
        }
    };

    return (
        <nav className="d-flex align-items-center justify-content-between px-4" style={{ backgroundColor: '#00AEEF', height: '60px' }}>
            {/* Left side → Logo or App Name */}
            <div className="text-white fw-bold fs-5">
                MeneNet
            </div>

            {/* Right side → Conditional menu */}
            <div className="d-flex align-items-center position-relative">

                {token ? (
                    <>
                        {/* Main Navigation Links */}
                        <Link to="/users" className="text-white text-decoration-none mx-3">Users</Link>
                        <Link to="/register" className="text-white text-decoration-none mx-3">Register</Link>
                        <Link to="/update-password" className="text-white text-decoration-none mx-3">Update Password</Link>

                        {/* Search icon */}
                        <i
                            className="bi bi-search text-white fs-5 mx-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowSearch(!showSearch)}
                        ></i>

                        {showSearch && (
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control position-absolute"
                                style={{ top: '50px', right: '200px', width: '200px' }}
                            />
                        )}

                        {/* Person icon → dropdown menu */}
                        <i
                            className="bi bi-person text-white fs-5 mx-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowDropdown(!showDropdown)}
                        ></i>

                        {showDropdown && (
                            <div className="position-absolute bg-white shadow p-2 rounded" style={{ top: '50px', right: '50px', zIndex: 999 }}>
                                <Link to="/users" className="dropdown-item" onClick={() => setShowDropdown(false)}>Users</Link>
                                <Link to="/register" className="dropdown-item" onClick={() => setShowDropdown(false)}>Register User</Link>
                                <Link to="/update-password" className="dropdown-item" onClick={() => setShowDropdown(false)}>Update Password</Link>
                            </div>
                        )}

                        {/* Logout button */}
                        <button onClick={handleLogout} className="btn btn-sm btn-light ms-3">
                            Logout
                        </button>
                    </>
                ) : (
                    // If not logged in → show only Login link
                    <Link to="/login" className="text-white text-decoration-none mx-3">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;