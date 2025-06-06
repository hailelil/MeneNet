// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import AppLayout from './layout/AppLayout';
import RegisterUserPage from './pages/RegisterUserPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
        <Router>
            <AppLayout>
               <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  
                  <Route
                      path="/users"
                      element={
                          <ProtectedRoute>
                              <UsersPage />
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/users/:id"
                      element={
                          <ProtectedRoute>
                              <UserProfilePage />
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/register"
                      element={
                          <ProtectedRoute>
                              <RegisterUserPage />
                          </ProtectedRoute>
                      }
                  />
                  <Route
                      path="/update-password"
                      element={
                          <ProtectedRoute>
                              <UpdatePasswordPage />
                          </ProtectedRoute>
                      }
                  />
                  
                  <Route path="/" element={<LoginPage />} />
              </Routes>
            </AppLayout>
        </Router>
    );
}

export default App;