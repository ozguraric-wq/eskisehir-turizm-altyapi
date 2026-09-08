"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect,useState } from "react";
import { Home,Compass,Route,Bookmark,Building2,WifiOff } from "lucide-react";
import { isNativeApp } from "@/lib/mobile/native";
import { mobileCopy } from "@/lib/mobile/copy";
import { siteAsset } from "@/lib/site-path";
import type { Locale } from "@/lib/routing/types";

export function MobileShell() {
  const pathname=usePathname();
  const first=pathname.split("/").filter(Boolean)[0];
  const locale=(["en","de","fr","ar"].includes(first)?first:"tr") as Locale;
  const c=mobileCopy(locale),base=locale==="tr"?"":`/${locale}`;
  const [enabled,setEnabled]=useState(process.env.NEXT_PUBLIC_MOBILE_APP==="true");
  const [offline,setOffline]=useState(false);
  useEffect(()=>{
    const media=matchMedia("(display-mode: standalone)");
    const sync=()=>{
      let preview=false; try { if(new URLSearchParams(location.search).get("app")==="1") sessionStorage.setItem("etahb-app-preview","1"); preview=sessionStorage.getItem("etahb-app-preview")==="1"; }catch{}
      const active=isNativeApp()||media.matches||preview||process.env.NEXT_PUBLIC_MOBILE_APP==="true";
      setEnabled(active); document.documentElement.toggleAttribute("data-mobile-app",active);
    };
    const online=()=>setOffline(!navigator.onLine);
    sync();online();media.addEventListener("change",sync);window.addEventListener("online",online);window.addEventListener("offline",online);
    if("serviceWorker" in navigator && !isNativeApp() && process.env.NEXT_PUBLIC_GITHUB_PAGES==="true") navigator.serviceWorker.register(siteAsset("/sw.js"),{scope:siteAsset("/")}).catch(()=>{});
    let disposed=false; let listener:{remove:()=>Promise<void>}|undefined;
    if(isNativeApp()) import("@capacitor/app").then(async({App})=>{
      const handle=await App.addListener("backButton",({canGoBack})=>{if(document.querySelector('[role="dialog"]')){document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));return;}if(canGoBack) history.back();else App.minimizeApp();});
      if(disposed) handle.remove(); else listener=handle;
    });
    return ()=>{disposed=true;listener?.remove();media.removeEventListener("change",sync);window.removeEventListener("online",online);window.removeEventListener("offline",online);};
  },[]);
  if(!enabled)return null;
  const tabs=[{href:base||"/",label:c.home,Icon:Home},{href:`${base}/lezzet-ve-miras`,label:c.explore,Icon:Compass},{href:`${base}/rotani-olustur`,label:c.route,Icon:Route},{href:`${base}/gezilerim`,label:c.trips,Icon:Bookmark},{href:locale==="tr"?"/kurumsal":`${base}#institution`,label:c.more,Icon:Building2}];
  return <>{offline&&<div className="app-offline" role="status" dir={locale==="ar"?"rtl":"ltr"}><WifiOff size={16}/>{c.offline}</div>}<nav className="app-tabbar rp-no-print" aria-label={c.app} dir={locale==="ar"?"rtl":"ltr"}>{tabs.map(({href,label,Icon})=>{const selected=pathname.replace(/\/$/,"")===href.replace(/\/$/,"");return <Link key={label} href={href} aria-current={selected?"page":undefined}><Icon size={22} aria-hidden="true"/><span>{label}</span></Link>})}</nav></>;
}
