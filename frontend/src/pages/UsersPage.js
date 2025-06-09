// src/pages/UsersPage.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [userPhotos, setUserPhotos] = useState({});
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            const usersData = response.data.users;
            setUsers(usersData);

            // Fetch profile photos
            const photoPromises = usersData.map(async (user) => {
                try {
                    const photoResponse = await api.get(`/photos/${user.id}`);
                    return { userId: user.id, photoUrl: `http://127.0.0.1:5000${photoResponse.data.image_url}` };
                } catch (error) {
                    // If user has no photo, return default
                    return { userId: user.id, photoUrl: '/default_profile.png' }; // Place default_profile.png in public/
                }
            });

            const photoResults = await Promise.all(photoPromises);
            const photosMap = {};
            photoResults.forEach(p => {
                photosMap[p.userId] = p.photoUrl;
            });
            setUserPhotos(photosMap);

        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value === '') {
            fetchUsers();
        } else {
            api.get(`/users/search?q=${value}`)
                .then(response => {
                    setUsers(response.data.users);
                    setCurrentPage(1); // Reset to first page on new search
                })
                .catch(error => {
                    console.error('Error searching users:', error);
                });
        }
    };

    const totalPages = Math.ceil(users.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Slice users for current page
    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div style={{
                width: '900px',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                backgroundColor: '#fff'
            }}>
                <h2 className="text-center mb-4 fw-bold">Registered Identity</h2>

                {/* Search box */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name or National ID"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <>
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                    <th>National ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            <img
                                                src={userPhotos[user.id]}
                                                alt="Profile"
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    marginRight: '8px',
                                                    border: '1px solid #ddd'
                                                }}
                                            />
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td>{user.date_of_birth}</td>
                                        <td>{user.gender}</td>
                                        <td>
                                            <Link to={`/users/${user.id}`} className="text-decoration-none">
                                                {user.national_id}
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination controls with windowed display */}
                        <nav className="d-flex justify-content-center mt-4">
                            <ul className="pagination">
                                {/* First Page button */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(1)}>
                                        <i className="bi bi-chevron-bar-left"></i>
                                    </button>
                                </li>

                                {/* Previous window */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>

                                {/* Page number window */}
                                {Array.from({ length: Math.min(10, totalPages) }, (_, index) => {
                                    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
                                    const pageNumber = startPage + index;
                                    if (pageNumber > totalPages) return null;
                                    return (
                                        <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                                                {pageNumber}
                                            </button>
                                        </li>
                                    );
                                })}

                                {/* Next window */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>

                                {/* Last Page button */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                                        <i className="bi bi-chevron-bar-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </div>
    );
};

export default UsersPage;