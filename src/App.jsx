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

function App() {

  return (
    <Router>
      <div className='w-full h-[100vh] overflow-x-hidden'>
        <Header/>
        <SideMenu/>
        
        <div className='w-[88%] h-[90vh] bg-indigo-300 absolute top-[10vh] right-0'>
          <Routes>
            <Route path='/' element={<CareHomes />} />
            <Route path='/care-receivers' element={<CareReceivers />} />
            <Route path='/care-givers' element={<CareGivers />} />
            <Route path='/roster' element={<Roster />} />
            <Route path='/care-beds' element={<CareBeds />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
