import React, { useRef } from 'react'
import Dimensions from './settings/Dimensions';
import Text from './settings/Text';
import Color from './settings/Color';
import Export from './settings/Export';
import { RightSidebarProps } from '@/types/type';
import { modifyShape } from '@/lib/shapes';
import KeybindingsButton from './KeybindingButton';

export const RightSideBar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage  
} : RightSidebarProps) => {
  
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);



  const handleInputChange = (property :string,value : string ) =>{
    if(!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev)=>({
      ...prev,
      [property]:value,
    }))
    modifyShape({
      canvas:fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage
    })
  }

  return (
    <section className='flex flex-col border-t border-primary-grey-300 bg-primary-black text-primary-grey-300 min-2-[225px] sticky left-0 h-fullmax-sm:hidden select-none overflow-y-auto pb-20'>
      <h3 className="px-5 pt-4 text-xs uppercase">Elements</h3>
      <span></span>

      <Dimensions 
        width={elementAttributes.width}
        height={elementAttributes.height}
        handleInputChange={handleInputChange}
        isEditingRef={isEditingRef}
        />
      <Text 
       fontFamily={elementAttributes.fontFamily}
       fontSize={elementAttributes.fontSize}
       fontWeight={elementAttributes.fontWeight}
       handleInputChange={handleInputChange}
       />
       
      <Color 
        inputRef={colorInputRef}
        attribute={elementAttributes.fill}
        handleInputChange={handleInputChange}
        attributeType='fill'
        placeholder='color'
      />
      <Color 
        inputRef={strokeInputRef}
        attribute={elementAttributes.stroke}
        handleInputChange={handleInputChange}
        attributeType='stroke'
        placeholder='stroke'
      />
      <Export />
      <KeybindingsButton />
      
    </section>
  )
}
