import React from 'react'
import { IMG, SideMenuItems } from '../assets/assets'
import { NavLink } from 'react-router-dom'


function SideMenu() {

  return (
    <div className='bg-blue-600 w-[15%] h-[90vh] mt-[10vh] px-5 py-5 flex flex-col justify-between relative'>
        <nav className='flex flex-col gap-5'>
            {SideMenuItems.map((item, index) => {
                return(
                    <NavLink to={item.path} key={index} className={({ isActive }) => `${isActive ? "bg-blue-700 hover:bg-blue-700" : ""} flex gap-4 py-3 px-3 items-center rounded-lg text-white text-left transition duration-100 ease-in cursor-pointer hover:bg-blue-500`}>
                        <i className={`${item.icon} text-white scale-120 my-auto flex`} ></i>
                        <p>{item.name}</p>
                    </NavLink>
                )
            })}
        </nav>
        <div className='flex flex-col mx-auto  bottom-0 w-[70%]'>
            <p className='text-white text-sm font-extralight '>Powered by</p>
            <a href="https://www.healthify.lk" className='cursor-pointer' target='_blank'><img src={IMG.HealthifyLogo} className='' /></a>
        </div>
    </div>
  )
}

export default SideMenu