import React from 'react'
import CareBedRegForm from '../Components/CareBedRegForm'
import { Styles } from '../Styles/Styles'
import BackButton from '../Components/BackButton'

function CareBedReg() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
        </div>
        
        <div className='overflow-y-scroll'>
            <CareBedRegForm/>
        </div>
    </div>
  )
}

export default CareBedReg