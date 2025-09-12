import React from 'react'
import LogoutButton from '../Components/LogoutButton'

function Header() {
  return (
    <div className='w-[100%] flex items-center relative px-5 justify-center bg-white h-[10vh]'>
      <div className='flex mx-auto flex-col items-end'>
        <h1 className='text-gray-800 text-xl font-semibold leading-4'>UK care Home</h1>
        <p className='text-blue-600'>Admin</p>
      </div>
      <div className=''>
        <LogoutButton/>
      </div>
    </div>
  )
}

export default Header