"use client";
import Live from "@/components/Live";
import "./globals.css"
import Navbar from "@/components/Navbar";
import { RightSideBar } from "@/components/RightSideBar";
import {fabric} from 'fabric'
import { useEffect, useRef, useState } from "react";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectScaling, handleCanvasSelectionCreated, handlePathCreated, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";
import LeftSidebar from "@/components/LeftSidebar";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { defaultNavElement } from "@/constants";
import { handleImageUpload } from "@/lib/shapes";

export default function Page() {
  const undo = useUndo();
  const redo = useRedo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string |null >(null);
  const activeObjectRef =useRef<fabric.Object | null>(null);
  const canvasObjects = useStorage((root) => root.canvasObjects);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);
  
  
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value:'',
    icon:'',
  })

  const [elementAttributes,setElementAttributes] = useState<Attributes>({
    width:'',
    height: '',
    fontSize:'',
    fontFamily: '',
    fontWeight : '',
    fill: '#aabbcc',
    stroke:'#aabbcc'

  })
  const deleteAllShapes =useMutation(({storage}) =>{
      const canvasObjects = storage.get("canvasObjects");

      if(!canvasObjects ||  canvasObjects.size === 0)
        return true;
      for (const [key,value] of canvasObjects.entries()){
        canvasObjects.delete(key)
      }
      
      return canvasObjects.size === 0;

      
  } ,[])

  const deleteShapeFromStorage =useMutation(({storage},objectId) =>{
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(objectId);
  },[])
  
  const handleActiveElement = (elem : ActiveElement) =>{
    setActiveElement(elem)

    switch (elem?.value){
      case 'reset':
         deleteAllShapes()
         fabricRef.current?.clear();
         setActiveElement(defaultNavElement)
         break;
      case 'delete':
        handleDelete(fabricRef.current as any,deleteShapeFromStorage)
        setActiveElement(defaultNavElement)
        break;
      case 'image':
        imageInputRef.current?.click();
        isDrawing.current = false;
        if(fabricRef.current){
          fabricRef.current.isDrawingMode =false
        }
        break;

      default:
         break;
    }
    selectedShapeRef.current = elem?.value as string;
  } ;

  useEffect(() => {
    const canvas = initializeFabric({canvasRef,fabricRef})
    
    canvas.on('mouse:down', (options :any) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
      
    })
    canvas.on('mouse:move', (options :any) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage
      });
    });
    canvas.on('mouse:up', (options :any) => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef
      });
    });

    canvas.on("object:modified",(options :any) =>{
      handleCanvasObjectModified({
        options,
        syncShapeInStorage
      })
    })

    canvas.on("selection:created",(options :any) =>{
        handleCanvasSelectionCreated({
          options,isEditingRef,setElementAttributes
        })
    })

    canvas.on("object:scaling", (options:any)=>{
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
        
      })
    })

    canvas.on("path:created", (options:any)=>{
      handlePathCreated({
        options,
        syncShapeInStorage,
        
      })
    })

    window.addEventListener("resize",()=>{
      handleResize({fabricRef})
    })

    window.addEventListener("keydown",(e:KeyboardEvent)=>{
      handleKeyDown({
        e,
        canvas:fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage
  
      })
  })

    return () =>{
      canvas.dispose();
        }
      }, [])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef
    })

  }, [canvasObjects])
  
  
  
  const syncShapeInStorage = useMutation(({ storage }, object) => {
    // if the passed object is null, return
    if (!object) return;
    const { objectId } = object;

    // Turn Fabric object into JSON format so that we can store it in the map
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");
    //  set is a method provided by Liveblocks that allows you to set a value
     
    canvasObjects.set(objectId, shapeData);
  }, []);
  
  
  return (
    <main className="h-screen overflow-hidden">
      <Navbar  
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e:any) =>{
          e.stopPropagation();

          handleImageUpload({
            file : e.target.files[0],
            canvas:fabricRef as any,
            shapeRef,
            syncShapeInStorage
          })
        }}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar allShapes ={Array.from(canvasObjects.entries())}/>
         {/* //array from used its map  */}
        <Live canvasRef={canvasRef}/>
        <RightSideBar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef = {fabricRef}
          isEditingRef = {isEditingRef}
          activeObjectRef = {activeObjectRef}
          syncShapeInStorage = {syncShapeInStorage}
         
          />

      </section>
    </main>
  );
}