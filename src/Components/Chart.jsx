import React from 'react'
import colors from 'tailwindcss/colors';
import { PieChart } from '@mui/x-charts/PieChart';

const settings = {
  margin: { right: 5 },
  width: 150,
  height: 150,
  hideLegend: true,
};

function Chart({total_beds, occupied_beds}) {

    const Available_Beds = total_beds - occupied_beds;
    const Available_Color = colors.gray[500];
    const Occupied_Color = colors.green[500];

  return (
    <div className='flex w-fit items-center justify-center relative'>
        <PieChart
        series={[{ 
            innerRadius: 50, 
            outerRadius: 70, 
            data :[
                { label: 'Occupied', value: occupied_beds, color: Occupied_Color},
                { label: 'Available', value: Available_Beds, color: Available_Color }
            ], 
            arcLabel: '',
            cornerRadius: 8,
            startAngle: 0,
            paddingAngle: 5, 
        }]}
        {...settings}
        />

        <div className='absolute flex'>
            <p className=' leading-4 text-gray-500'> <span className='text-2xl font-semibold text-gray-900'>{Available_Beds}</span><br/>{occupied_beds}/{total_beds}</p>
        </div>
    </div>
  )
}

export default Chart