import React, { useRef, useState } from 'react'
import Dimensions from './settings/Dimensions';
import Text from './settings/Text';
import Color from './settings/Color';
import Export from './settings/Export';
import { RightSidebarProps } from '@/types/type';
import { modifyShape } from '@/lib/shapes';
import KeybindingsButton from './KeybindingButton';
import { cn } from '@/lib/utils';
import { CollapseButton } from './ui/collapse-button';

export const RightSideBar = ({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage  
} : RightSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <div className="relative flex justify-end">
      <section className={cn(
        'flex flex-col border-t border-primary-grey-300 bg-primary-black text-primary-grey-300 sticky right-0 h-full max-sm:hidden select-none overflow-y-auto pb-20 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-0 opacity-0 invisible' : 'min-w-[225px] w-[225px] opacity-100 visible'
      )}>
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
      <CollapseButton
        isCollapsed={isCollapsed}
        onClick={() => setIsCollapsed(!isCollapsed)}
        direction="right"
      />
    </div>
  )
}
