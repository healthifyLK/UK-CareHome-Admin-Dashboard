import React from 'react'
import { SideMenuItems } from '../assets/assets'
import { Link } from 'react-router-dom'

function SideMenu() {
  return (
    <div className='bg-gray-50 w-[12%] h-[90vh]'>
        <div className='flex flex-col'>
            {SideMenuItems.map((item, index) => {
                return(
                    <Link to={item.path} key={index} className='flex bg-white gap-2.5 py-3 px-2 transition duration-100 ease-in cursor-pointer hover:bg-blue-200'>
                        <img src={item.icon} className='w-5' />
                        <p>{item.name}</p>
                    </Link>
                )
            })}
        </div>
    </div>
  )
}

export default SideMenu