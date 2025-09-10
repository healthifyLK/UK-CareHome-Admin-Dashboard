import React from 'react'
import { Styles } from '../Styles/Styles'

function AddNewBts({btn_name}) {
  return (
    <div>
        <button className={Styles.AddButton}><i class="fi fi-rr-plus scale-90 flex "></i>Add {btn_name}</button>
    </div>
  )
}

export default AddNewBts