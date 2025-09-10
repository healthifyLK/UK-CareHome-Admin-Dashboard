import React from 'react'
import { Styles } from '../Styles/Styles'
import AddNewBts from '../Components/AddNewBts'

const CareHomes = () => {
  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Homes</h1>
        <AddNewBts btn_name="Care Home" />
      </div>
    </div>
  )
}

export default CareHomes