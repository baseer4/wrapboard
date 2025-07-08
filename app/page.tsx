"use client";
import Live from "@/components/Live";
import "./globals.css"
import Navbar from "@/components/Navbar";
import { RightSideBar } from "@/components/RightSideBar";
import {fabric} from 'fabric'
import { useEffect, useRef, useState } from "react";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleCanvasMouseUp, handleResize, initializeFabric, renderCanvas } from "@/lib/canvas";
import { ActiveElement } from "@/types/type";
import LeftSidebar from "@/components/LeftSidebar";
import { useMutation, useStorage } from "@/liveblocks.config";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string |null >('rectangle');
  const activeObjectRef =useRef<fabric.Object | null>(null);
  const canvasObjects = useStorage((root) => root.canvasObjects);

  
  
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value:'',
    icon:'',
  })
  
  const handleActiveElement = (elem : ActiveElement) =>{
    setActiveElement(elem)
    selectedShapeRef.current = elem?.value as string;
  } ;

  useEffect(() => {
    const canvas = initializeFabric({canvasRef,fabricRef})
    
    canvas.on('mouse:down', (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
      });
      
    })
    canvas.on('mouse:move', (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        shapeRef,
        selectedShapeRef,
        syncShapeInStorage
      });
    });
    canvas.on('mouse:up', (options) => {
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
    window.addEventListener("resize",()=>{
      handleResize({fabricRef})
    })
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
      />

      <section className="flex h-full flex-row">
        <LeftSidebar/>
        <Live canvasRef={canvasRef}/>
        <RightSideBar/>

      </section>
    </main>
  );
}