import React from 'react'
import { CareHomeNames } from '../assets/assets'

function CareHomeFilter() {
  return (
    <select>
        <option value={'All'}>All</option>
        {CareHomeNames.map((item, index) => {
            return(
                <option value={item}>{item}</option>
            )
        })}
    </select>
  )
}

export default CareHomeFilter