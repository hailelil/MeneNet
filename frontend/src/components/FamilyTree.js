// src/components/FamilyTree.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const FamilyTree = ({ userId }) => {
    const [relationships, setRelationships] = useState([]);

    useEffect(() => {
        fetchFamily();
    }, [userId]);

    const fetchFamily = () => {
        console.log('User ID:', userId);

        // ✅ THIS IS YOUR CORRECT BACKEND PATH:
        api.get(`/relationships/${userId}`)
            .then(response => {
                console.log('API Response:', response.data);

                if (response.data.family) {
                    console.log('Setting relationships:', response.data.family);
                    setRelationships(response.data.family);
                } else {
                    console.log('Setting relationships: []');
                    setRelationships([]);
                }
            })
            .catch(error => {
                console.error('Error fetching family relationships:', error);
                setRelationships([]);
            });
    };

    return (
        <div>
            {relationships.length === 0 ? (
                <p>No family relationships found.</p>
            ) : (
                <ul className="list-group">
                    {relationships.map((rel, index) => (
                        <li key={index} className="list-group-item">
                            <strong>{rel.relationship_type}:</strong>{' '}
                            <Link to={`/users/${rel.related_user_id}`} className="text-decoration-none">
                                View Detail {rel.related_user_id}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FamilyTree;