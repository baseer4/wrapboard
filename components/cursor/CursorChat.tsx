import CursorSVG from '@/public/assets/CursorSVG';
import { CursorChatProps, CursorMode } from '@/types/type';
import React from 'react'

const CursorChat = ({cursor,cursorState,setCursorState,updateMyPresence}:CursorChatProps) => {
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        updateMyPresence({message: e.target.value})
        setCursorState({
          mode:CursorMode.Chat,
          previousMessage:null,
          message:e.target.value,
        })
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) =>{
    if(e.key==='Enter'){

      setCursorState({
        mode:CursorMode.Chat,
        //@ts-ignore
        previousMessage:cursorState?.message,
        message:"",
      })
    } else if(e.key ==='Escape'){
      setCursorState({
        mode:CursorMode.Hidden,
      })
    }
  };
  return (
    <div className='absolute top-0 left-0'
      style={{transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`}}
      >
        {cursorState.mode === CursorMode.Chat &&(

          <>
            <CursorSVG color='#000' />

            <div className='absolute left-2 top-5 bg-amber-500 px-4 py-2 text-sm text-white rounded-4xl'
            onKeyUp={(e)=>e.stopPropagation()}
            >
              {cursorState.previousMessage && (
                <div>{cursorState.previousMessage}</div>
              )}
              <input className='z-10 w-60 border-none bg-transparent text-white outline-none'
               autoFocus={true} 
               onChange={handleChange}
               onKeyDown={handleKeyDown}
               placeholder={cursorState.previousMessage ? "": 'type a message..'}
               value={cursorState.message}
               maxLength={50}
               />

            </div>
            
          </>
        )}
    </div>
  )
}

export default CursorChat;