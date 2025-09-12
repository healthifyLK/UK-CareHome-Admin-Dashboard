import React from 'react'
import BackButton from '../Components/BackButton'
import CareReceiverRegForm from '../Components/CareReceiverRegForm'
import { Styles } from '../Styles/Styles'

function CareReceiverReg() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
        </div>
        
        <div className='overflow-y-scroll'>
            <CareReceiverRegForm/>
        </div>
    </div>
  )
}

export default CareReceiverReg