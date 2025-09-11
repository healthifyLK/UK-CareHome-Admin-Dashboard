import React from 'react'
import { Styles } from '../Styles/Styles'

function AddBtn2({btn_name}) {
  return (
    <div className=''>
        <button className={Styles.AddButton2}>Add {btn_name}</button>
    </div>
  )
}

export default AddBtn2