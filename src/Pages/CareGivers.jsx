import React from 'react'
import { Styles } from '../Styles/Styles'
import AddNewBts from '../Components/AddNewBts'

const CareGivers = () => {
  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Givers</h1>
        <AddNewBts btn_name="Care Givers" />
      </div>
    </div>
  )
}

export default CareGivers