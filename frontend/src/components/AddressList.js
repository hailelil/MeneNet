// src/components/AddressList.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AddressList = ({ userId }) => {
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        fetchAddresses();
    }, [userId]);

    const fetchAddresses = () => {
        api.get(`/addresses/${userId}`)
            .then(response => {
                setAddresses(response.data.addresses || []);
            })
            .catch(error => {
                console.error('Error fetching addresses:', error);
            });
    };

    return (
        <div>
            {addresses.length === 0 ? (
                <p>No addresses found.</p>
            ) : (
                <div className="row">
                    {addresses.map(address => (
                        <div key={address.id} className="col-md-12 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <p className="mb-1"><strong>Street:</strong> {address.street}</p>
                                    <p className="mb-1"><strong>City:</strong> {address.city}</p>
                                    <p className="mb-1"><strong>State:</strong> {address.state}</p>
                                    <p className="mb-1"><strong>Postal Code:</strong> {address.postal_code}</p>
                                    <p className="mb-1"><strong>Country:</strong> {address.country}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressList;