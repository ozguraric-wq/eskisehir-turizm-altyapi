"use client";
import { useEffect, useState } from "react";
import { QrCode, Share2, Printer, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { qrCopy } from "@/lib/qr/copy";
import { printNativeHtml, shareNativeUrl } from "@/lib/mobile/native";
import type { Locale } from "@/lib/routing/types";

export function QrShare({url,title,code,locale="tr",className=""}:{url:string|(()=>string);title:string;code?:string;locale?:Locale;className?:string}) {
  const c=qrCopy(locale),[open,setOpen]=useState(false),[image,setImage]=useState(""),[notice,setNotice]=useState(""),[resolvedUrl,setResolvedUrl]=useState("");
  useEffect(()=>{if(!open)return;let active=true;setImage("");setNotice("");setResolvedUrl("");Promise.resolve().then(()=>{const value=typeof url==="function"?url():url;if(active)setResolvedUrl(value);return import("qrcode").then(({default:QR})=>QR.toDataURL(value,{errorCorrectionLevel:value.length>900?"M":"Q",margin:4,width:720,color:{dark:"#101820",light:"#ffffff"}}));}).then(data=>{if(active)setImage(data);}).catch(()=>{if(active)setNotice(c.invalid);});return()=>{active=false;};},[open,url,c.invalid]);
  async function share(){try{if(await shareNativeUrl(resolvedUrl,title))return;if(navigator.share){await navigator.share({title,url:resolvedUrl});return;}await navigator.clipboard.writeText(resolvedUrl);setNotice(c.copied);}catch(e){if((e as Error).name!=="AbortError")setNotice(c.copyFailed);}}
  async function print(){
    const escape=(s:string)=>s.replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]!));
    const html=`<!doctype html><html lang="${locale}" dir="${locale==="ar"?"rtl":"ltr"}"><head><meta charset="utf-8"><title>${escape(title)}</title><style>@page{size:A5;margin:16mm}body{font:16px Arial,sans-serif;color:#101820;text-align:center;line-height:1.6}header{font-size:13px;letter-spacing:2px;border-bottom:1px solid #ddd;padding-bottom:16px}h1{font-size:27px;line-height:1.3;margin:28px 0 10px}img{width:82mm;height:82mm;max-width:100%;display:block;margin:10px auto}strong{font-size:23px;letter-spacing:3px}small{display:block;font-size:11px;overflow-wrap:anywhere}footer{border-top:1px solid #ddd;padding-top:18px;margin-top:20px;font-size:12px}</style></head><body><header>ESKİŞEHİR CEBİMDE · 2026</header><h1>${escape(title)}</h1><p>${escape(c.intro)}</p><img src="${image}" alt="QR"><strong>${escape(code??"")}</strong><small>${escape(resolvedUrl)}</small><footer>Eskişehir Turizm Altyapı Hizmet Birliği<br>Vizyon Eskişehir 2036</footer></body></html>`;
    try {if(await printNativeHtml(html,title))return;
      const frame=document.createElement("iframe");frame.className="qr-print-frame";frame.title=c.print;
      frame.onload=async()=>{const win=frame.contentWindow;if(!win)return;await Promise.all(Array.from(win.document.images).map(img=>img.decode().catch(()=>{})));win.addEventListener("afterprint",()=>frame.remove(),{once:true});win.focus();win.print();setTimeout(()=>frame.remove(),60000);};
      frame.srcdoc=html;document.body.appendChild(frame);
    }catch{setNotice(c.copyFailed);}
  }
  return <><Button type="button" variant="ghost" className={`qr-share-trigger ${className}`} onClick={()=>setOpen(true)}><QrCode size={18}/>{c.qrShare}</Button><Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom" className="qr-share-sheet" showCloseButton={false} dir={locale==="ar"?"rtl":"ltr"}><div className="qr-sheet-heading"><div><SheetTitle>{title}</SheetTitle><SheetDescription>{c.qrShare}</SheetDescription></div><SheetClose asChild><Button variant="ghost" size="icon" aria-label={c.close}><X size={22}/></Button></SheetClose></div><div className="qr-code-display">{image?<img src={image} alt={`${c.qrShare}: ${title}`} width={320} height={320}/>:<p role="status">{notice||c.loading}</p>}{code&&<strong>{code}</strong>}</div><div className="qr-share-actions"><Button type="button" onClick={share} disabled={!image}><Share2 size={17}/>{c.share}</Button><Button type="button" variant="outline" disabled={!image} onClick={print}><Printer size={17}/>{c.print}</Button></div>{notice&&<p role="status" className="qr-notice">{notice}</p>}<Input dir="ltr" readOnly value={resolvedUrl} aria-label={c.share} onFocus={e=>e.target.select()} className="qr-link-field"/></SheetContent></Sheet></>;
}
