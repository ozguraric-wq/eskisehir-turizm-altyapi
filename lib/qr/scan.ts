import jsQR from "jsqr";
/** Decode pixels locally. No image, text or location is uploaded. */
export function decodeQrPixels(data:Uint8ClampedArray,width:number,height:number):string|null {
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>4_194_304||data.length!==width*height*4)return null;
  return jsQR(data,width,height,{inversionAttempts:"attemptBoth"})?.data??null;
}
