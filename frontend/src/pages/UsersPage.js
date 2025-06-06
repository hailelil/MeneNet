// src/pages/UsersPage.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.get('/users')
            .then(response => {
                setUsers(response.data.users);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
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

                {users.length === 0 ? (
                    <p>No users found.</p>
                ) : (
                    <>
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Date of Birth</th>
                                    <th>Gender</th>
                                    <th>National ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
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

                        {/* Pagination controls */}
                        <nav className="d-flex justify-content-center mt-4">
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                )}
            </div>
        </div>
    );
};

export default UsersPage;