import CursorSVG from '@/public/assets/CursorSVG';
import React from 'react'

type Props={
    color:string;
    x:number;
    y:number;
    message:string;
}

const Cursor = ({color,x,y,message}:Props) => {
  return (
    <div className='pointer-events-none absolute top-0 left-0'
        style={{transform:`translateX(${x}px) translateY(${y}px)`}}
    >
        <CursorSVG color = {color}/>

        {message && (
          <div className="absoulte left-2 top-5 rounded-3xl px-4 py-2" 
          style={{backgroundColor:color}}>

            <p className="text-white whitespace-nowrap leading-relaxed ">{message}</p>

          </div>
        )}
    </div>

  )
}

export default Cursor