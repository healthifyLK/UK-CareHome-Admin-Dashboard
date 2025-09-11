import React, { useState } from 'react'
import AddNewBts from '../Components/AddNewBts'
import { Styles } from '../Styles/Styles'
import CareReceiverTable from '../Components/CareReceiverTable'
import CareHomeFilter from '../Components/CareHomeFilter';

function CareReceivers() {

    const[careHome, setCareHome] = useState("All");

  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Receivers</h1>
        <AddNewBts btn_name={"Care Receiver"} />
      </div>

      <div className='overflow-y-scroll relative'>
        <CareReceiverTable care_home={careHome} rows_per_page={10}/>
      </div>
    </div>
  )
}

export default CareReceivers