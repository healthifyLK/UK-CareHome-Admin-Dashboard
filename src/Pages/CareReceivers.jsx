import React from 'react'
import AddNewBts from '../Components/AddNewBts'
import { Styles } from '../Styles/Styles'

function CareReceivers() {
  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Receivers</h1>
        <AddNewBts btn_name={"Care Receiver"} />
      </div>
    </div>
  )
}

export default CareReceivers