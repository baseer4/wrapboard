import React, { useCallback } from 'react'
import LiveCursor from './cursor/LiveCursor';
import { useMyPresence, useOthers } from '@liveblocks/react/suspense';

const Live = () => {
    const others = useOthers();
    const [{cursor},updateMyPresence] = useMyPresence();

    const handlePointerMove = useCallback((event:React.PointerEvent)=>
      {
        event.preventDefault();

        // getBoundingClientRect().x gives you the horizontal position of the element’s left edge relative to the browser window (viewport).
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor : {x,y}});
      },[])
    
     const handlePointerLeave = useCallback((event:React.PointerEvent)=>
      {
        event.preventDefault();

        updateMyPresence({cursor :null});
      },[])

       const handlePointerDown = useCallback((event:React.PointerEvent)=>
      {
        // getBoundingClientRect().x gives you the horizontal position of the element’s left edge relative to the browser window (viewport).
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor : {x,y}});
      },[])





  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="w-full h-[100vh] flex justify-center items-center text-center">
      
      <h1 className="text-4xl text-white">
        liveblocks ? working
      </h1>
        <LiveCursor others ={others}/>
    </div>
  )
}

export default Live