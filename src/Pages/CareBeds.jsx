import React from 'react'
import AddNewBts from '../Components/AddNewBts'
import { Styles } from '../Styles/Styles'
import BedsTable from '../Components/BedsTable'

export default function CareBeds() {
  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <h1 className={Styles.TitleText}>Care Beds</h1>
            <AddNewBts btn_name="Care Bed"/>
        </div>
        
        <div className='overflow-y-scroll relative'>
          <BedsTable rows_per_page={10}/>
        </div>
    </div>
  )
}
