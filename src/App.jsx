import { useState } from 'react'
import './App.css'
import Header from './Layouts/Header'
import SideMenu from './Layouts/SideMenu'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CareHomes from './Pages/CareHomes'
import CareReceivers from './Pages/CareReceivers'
import CareGivers from './Pages/CareGivers'
import CareBeds from './Pages/CareBeds'
import Roster from './Pages/Roster'
import CareHome from './Pages/CareHome';
import CareGiverRegForm from './Components/CareGiverRegForm';
import CareGiverRegPage from './Pages/CareGiverRegPage';
import CareReceiverReg from './Pages/CareReceiverReg';
import CareBedReg from './Pages/CareBedReg';
import RosterAddPage from './Pages/RosterAddPage';
import CareReceiver from './Pages/CareReceiver';
import CareGiver from './Pages/CareGiver';

function App() {

  return (
    <Router>
      <div className='w-full h-[100vh] overflow-x-hidden'>
        <Header/>
        <SideMenu/>
        
        <div className='w-[85%] h-[90vh] bg-gray-100 absolute top-[10vh] right-0'>
          <Routes>
            <Route path='/care-homes' element={<CareHomes />} />
            <Route path='/care-receivers' element={<CareReceivers />} />
            <Route path='/care-givers' element={<CareGivers />} />
            <Route path='/roster' element={<Roster />} />
            <Route path='/care-beds' element={<CareBeds />} />
            <Route path='/care-homes/:id' element={<CareHome />} />
            <Route path='/care-givers/register' element={<CareGiverRegPage />} />
            <Route path='/care-receivers/register' element={<CareReceiverReg />} />
            <Route path='/care-beds/register' element={<CareBedReg />} />
            <Route path='/roster/add' element={<RosterAddPage />} />
            <Route path='/care-receivers/:id' element={<CareReceiver />} />
            <Route path='/care-givers/:id' element={<CareGiver />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
