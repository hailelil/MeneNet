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
                console.log('Addresses response:', response.data);  // debug
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
                <ul className="list-group">
                    {addresses.map((address, index) => (
                        <li key={index} className="list-group-item">
                            <p className="mb-1"><strong>Street:</strong> {address.street}</p>
                            <p className="mb-1"><strong>City:</strong> {address.city}</p>
                            <p className="mb-1"><strong>State:</strong> {address.state}</p>
                            <p className="mb-1"><strong>Postal Code:</strong> {address.postal_code}</p>
                            <p className="mb-1"><strong>Country:</strong> {address.country}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressList;