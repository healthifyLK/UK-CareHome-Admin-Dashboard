import React from 'react'
import AddNewBts from '../Components/AddNewBts'
import { Styles } from '../Styles/Styles'

export default function CareBeds() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <h1 className={Styles.TitleText}>Care Beds</h1>
            <AddNewBts btn_name="Care Bed"/>
        </div>
        
    </div>
  )
}
