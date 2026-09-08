"use client";
import { useEffect,useRef,useState } from "react";
import { ArrowUp,Check,ChevronDown,LoaderCircle,MessageCircle,RotateCcw,Sparkles } from "lucide-react";
import { mobileCopy } from "@/lib/mobile/copy";
import { type AssistantProposal,assistantOutputSchema } from "@/lib/mobile/assistant-contract";
import { copyFor } from "@/lib/routing/copy";
import { CATALOG_VERSION,placeById } from "@/lib/routing/data";
import { clock,normalizePreferences } from "@/lib/routing/engine";
import { siteAsset } from "@/lib/site-path";
import type { Locale,Preferences } from "@/lib/routing/types";

export function LiveRouteAssistant({locale,preferences,onApply}:{locale:Locale;preferences:Preferences;onApply:(p:Preferences)=>void}) {
  const c=mobileCopy(locale),rc=copyFor(locale);
  const [ready,setReady]=useState(false),[base,setBase]=useState("");
  const [expanded,setExpanded]=useState(false),[message,setMessage]=useState("");
  const [busy,setBusy]=useState(false),[error,setError]=useState("");
  const [history,setHistory]=useState<{role:"user"|"assistant";content:string}[]>([]);
  const [proposal,setProposal]=useState<AssistantProposal|null>(null);
  const [username,setUsername]=useState(""),[password,setPassword]=useState("");
  const [signedIn,setSignedIn]=useState(false),token=useRef("");
  const abort=useRef<AbortController|null>(null),result=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const controller=new AbortController();let disposed=false;
    async function load(){try{
      let api=process.env.NEXT_PUBLIC_AI_BASE_URL??"";
      if(!api){const response=await fetch(siteAsset("/mobile-config.json"),{cache:"no-store",signal:controller.signal});if(response.ok) api=String((await response.json()).apiBaseUrl??"");}
      if(!api && location.hostname.endsWith(".chatgpt.site"))api=location.origin;
      if(!api)return;
      const url=new URL(api);if(url.protocol!=="https:" || url.username || url.password || url.pathname!=="/" || url.search || url.hash)return;
      const response=await fetch(`${url.origin}/api/mobile/status`,{signal:controller.signal});
      const status=await response.json();
      if(!disposed){setBase(url.origin);setReady(response.ok && status.ready===true && status.catalogVersion===CATALOG_VERSION);}
    }catch{if(!disposed)setReady(false);}}
    load();return()=>{disposed=true;controller.abort();abort.current?.abort();token.current="";};
  },[]);
  async function login(e:React.FormEvent){e.preventDefault();if(busy)return;setBusy(true);setError("");abort.current?.abort();const controller=new AbortController();abort.current=controller;
    try{const response=await fetch(`${base}/api/mobile/session`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password}),signal:controller.signal});const data=await response.json();if(!response.ok||typeof data.token!=="string")throw Error();token.current=data.token;setSignedIn(true);setPassword("");}
    catch{if(!controller.signal.aborted)setError(c.aiError);}finally{if(!controller.signal.aborted)setBusy(false);}
  }
  async function send(e:React.FormEvent){e.preventDefault();if(!message.trim()||busy)return;const sent=message.trim();setBusy(true);setError("");setProposal(null);abort.current?.abort();const controller=new AbortController();abort.current=controller;
    try{
      const response=await fetch(`${base}/api/mobile/assist`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token.current}`},body:JSON.stringify({message:sent,locale,preferences,catalogVersion:CATALOG_VERSION,history:history.slice(-8)}),signal:controller.signal});
      if(response.status===401){token.current="";setSignedIn(false);throw Error();}
      const data=await response.json();
      if(!response.ok||data.provider!=="openai"||data.catalogVersion!==CATALOG_VERSION||!Array.isArray(data.sources)||!Array.isArray(data.warnings))throw Error();
      const parsed=assistantOutputSchema.safeParse({action:data.action,message:data.message,preferences:data.preferences,sourcePlaceIds:data.sources.map((s:{id:string})=>s.id)});
      if(!parsed.success)throw Error();
      const safe:AssistantProposal={...data,preferences:normalizePreferences(parsed.data.preferences),sources:parsed.data.sourcePlaceIds.map(id=>({id,name:placeById[id].name,url:placeById[id].source})),warnings:data.warnings.filter((w:unknown)=>typeof w==="string").slice(0,3)};
      setProposal(safe);setHistory(h=>[...h,{role:"user",content:sent},{role:"assistant",content:safe.message}].slice(-8) as typeof h);setMessage("");requestAnimationFrame(()=>result.current?.focus({preventScroll:true}));
    }catch{if(!controller.signal.aborted)setError(c.aiError);}finally{if(!controller.signal.aborted)setBusy(false);}
  }
  return <section className="app-assistant rp-no-print" aria-label={c.assistant}>
    <button type="button" className="app-assistant-heading" aria-expanded={expanded} aria-controls={`ai-body-${locale}`} onClick={()=>setExpanded(!expanded)}><span className="app-assistant-icon"><MessageCircle size={22}/></span><span><strong>{c.assistant}</strong><small>{ready?c.aiReady:c.aiPending}</small></span><ChevronDown size={19} className={expanded?"rotated":""}/></button>
    <div id={`ai-body-${locale}`} hidden={!expanded} className="app-assistant-body">
      {!ready?<p>{c.aiPendingHint}</p>:<>
        {!signedIn?<form onSubmit={login} className="app-ai-login"><p>{c.login}</p><label>{c.user}<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required maxLength={100}/></label><label>{c.password}<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required maxLength={200}/></label><button className="app-primary" disabled={busy} type="submit">{busy?<LoaderCircle className="app-spin" size={18}/>:<Sparkles size={18}/>} {c.login}</button></form>:<>
          <p>{c.aiHint}</p>
          {history.length>0&&<details className="app-conversation"><summary>{c.assistant} · {history.length/2}</summary>{history.map((m,i)=><p key={i} className={m.role}>{m.content}</p>)}<button type="button" onClick={()=>{setHistory([]);setProposal(null);}}><RotateCcw size={15}/>{c.clear}</button></details>}
          <form onSubmit={send} className="app-ai-prompt"><label className="sr-only" htmlFor={`ai-message-${locale}`}>{c.aiHint}</label><textarea id={`ai-message-${locale}`} rows={3} value={message} onChange={e=>setMessage(e.target.value)} placeholder={c.prompt} maxLength={1500}/><button type="submit" className="app-primary" disabled={busy||message.trim().length<2}>{busy?<LoaderCircle size={18} className="app-spin"/>:<ArrowUp size={18}/>} {busy?c.thinking:c.send}</button><small>{c.consent}</small></form>
          {proposal&&<div className="app-ai-proposal" ref={result} tabIndex={-1}><p>{proposal.message}</p>{proposal.action==="plan"&&<><div className="app-chips"><span>{proposal.preferences.days} {rc.day}</span><span>{rc[proposal.preferences.mode]}</span><span>{clock(proposal.preferences.start)}–{clock(proposal.preferences.end)}</span><span>{rc[proposal.preferences.meal]}</span>{proposal.preferences.districts.map(d=><span key={d}>{d}</span>)}{proposal.preferences.required?.map(id=><span key={id}><Check size={13}/>{placeById[id].name}</span>)}</div><p className="app-small">{c.verify}</p>{proposal.warnings.map(w=><p key={w} role="status">{w}</p>)}<button type="button" className="app-primary" disabled={proposal.planCount<1} onClick={()=>onApply(proposal.preferences)}>{c.apply}</button></>}{proposal.sources.length>0&&<details><summary>{c.sources}</summary>{proposal.sources.map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer">{s.name}</a>)}</details>}</div>}
        </>}
      </>}
      {error&&<p className="app-error" role="alert">{error}</p>}
    </div>
  </section>;
}
