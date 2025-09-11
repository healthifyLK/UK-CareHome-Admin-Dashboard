import React, { useState } from 'react'
import { Styles } from '../Styles/Styles'
import AddNewBts from '../Components/AddNewBts'
import CareGiverTable from '../Components/CareGiverTable'

const CareGivers = () => {

  const[careHome, setCareHome] = useState("All");


  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Givers</h1>
        <AddNewBts btn_name="Care Givers" />
      </div>

      <div>
        
        <CareGiverTable care_home={careHome} rows_per_page={10}/>
      </div>
      
    </div>
  )
}

export default CareGivers