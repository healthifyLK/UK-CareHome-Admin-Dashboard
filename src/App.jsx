import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Header from './Layouts/Header';
import SideMenu from './Layouts/SideMenu';

import LoginPage from './pages/LoginPage';
import CareHomes from './pages/CareHomes';
import CareReceivers from './pages/CareReceivers';
import CareGivers from './pages/CareGivers';
import Roster from './pages/Roster';
import CareBeds from './pages/CareBeds';
import CareHome from './pages/CareHome';
import CareGiverRegPage from './pages/CareGiverRegPage';
import CareReceiverReg from './pages/CareReceiverReg';
import CareBedReg from './pages/CareBedReg';
import RosterAddPage from './pages/RosterAddPage';
import CareReceiver from './pages/CareReceiver';
import CareGiver from './pages/CareGiver';

// Layout for authenticated routes - includes header and side menu
const AppLayout = () => (
  <div className="w-[100%] h-[100vh] flex overflow-hidden">
    <SideMenu />
    <div className="flex flex-col flex-grow">
      <Header />
      <main className="w-[85%] h-[90vh] bg-gray-100 absolute top-[10vh] right-0">
        <Outlet />
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route: Login without layout */}
        <Route path="/" element={<LoginPage />} />

        {/* Nested routes with layout for app pages */}
        <Route element={<AppLayout />}>
          <Route path="/care-homes" element={<CareHomes />} />
          <Route path="/care-receivers" element={<CareReceivers />} />
          <Route path="/care-givers" element={<CareGivers />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/care-beds" element={<CareBeds />} />
          <Route path="/care-homes/:id" element={<CareHome />} />
          <Route path="/care-givers/register" element={<CareGiverRegPage />} />
          <Route path="/care-receivers/register" element={<CareReceiverReg />} />
          <Route path="/care-beds/register" element={<CareBedReg />} />
          <Route path="/roster/add" element={<RosterAddPage />} />
          <Route path="/care-receivers/:id" element={<CareReceiver />} />
          <Route path="/care-givers/:id" element={<CareGiver />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
