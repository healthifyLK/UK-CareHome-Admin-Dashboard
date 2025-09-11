import React from 'react'
import { Styles } from '../Styles/Styles'
import AddNewBts from '../Components/AddNewBts'
import Chart from '../Components/Chart'
import CareHomeSummaryCard from '../Components/CareHomeSummaryCard'

const CareHomes = () => {
  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Care Homes</h1>
        <AddNewBts btn_name="Care Home" />
      </div>

      {/* Start of Care Home Summary Card Container */}
      <div className='overflow-y-scroll scroll-smooth mt-5'>
        <CareHomeSummaryCard/>
      </div>
      {/* End of Care Home Summary Card Container */}
    </div>
  )
}

export default CareHomes