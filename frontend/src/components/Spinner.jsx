import React from 'react'
import { Circles } from 'react-loader-spinner'

const Spinner = ({msg}) => {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full '>
          <Circles
              height="80"
              width="80"
              color="#01050a"
              ariaLabel="circles-loading"
              visible={true}
          />
          
          <p className='text-lg text-center px-2'>{msg }</p>
    </div>
  )
}

export default Spinner
