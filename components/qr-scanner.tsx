"use client";
import { useEffect,useRef,useState } from "react";
import { Camera, ImagePlus, Flashlight, X } from "lucide-react";
import { Dialog,DialogContent,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { qrCopy } from "@/lib/qr/copy";
import type { Locale } from "@/lib/routing/types";


export function QrScanner({locale,onRead,onError}:{locale:Locale;onRead:(value:string)=>void;onError:(value:string)=>void}) {
  const c=qrCopy(locale),[open,setOpen]=useState(false),[busy,setBusy]=useState(false),[torch,setTorch]=useState(false),[torchAvailable,setTorchAvailable]=useState(false);
  const video=useRef<HTMLVideoElement>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),stream=useRef<MediaStream|null>(null),generation=useRef(0),photo=useRef<HTMLInputElement>(null),mounted=useRef(true);
  const readRef=useRef(onRead),errorRef=useRef(onError);readRef.current=onRead;errorRef.current=onError;
  function stop(){generation.current++;if(timer.current)clearTimeout(timer.current);timer.current=null;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current)video.current.srcObject=null;}
  function close(){stop();setOpen(false);setBusy(false);setTorch(false);}
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;stop();};},[]);
  useEffect(()=>{if(!open)return;const visibility=()=>{if(document.hidden)close();};document.addEventListener("visibilitychange",visibility);return()=>document.removeEventListener("visibilitychange",visibility);},[open]);
  useEffect(()=>{
    if(!open)return;const ticket=++generation.current;let consumed=false;setBusy(true);setTorchAvailable(false);setTorch(false);
    (async()=>{
      try {
        if(!navigator.mediaDevices?.getUserMedia)throw Error("Camera unavailable");
        const {decodeQrPixels}=await import("@/lib/qr/scan");if(ticket!==generation.current)return;
        const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}},audio:false});
        if(ticket!==generation.current){media.getTracks().forEach(t=>t.stop());return;}stream.current=media;
        const element=video.current!;element.srcObject=media;await element.play();
        if(ticket!==generation.current){media.getTracks().forEach(t=>t.stop());return;}
        const track=media.getVideoTracks()[0],caps=track.getCapabilities?.() as MediaTrackCapabilities & {torch?:boolean};setTorchAvailable(!!caps?.torch);setBusy(false);
        const canvas=document.createElement("canvas"),context=canvas.getContext("2d",{willReadFrequently:true});if(!context)throw Error("Canvas unavailable");
        const scan=()=>{
          if(ticket!==generation.current||consumed)return;
          if(element.readyState>=2&&element.videoWidth){
            const scale=Math.min(1,960/Math.max(element.videoWidth,element.videoHeight));canvas.width=Math.round(element.videoWidth*scale);canvas.height=Math.round(element.videoHeight*scale);
            context.drawImage(element,0,0,canvas.width,canvas.height);const pixels=context.getImageData(0,0,canvas.width,canvas.height);
            const value=decodeQrPixels(pixels.data,pixels.width,pixels.height);
            if(value){consumed=true;close();readRef.current(value);return;}
          }
          timer.current=setTimeout(scan,250);
        };scan();
      }catch{if(ticket===generation.current){close();errorRef.current(c.permission);}}
    })();
    return stop;
  },[open,c.permission]);
  async function readPhoto(file:File|undefined){
    if(!file)return;close();onError("");setBusy(true);const ticket=++generation.current;
    let url="";
    try{
      if(!/^image\/(png|jpeg|webp|gif|bmp)$/.test(file.type)||file.size>12*1024*1024)throw Error("Unsupported image");
      const {decodeQrPixels}=await import("@/lib/qr/scan");url=URL.createObjectURL(file);
      const image=new Image();image.src=url;await image.decode();if(image.naturalWidth*image.naturalHeight>40_000_000)throw Error("Image too large");
      const scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight)),canvas=document.createElement("canvas");canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);
      const context=canvas.getContext("2d",{willReadFrequently:true});if(!context)throw Error("Canvas unavailable");context.drawImage(image,0,0,canvas.width,canvas.height);const pixels=context.getImageData(0,0,canvas.width,canvas.height);
      const value=decodeQrPixels(pixels.data,pixels.width,pixels.height);if(!value)throw Error("QR not found");
      if(mounted.current&&ticket===generation.current)onRead(value);
    }catch{if(mounted.current&&ticket===generation.current)onError(c.noQr);}
    finally{if(url)URL.revokeObjectURL(url);if(mounted.current&&ticket===generation.current)setBusy(false);if(photo.current)photo.current.value="";}
  }
  return <><div className="qr-scan-actions"><Button type="button" className="qr-camera-button" onClick={()=>{onError("");setOpen(true);}} disabled={busy&&!open}><Camera size={21}/>{c.camera}</Button><Button type="button" variant="outline" onClick={()=>photo.current?.click()} disabled={busy}><ImagePlus size={20}/>{c.photo}</Button><input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/bmp" ref={photo} onChange={e=>readPhoto(e.target.files?.[0])} hidden/></div>{busy&&!open&&<p role="status">{c.loading}</p>}<Dialog open={open} onOpenChange={value=>{if(!value)close();}}><DialogContent className="qr-camera-dialog" showCloseButton={false} dir={locale==="ar"?"rtl":"ltr"}><div className="qr-sheet-heading"><DialogTitle>{c.camera}</DialogTitle><Button variant="ghost" size="icon" aria-label={c.close} onClick={close}><X size={22}/></Button></div><DialogDescription>{c.cameraHint}</DialogDescription><div className="qr-viewfinder"><video ref={video} autoPlay muted playsInline aria-label={c.camera}/><div className="qr-frame" aria-hidden="true"/>{busy&&<span role="status">{c.loading}</span>}</div>{torchAvailable&&<Button variant="outline" type="button" aria-pressed={torch} onClick={async()=>{try{await stream.current?.getVideoTracks()[0]?.applyConstraints({advanced:[{torch:!torch} as MediaTrackConstraintSet]});setTorch(!torch);}catch{setTorchAvailable(false);}}}><Flashlight size={20}/>{c.torch}</Button>}</DialogContent></Dialog></>;
}
