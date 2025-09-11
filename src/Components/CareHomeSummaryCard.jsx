import React from 'react'
import Chart from './Chart'
import { CareHomes } from '../assets/assets'

function CareHomeSummaryCard() {

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,500px))] gap-y-10 gap-x-5 justify-center py-5'>
        {CareHomes.map((item, index) => {
            return(
                <div key={index} className='flex flex-col gap-5 bg-white w-fit py-5 px-5 rounded-md cursor-pointer transition duration-200 ease-in hover:scale-[1.05]'>
                    {/* Start of Title section*/}
                    <div className='flex justify-between'>
                        <div className='text-left text-gray-700'>
                            <h1 className='text-xl font-bold leading-4'>{item.name}</h1>
                            <h2 className='text-xl font-light italic'>{item.location}</h2>
                        </div>
                        <p className={(item.status === "Active") ? "text-green-600" : "text-red-600"}>{item.status}</p>
                    </div>
                    {/* End of Title section*/}
                    {/* Start of Details Area*/}
                    <div className='flex gap-5 items-center'>
                        {/* Start of Chart*/}
                        <Chart total_beds={item.Total_Beds} occupied_beds={item.Occupied_Beds}/>
                        {/* End of Chart*/}
                        {/* Start of Middle section*/}
                        <div className='text-left leading-5'>
                            <h2>Total Beds<br/>
                                <span className='font-bold'>{item.Total_Beds}</span>
                            </h2>
                            <h2>Occupied Beds<br/>
                                <span className='font-bold'>{item.Occupied_Beds}</span>
                            </h2>
                            <h2>Available Beds<br/>
                                <span className='font-bold'>{item.Total_Beds - item.Occupied_Beds}</span>
                            </h2>
                        </div>
                        {/* End of Middle section*/}
                        <div className='w-0.5 bg-gray-300 h-[150px] rounded-xl'></div>
                        {/* Start of Final section*/}
                        <div className='text-left leading-5'>
                            <h2>Total Beds<br/>
                                <span className='font-bold'>{item.Total_Beds}</span>
                            </h2>
                            <h2>Occupied Beds<br/>
                                <span className='font-bold'>{item.Occupied_Beds}</span>
                            </h2>
                            <h2>Available Beds<br/>
                                <span className='font-bold'>{item.Total_Beds - item.Occupied_Beds}</span>
                            </h2>
                            <h2>Available Beds<br/>
                                <span className='font-bold'>{item.Total_Beds - item.Occupied_Beds}</span>
                            </h2>
                        </div>
                        {/* End of Final section*/}
                    </div>
                    {/* End of Details Area*/}
                </div>
            )
        })}
    </div>
  )
}

export default CareHomeSummaryCard