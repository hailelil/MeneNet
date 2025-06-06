// src/layout/AppLayout.js

import React from 'react';
import Navbar from '../components/Navbar';

const AppLayout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div style={{ padding: '20px' }}>
                {children}
            </div>
            <footer style={{ textAlign: 'center', padding: '10px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
                <p>&copy; {new Date().getFullYear()} MeneNet Identity System</p>
            </footer>
        </div>
    );
};

export default AppLayout;
