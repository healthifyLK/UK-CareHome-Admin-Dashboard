import React from 'react'
import { Styles } from '../Styles/Styles'
import RosterAddForm from '../Components/RosterAddForm'
import BackButton from '../Components/BackButton'

function RosterAddPage() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
        </div>
        
        <div className='overflow-y-scroll'>
            <RosterAddForm/>
        </div>
    </div>
  )
}

export default RosterAddPage