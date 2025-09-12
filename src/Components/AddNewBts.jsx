import React from 'react'
import { Styles } from '../Styles/Styles'
import { Link } from 'react-router-dom'

function AddNewBts({btn_name, link_path}) {
  return (
    <div>
        <Link to={`${link_path}`} className={Styles.AddButton}><i className="fi fi-rr-plus scale-90 flex "></i>Add {btn_name}</Link>
    </div>
  )
}

export default AddNewBts