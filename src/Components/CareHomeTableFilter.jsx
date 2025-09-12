import React from 'react'
import { TableFilterBtn } from '../assets/assets'

function CareHomeTableFilter({filter, setFilter}) {
  return (
    <div className='flex justify-center gap-5'>
        {TableFilterBtn.map((btn, index) => {
            return(
                <button key={index} onClick={() => setFilter(btn)} className={`${(filter === btn) ? 'bg-gray-800 text-gray-50 hover:bg-gray-800' : 'bg-white text-gray-800 hover:bg-gray-100'} px-3 py-1 rounded-sm border border-gray-800 cursor-pointer transition`}>{btn}</button>
            )
        })}
    </div>
  )
}

export default CareHomeTableFilter