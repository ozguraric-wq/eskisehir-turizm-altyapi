"use client";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { useEffect,useState } from "react";
import { Compass,Route,Bookmark,Building2,WifiOff,ScanLine,Globe2,Users,UserRound,ArrowLeft,Check,X } from "lucide-react";
import { Sheet,SheetContent,SheetTitle,SheetDescription,SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { isNativeApp } from "@/lib/mobile/native";
import { mobileCopy } from "@/lib/mobile/copy";
import {useSocial} from "./social-provider";
import { Backpack } from "lucide-react";
import { socialCopy } from "@/lib/social/copy";
import { qrCopy } from "@/lib/qr/copy";
import { parseQrInput,targetPath } from "@/lib/qr/links";
import { siteAsset } from "@/lib/site-path";
import type { Locale } from "@/lib/routing/types";
import { MobileHome } from "./mobile-home";
const languages=[['tr','Türkçe'],['en','English'],['de','Deutsch'],['fr','Français'],['ar','العربية']] as const;
export function MobileShell(){
  const {status}=useSocial();
  const pathname=usePathname(),router=useRouter(),first=pathname.split("/").filter(Boolean)[0];
  const locale=(["en","de","fr","ar"].includes(first)?first:"tr") as Locale;
  const c=mobileCopy(locale),q=qrCopy(locale),sc=socialCopy(locale),base=locale==="tr"?"":`/${locale}`;
  const [enabled,setEnabled]=useState(process.env.NEXT_PUBLIC_MOBILE_APP==="true"),[offline,setOffline]=useState(false),[languageOpen,setLanguageOpen]=useState(false),[section,setSection]=useState("");
  const isHome=pathname.replace(/\/$/,"")===(base||"");
  useEffect(()=>{const sync=()=>{const hash=location.hash.slice(1);const value=isHome&&["institution","impact","heritage","programmes","routes"].includes(hash)?hash:"";setSection(value);document.documentElement.dataset.appSection=value;};sync();window.addEventListener("hashchange",sync);return()=>window.removeEventListener("hashchange",sync);},[pathname,isHome]);
  useEffect(()=>{
    const media=matchMedia("(display-mode: standalone)");
    const sync=()=>{let preview=false;try{if(new URLSearchParams(location.search).get("app")==="1")sessionStorage.setItem("etahb-app-preview","1");preview=sessionStorage.getItem("etahb-app-preview")==="1";}catch{}const active=isNativeApp()||media.matches||(navigator as Navigator & {standalone?:boolean}).standalone===true||preview||process.env.NEXT_PUBLIC_MOBILE_APP==="true";setEnabled(active);document.documentElement.toggleAttribute("data-mobile-app",active);};
    const online=()=>setOffline(!navigator.onLine);sync();online();media.addEventListener("change",sync);window.addEventListener("online",online);window.addEventListener("offline",online);
    if("serviceWorker" in navigator&&!isNativeApp()&&window.isSecureContext)navigator.serviceWorker.register(siteAsset("/sw.js"),{scope:siteAsset("/")}).catch(()=>{});
    let disposed=false;const listeners:{remove:()=>Promise<void>}[]=[];
    if(isNativeApp())import("@capacitor/app").then(async({App})=>{
      const register=async(p:Promise<{remove:()=>Promise<void>}>)=>{const h=await p;if(disposed)h.remove();else listeners.push(h);};
      await register(App.addListener("backButton",({canGoBack})=>{if(document.querySelector('[role="dialog"]')){document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));return;}if(canGoBack)history.back();else App.minimizeApp();}));
      const open=(url:string)=>{const target=parseQrInput(url);if(target){let lang:Locale="tr";try{const saved=localStorage.getItem("etahb-app-language");if(["en","de","fr","ar"].includes(saved??""))lang=saved as Locale;}catch{}const destination=targetPath(target,lang),[route,hash]=destination.split("#");if(location.pathname.replace(/\/$/,"")===route)location.hash=hash??"";else router.push(destination);}};
      await register(App.addListener("appUrlOpen",({url})=>open(url)));
      const launch=await App.getLaunchUrl();if(!disposed&&launch?.url)open(launch.url);
    });
    return()=>{disposed=true;listeners.forEach(h=>h.remove());media.removeEventListener("change",sync);window.removeEventListener("online",online);window.removeEventListener("offline",online);};
  },[router]);
  useEffect(()=>{if(enabled){try{localStorage.setItem("etahb-app-language",locale);}catch{}}},[locale,enabled]);
  if(!enabled)return null;
  const tabs=[{href:base||"/",label:q.home,Icon:Compass},{href:`${base}/rotani-olustur`,label:q.route,Icon:Route},{href:`${base}/qr`,label:q.scan,Icon:ScanLine,scan:true},{href:`${base}/topluluk`,label:sc.community,Icon:Users},{href:`${base}/profil`,label:status?.demoMode!==false?({tr:'Çantam',en:'My kit',de:'Reisetasche',fr:'Carnet',ar:'حقيبتي'}[locale]):sc.profile,Icon:status?.demoMode!==false?Backpack:UserRound}];
  function switchLanguage(lang:Locale){const leaf=pathname.replace(/^\/(en|de|fr|ar)(?=\/|$)/,"");const target=["/qr","/birlik","/rotani-olustur","/gezilerim","/lezzet-ve-miras","/topluluk","/profil","/hizmetler","/etkinlikler","/sehir-rehberi"].find(path=>leaf.replace(/\/$/,"")===path)??"";setLanguageOpen(false);router.push(`${lang==="tr"?"":`/${lang}`}${target||"/"}${target?location.hash:""}`);}
  const resetHome=()=>{setSection("");document.documentElement.dataset.appSection="";};
  return <><a className="skip-link" href={isHome&&!section?"#app-ana-icerik":"#ana-icerik"}>{q.skip}</a><header className="app-topbar" dir={locale==="ar"?"rtl":"ltr"}>{isHome&&!section?<Link className="app-wordmark" href={base||"/"} onClick={resetHome}><img src={siteAsset("/brand/logo-mark.webp")} alt="" width={32} height={40}/><span>Eskişehir <strong>Cebimde</strong></span></Link>:<><Link className="app-header-back" href={base||"/"} onClick={resetHome} aria-label={q.home}><ArrowLeft size={23}/></Link><Link className="app-wordmark compact" href={base||"/"} onClick={resetHome}>Eskişehir <strong>Cebimde</strong></Link></>}<Button type="button" variant="ghost" className="app-language-button" aria-label={q.language} onClick={()=>setLanguageOpen(true)}><Globe2 size={21}/><span>{locale.toUpperCase()}</span></Button></header>{offline&&<div className="app-offline" role="status" dir={locale==="ar"?"rtl":"ltr"}><WifiOff size={16}/>{c.offline}</div>}{isHome&&!section&&<MobileHome locale={locale}/>}<nav className="app-tabbar rp-no-print" aria-label={c.app} dir={locale==="ar"?"rtl":"ltr"}>{tabs.map(({href,label,Icon,scan})=>{const selected=href.includes("#")?section==="institution":!section&&pathname.replace(/\/$/,"")===href.replace(/\/$/,"");return <Link key={label} href={href} onClick={()=>{if(href===(base||"/"))resetHome();}} className={scan?"app-tab-scan":""} aria-current={selected?"page":undefined}><span className="app-tab-icon"><Icon size={23} aria-hidden="true"/></span><span>{label}</span></Link>;})}</nav><Sheet open={languageOpen} onOpenChange={setLanguageOpen}><SheetContent side="bottom" className="app-language-sheet" showCloseButton={false} dir={locale==="ar"?"rtl":"ltr"}><div className="qr-sheet-heading"><div><SheetTitle>{q.language}</SheetTitle><SheetDescription>Eskişehir Cebimde</SheetDescription></div><SheetClose asChild><Button variant="ghost" size="icon" aria-label={q.close}><X size={22}/></Button></SheetClose></div>{languages.map(([lang,name])=><Button type="button" key={lang} variant="ghost" className="app-language-choice" onClick={()=>switchLanguage(lang)} aria-current={lang===locale?"true":undefined}>{name}{lang===locale&&<Check size={19}/>}</Button>)}</SheetContent></Sheet></>;
}
