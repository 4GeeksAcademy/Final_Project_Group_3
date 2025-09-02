import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import CustomerBooking from './components/CustomerBooking';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book" element={<CustomerBooking />} />
          <Route path="/" element={<Navigate to="/book" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
