import React from 'react'
import { Styles } from '../Styles/Styles'
import AddNewBts from '../Components/AddNewBts'
import RosterArea from '../Components/RosterArea'

function Roster() {
  return (
    <div className={Styles.PageStyle}>
      <div className={Styles.PageTopContainer}>
        <h1 className={Styles.TitleText}>Rosters</h1>
        <AddNewBts btn_name="Shift" />
      </div>
      <div className='overflow-y-scroll relative'>
        <RosterArea/>
      </div>
    </div>
  )
}

export default Roster