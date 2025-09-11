import React from 'react'
import { CareHomeNames } from '../assets/assets'

function CareHomeFilter({careHome, setCareHome}) {
  return (
    <select className='absolute border border-blue-600 p-2 bg-white rounded-md'>
        <option value={'All'}>All</option>
        {CareHomeNames.map((item, index) => {
            return(
                <option onChange={() => setCareHome(item)} key={index} value={item}>{item}</option>
            )
        })}
    </select>
  )
}

export default CareHomeFilter