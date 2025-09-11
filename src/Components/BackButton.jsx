import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function BackButton() {
    const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)} className='bg-gray-800 p-3 rounded-full cursor-pointer transition hover:bg-gray-600 active:bg-gray-700'>
        <i className="fi fi-rr-angle-left flex text-white"></i>
    </div>
  )
}

export default BackButton