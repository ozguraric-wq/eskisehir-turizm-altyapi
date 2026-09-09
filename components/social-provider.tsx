'use client';
import {createContext,useContext,useEffect,useState,useCallback,useRef} from 'react';
import {socialApi,restoreSession,finishSocialLogin,AUTH_EVENT,SocialClientError,ensureDemoSession} from '@/lib/social/client';
import {isNativeApp} from '@/lib/mobile/native';
import type {Profile,ApiStatus} from '@/lib/social/types';
type Kit={favorites:string[];checked:string[]};
const Context=createContext<{kit:Kit;toggleKit:(kind:'place'|'check',ref:string,selected:boolean)=>Promise<void>;profile:Profile|null;status:ApiStatus|null;loading:boolean;error:string;refresh:()=>Promise<void>}>({kit:{favorites:[],checked:[]},toggleKit:async()=>{},profile:null,status:null,loading:true,error:'',refresh:async()=>{}});
export function SocialProvider({children}:{children:React.ReactNode}){
 const [kit,setKit]=useState<Kit>({favorites:[],checked:[]});
 const toggleKit=useCallback(async(kind:'place'|'check',ref:string,selected:boolean)=>{await socialApi('/kit','PUT',{kind,ref,selected});setKit(old=>{const key=kind==='place'?'favorites':'checked';return {...old,[key]:selected?[...new Set([...old[key],ref])]:old[key].filter(x=>x!==ref)};});},[]);
 const consumed=useRef(new Set<string>());
 const [profile,setProfile]=useState<Profile|null>(null),[status,setStatus]=useState<ApiStatus|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const refresh=useCallback(async()=>{try{const s=await socialApi<ApiStatus>('/status');setStatus(s);if(s.ready){let me=await socialApi<{profile:Profile|null}>('/me');if(s.demoMode&&!me.profile?.demo){await ensureDemoSession();me=await socialApi<{profile:Profile|null}>('/me');}setProfile(me.profile);if(me.profile&&!me.profile.id.startsWith('sites:'))setKit(await socialApi<Kit>('/kit'));}setError('');}catch(e){setError(e instanceof SocialClientError?e.code:'service_unavailable');}finally{setLoading(false);}},[]);
 useEffect(()=>{let disposed=false;const listeners:{remove:()=>Promise<void>}[]=[];
  const handle=async(code:string)=>{if(consumed.current.has(code))return;consumed.current.add(code);try{await finishSocialLogin(code);if(!disposed)await refresh();}catch(e){if(!disposed)setError(e instanceof SocialClientError?e.code:'oauth_failed');}};
  restoreSession().then(async()=>{if(disposed)return;const code=new URLSearchParams(location.hash.slice(1)).get('auth');if(code){history.replaceState(null,'',location.pathname+location.search);await handle(code);}else await refresh();});
  if(isNativeApp())import('@capacitor/app').then(async({App})=>{const open=(url:string)=>{try{const u=new URL(url);if(u.protocol==='etahb:'&&u.hostname==='auth'&&!u.username&&!u.password&&[...u.searchParams.keys()].length===1){const code=u.searchParams.get('code');if(code)void handle(code);}}catch{}};const listener=await App.addListener('appUrlOpen',({url})=>open(url));if(disposed)listener.remove();else listeners.push(listener);const launch=await App.getLaunchUrl();if(!disposed&&launch?.url)open(launch.url);});
  const change=()=>void refresh();window.addEventListener(AUTH_EVENT,change);return()=>{disposed=true;listeners.forEach(l=>l.remove());window.removeEventListener(AUTH_EVENT,change);};
 },[refresh]);
 return <Context.Provider value={{profile,status,loading,error,refresh,kit,toggleKit}}>{children}</Context.Provider>;
}
export const useSocial=()=>useContext(Context);
