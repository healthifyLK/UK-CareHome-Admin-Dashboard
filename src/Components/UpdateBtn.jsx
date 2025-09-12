import React from 'react'

function UpdateBtn({btn_name}) {
  return (
    <div>
        <button className='text-white bg-gray-800 py-1.5 px-3 rounded-md'>Update {btn_name}</button>
    </div>
  )
}

export default UpdateBtn