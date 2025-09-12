import React from 'react'
import BackButton from '../Components/BackButton'
import CareGiverRegForm from '../Components/CareGiverRegForm'
import { Styles } from '../Styles/Styles'

function CareGiverRegPage() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
        </div>
        
        <div className='overflow-y-scroll'>
            <CareGiverRegForm/>
        </div>
    </div>
  )
}

export default CareGiverRegPage