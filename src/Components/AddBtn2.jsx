import React from 'react'
import { Styles } from '../Styles/Styles'
import { useNavigate } from 'react-router-dom'

function AddBtn2({btn_name, link_path}) {
  
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link_path);
  };

  return (
    <div className=''>
        <button onClick={handleClick} className={Styles.AddButton2}>Add {btn_name}</button>
    </div>
  )
}

export default AddBtn2