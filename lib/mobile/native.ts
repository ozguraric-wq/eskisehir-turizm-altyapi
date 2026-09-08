import { Capacitor,registerPlugin } from "@capacitor/core";
const TripPrint=registerPlugin<{print(options:{html:string;title:string}):Promise<void>}>("TripPrint");
export async function printNativeHtml(html:string,title:string) { if(!isNativeApp())return false;await TripPrint.print({html,title});return true; }
export async function imageDataUrl(url:string) {
  const response=await fetch(url);if(!response.ok)throw Error("Logo unavailable");const blob=await response.blob();
  return new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob);});
}

export function isNativeApp() { return Capacitor.isNativePlatform(); }
export async function shareNativeFile(filename: string, content: string, title: string): Promise<boolean> {
  if (!isNativeApp()) return false;
  const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([import("@capacitor/filesystem"),import("@capacitor/share")]);
  const safeName=filename.replace(/[^a-zA-Z0-9._-]/g,"-");
  const file=await Filesystem.writeFile({path:safeName,data:content,directory:Directory.Cache,encoding:Encoding.UTF8});
  await Share.share({title,files:[file.uri],dialogTitle:title});
  return true;
}
export async function shareNativeUrl(url: string, title: string): Promise<boolean> {
  if (!isNativeApp()) return false;
  const { Share }=await import("@capacitor/share");
  await Share.share({url,title,dialogTitle:title}); return true;
}
