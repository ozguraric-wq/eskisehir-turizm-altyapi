import { qrByCode } from "./registry";
export const QR_HISTORY_KEY="etahb-qr-history-v1";
export function readQrHistory():string[]{
  try{const raw=JSON.parse(localStorage.getItem(QR_HISTORY_KEY)??"[]");return Array.isArray(raw)?[...new Set(raw.filter((v):v is string=>typeof v==="string"&&Object.hasOwn(qrByCode,v)))].slice(0,12):[];}catch{return [];}
}
export function rememberQr(code:string){if(!Object.hasOwn(qrByCode,code))return;try{localStorage.setItem(QR_HISTORY_KEY,JSON.stringify([code,...readQrHistory().filter(c=>c!==code)].slice(0,12)));}catch{/* Reading the guide remains possible without storage. */}}
