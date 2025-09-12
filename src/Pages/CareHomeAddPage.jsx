import React from 'react'
import { Styles } from '../Styles/Styles'
import CareHomeAddForm from '../Components/CareHomeAddForm'
import BackButton from '../Components/BackButton'

function CareHomeAddPage() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
        </div>
        
        <div className='overflow-y-scroll'>
            <CareHomeAddForm/>
        </div>
    </div>
  )
}

export default CareHomeAddPage