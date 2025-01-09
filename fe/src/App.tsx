import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';

import HomePatientPage from './pages/patient/HomePatientPage';
import AppointmentPatientPage from './pages/patient/AppointmentPatientPage';
import SchedulePatientPage from './pages/patient/SchedulePatientPage';
import PrescriptionPatientPage from './pages/patient/PrescriptionPatientPage';

import HomeDoctorPage from './pages/doctor/HomeDoctorPage';
import AppointmentDoctorPage from './pages/doctor/AppointmentDoctorPage';

import HomePharmacistPage from './pages/pharmacist/HomePharmacistPage';
import PrescriptionPharmacistPage from './pages/pharmacist/PrescriptionPharmacistPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/chat" element={<ChatPage />} />
      
      {/* Patient Routes */}
      <Route path="/patient">
        <Route path="home" element={<HomePatientPage />} />
        <Route path="appointment" element={<AppointmentPatientPage />} />
        <Route path="schedule" element={<SchedulePatientPage />} />
        <Route path="prescription" element={<PrescriptionPatientPage />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor">
        <Route path="home" element={<HomeDoctorPage />} />
        <Route path="appointment" element={<AppointmentDoctorPage />} />
      </Route>

      {/* Pharmacist Routes */}
      <Route path="/pharmacist">
        <Route path="home" element={<HomePharmacistPage />} />
        <Route path="prescription" element={<PrescriptionPharmacistPage />} />
      </Route>
    </Routes>
  );
}

export default App;