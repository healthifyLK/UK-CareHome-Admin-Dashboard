import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Styles } from '../Styles/Styles';
import BackButton from '../Components/BackButton';
import UpdateBtn from '../Components/UpdateBtn';
import Chart from '../Components/Chart';
import AddBtn2 from '../Components/AddBtn2';
import AllocationTable from '../Components/AllocationTable';
import CareHomeTableFilter from '../Components/CareHomeTableFilter';
import CareReceiverTable from '../Components/CareReceiverTable';
import BedsTable from '../Components/BedsTable';
import CareGiverTable from '../Components/CareGiverTable';

function CareHome() {

    const[filter, setFilter] = useState("Allocations");

    const location = useLocation();
    const careHomeData = location.state;


    const Allocations = careHomeData?.Allocations || [];
    const CareGivers = careHomeData?.CareGivers || [];

    console.log("Allocations:", Allocations);
    console.log("CareGivers:", CareGivers);

  return (
    <div className={Styles.PageStyle}>
        {/* Start of Page header area */}
        <div className={Styles.PageTopContainer}>
            <BackButton/>
            <UpdateBtn btn_name={"Care Home"}/>
            {/* End of Page header area */}
        </div>
        <div className='flex flex-col gap-5 overflow-scroll'>
            {/* Start of Page title area */}
            <div className='text-left'>
                <h1 className='text-xl font-bold leading-4'>{careHomeData?.name}</h1>
                <h1 className='text-lg font-light'>{careHomeData?.location} | <span className={careHomeData?.status === "Active" ? "text-green-600" : "text-red-600"}>{careHomeData?.status}</span></h1>
            </div>
            {/* End of Page title area */}
            {/* Start of Page top area */}
            <div className='flex justify-around items-center'>
                {/* Start of Page Bed details section */}
                <div className='flex items-center gap-5 bg-white w-fit p-8 rounded-lg'>
                    <Chart total_beds={careHomeData?.Total_Beds} occupied_beds={careHomeData?.Occupied_Beds}/>
                    <div className='text-left leading-5 '>
                        <h2>Total Beds<br/>
                            <span className='font-bold'>{careHomeData?.Total_Beds}</span>
                        </h2>
                        <h2>Occupied Beds<br/>
                            <span className='font-bold'>{careHomeData?.Occupied_Beds}</span>
                        </h2>
                        <h2>Available Beds<br/>
                            <span className='font-bold'>{careHomeData?.Total_Beds - careHomeData?.Occupied_Beds}</span>
                        </h2>
                    </div>
                </div>
                {/* Start of Page Bed details section */}
                <div className='flex flex-col gap-2'>
                    <AddBtn2 btn_name={'Care Giver'} />
                    <AddBtn2 btn_name={'Care Receiver'}/>
                    <AddBtn2 btn_name={'Care Bed'}/>
                </div>
            </div>
            {/* End of Page top area */}
            {/* Start of Care Home Data section*/}
            <div className='flex flex-col mt-10'>
                <CareHomeTableFilter filter={filter} setFilter={setFilter}/>
                {(filter === "Allocations") ? <AllocationTable initialData={Allocations} availableCareGivers={CareGivers}/> : 
                (filter === "Care Receivers") ? <CareReceiverTable care_home={careHomeData?.name} rows_per_page={5}/> :
                (filter === "Care Givers") ? <CareGiverTable care_home={careHomeData?.name} rows_per_page={5}/> : 
                (filter === "Beds") ? <BedsTable care_home={careHomeData?.name} rows_per_page={5}/> :
                ''}
            </div>
            {/* End of Care Home Data section*/}
        </div>
    </div>
  )
}
export default CareHome