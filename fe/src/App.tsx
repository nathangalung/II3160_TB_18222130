import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
// import ProfilePage from './pages/ProfilePage';

import HomeCustomerPage from './pages/customer/HomeCustomerPage';
// import AppointmentCustomerPage from './pages/customer/AppointmentCustomerPage';
// import ScheduleCustomerPage from './pages/customer/ScheduleCustomerPage';
// import PrescriptionCustomerPage from './pages/customer/PrescriptionCustomerPage';

import HomeDoctorPage from './pages/doctor/HomeDoctorPage';
// import AppointmentDoctorPage from './pages/doctor/AppointmentDoctorPage';

import HomePharmacistPage from './pages/pharmacist/HomePharmacistPage';
// import AppointmentPharmacistPage from './pages/pharmacist/AppointmentPharmacistPage';

function App() {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
  
        <Route path="/customer/home" element={<HomeCustomerPage />} />
        {/* <Route path="/customer/appointment" element={<AppointmentCustomerPage />} />
        <Route path="/customer/schedule" element={<ScheduleCustomerPage />} />
        <Route path="/customer/prescription" element={<PrescriptionCustomerPage />} /> */}
  
        <Route path="/doctor/home" element={<HomeDoctorPage />} />
        {/* <Route path="/doctor/appointment" element={<AppointmentDoctorPage />} /> */}
  
        <Route path="/pharmacist/home" element={<HomePharmacistPage />} />
        {/* <Route path="/pharmacist/appointment" element={<AppointmentPharmacistPage />} /> */}
      </Routes>
    );
  }
  
  export default App
