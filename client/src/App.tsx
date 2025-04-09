import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInSide from './pages/SignInSide/SignInSide.tsx';
import Register from './pages/Register.tsx';
import AdminPage from './pages/AdminPage.tsx';
import UserPage from './pages/UserPage.tsx';
import SubmitBias from './pages/SubmitBias.tsx';
import SearchBias from './pages/SearchBias.tsx';
import AdminRequests from './pages/AdminRequests.tsx';
import AdminSubmitBias from './pages/AdminSubmitBias.tsx';
import AdminSearchBias from './pages/AdminSearchBias.tsx';
import AdminUserList from './pages/AdminUserList.tsx';
import AdminUpdateBias from './pages/AdminUpdateBias.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInSide />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-requests" element={<AdminRequests />} />
        <Route path="/admin-submit" element={<AdminSubmitBias />} />
        <Route path="/admin-search" element={<AdminSearchBias />} />
        <Route path="/user-list" element={<AdminUserList />} />
        <Route path="/update-bias" element={<AdminUpdateBias />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/submit" element={<SubmitBias />} />
        <Route path="/search" element={<SearchBias />} />
        <Route path="/editor" element={<div className="content">Editor Page</div>} />
      </Routes>
    </Router>
  );
};

export default App;
