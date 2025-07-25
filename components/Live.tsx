import React, { useCallback, useEffect, useState } from 'react'
import LiveCursor from './cursor/LiveCursor';
import { useBroadcastEvent, useEventListener, useMyPresence, useOthers } from '@liveblocks/react/suspense';
import CursorChat from './cursor/CursorChat';
import { CursorMode,CursorState,Reaction, ReactionEvent } from '@/types/type';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';

// react mutalble object a special object in React used to hold a reference (a pointer) to a DOM element or any mutable value that doesn’t change across re-renders.


type props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

const Live = ({canvasRef} :props) => {
    const [{cursor},updateMyPresence] = useMyPresence();

    const [reaction, setReaction] = useState<Reaction[]>([])

    const broadcast = useBroadcastEvent();

    useInterval(()=>{
      setReaction((reaction)=>reaction.filter((r)=>
      r.timestamp > Date.now() - 3000))

    },1000)

    useInterval(()=>{
      if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
        setReaction((reactions) => reactions.concat([
          {
            point:{x:cursor.x,y:cursor.y},
            timestamp:Date.now(),
            value:cursorState.reaction,
          }
        ]))
        broadcast({
          x:cursor.x,
          y:cursor.y,
          value:cursorState.reaction,
        })
      }
    },100)


    useEventListener((eventData) =>{
      const event = eventData.event as ReactionEvent;
      setReaction((reactions) => reactions.concat([
          {
            point:{x:event.x,y:event.y},
            timestamp:Date.now(),
            value:event.value,
          }
        ]))
    })

    const [cursorState, setCursorState] = useState<CursorState>(
      {
        mode:CursorMode.Hidden,
      }
    )

    const handlePointerMove = useCallback((event:React.PointerEvent)=>
      {
        event.preventDefault();

        if(cursor == null || cursorState.mode !==CursorMode.ReactionSelector){

          // getBoundingClientRect().x gives you the horizontal position of the element’s left edge relative to the browser window (viewport).
          const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
          const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
  
          updateMyPresence({cursor : {x,y}});
        }

    },[])
    
    const handlePointerLeave = useCallback(()=>
      {
        setCursorState({
          mode: CursorMode.Hidden
        });

        updateMyPresence({cursor :null});
    },[])

    const handlePointerUp = useCallback((event: React.PointerEvent)=>{
          setCursorState((state: CursorState)=>
            cursorState.mode === CursorMode.Reaction ? {
              ...state,isPressed:false
            } :state
    )},[cursorState.mode,setCursorState]);

    const handlePointerDown = useCallback((event:React.PointerEvent)=>
      {
        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;

        updateMyPresence({cursor : {x,y}});

        setCursorState((state: CursorState) =>state.mode === CursorMode.Reaction ? { ...state, isPressed: true } : state

      )
    },[cursorState.mode,setCursorState])

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

        }else if(e.key ==='e'){
           setCursorState({
            mode:CursorMode.ReactionSelector,
           })   
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


    const setReactions = useCallback((reaction :string) =>{
      setCursorState ({mode: CursorMode.Reaction,reaction,isPressed:false})
    },[])

  return (
    <div
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp = {handlePointerUp}
      className=" relative w-full h-[100vh] flex justify-center items-center text-center">
      
      <canvas ref= {canvasRef} className="relative w-full h-full" />
      {reaction.map((reaction,index) => (
          <FlyingReaction
          key={`${reaction.timestamp}-${index}`} 
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
          value={reaction.value}
          />
      ))}

        {cursor && (
          <CursorChat
            cursor ={cursor}
            cursorState={cursorState}
            setCursorState={setCursorState}
            updateMyPresence={updateMyPresence}
          />
        )}
        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={setReactions}
          />
        )}
        <LiveCursor />
    </div>
  )
}

export default Live