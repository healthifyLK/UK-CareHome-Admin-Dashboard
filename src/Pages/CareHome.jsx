import React from 'react'
import { useLocation } from 'react-router-dom'
import { Styles } from '../Styles/Styles';
import AddNewBts from '../Components/AddNewBts';
import BackButton from '../Components/BackButton';
import UpdateBtn from '../Components/UpdateBtn';

function CareHome() {

    const location = useLocation();
    const userData = location.state;

  return (
    <div className={Styles.PageStyle}>
        <div className={Styles.PageTopContainer}>
            <BackButton/>
            <UpdateBtn btn_name={"Care Home"}/>
        </div>
        <p>Care Home</p>
        <h1>{userData?.name}</h1>
    </div>
  )
}

export default CareHome