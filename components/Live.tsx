import React, { useCallback, useEffect, useState } from 'react'
import LiveCursor from './cursor/LiveCursor';
import { useMyPresence, useOthers } from '@liveblocks/react/suspense';
import CursorChat from './cursor/CursorChat';
import { CursorMode } from '@/types/type';

const Live = () => {
    const others = useOthers();
    const [{cursor},updateMyPresence] = useMyPresence();

    const [cursorState, setCursorState] = useState(
      {
        mode:CursorMode.Hidden,
      }
    )

    const handlePointerMove = useCallback((event:React.PointerEvent)=>
      {
        event.preventDefault();

        // getBoundingClientRect().x gives you the horizontal position of the element’s left edge relative to the browser window (viewport).
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor : {x,y}});
    },[])
    
    const handlePointerLeave = useCallback(()=>
      {
        setCursorState({
          mode: CursorMode.Hidden
        });

        updateMyPresence({cursor :null});
    },[])

    const handlePointerDown = useCallback((event:React.PointerEvent)=>
      {
        // getBoundingClientRect().x gives you the horizontal position of the element’s left edge relative to the browser window (viewport).
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor : {x,y}});
    },[])

    useEffect(()=> {
      const onKeyUp = (e: KeyboardEvent) =>{
        if(e.key ==='/'){
          setCursorState({
            mode:CursorMode.Chat,
            previousMessage:null,
            message:'',
          })
        }else if(e.key ==='Escape'){
          updateMyPresence({message:''})
          setCursorState({mode:CursorMode.Hidden})
        }
      }

      const onKeyDown = (e:KeyboardEvent) =>{
        if(e.key ==='/'){
          e.preventDefault();
        }
      }
      window.addEventListener('keyup',onKeyUp)
      window.addEventListener('keydown',onKeyDown)
      return ()=>{
        window.removeEventListener('keyup',onKeyUp)
        window.removeEventListener('keydown',onKeyDown)
      }
    },[updateMyPresence])




  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="w-full h-[100vh] flex justify-center items-center text-center">
      
      <h1 className="text-4xl text-white">
        liveblocks ? working
      </h1>
        {cursor && (
          <CursorChat
            cursor ={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}

        <LiveCursor others ={others}/>
    </div>
  )
}

export default Live