'use client';
import Link from 'next/link';
import {useState} from 'react';
import {Bookmark,Check,Backpack} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Progress} from '@/components/ui/progress';
import {useSocial} from './social-provider';
import {demoCopy} from '@/lib/social/demo-copy';
import {socialCopy,socialError} from '@/lib/social/copy';
import {SocialClientError} from '@/lib/social/client';
import {kitItems} from '@/lib/social/demo';
import {placeById} from '@/lib/routing/data';
import {qrPath} from '@/lib/qr/links';
import {codeFor} from '@/lib/qr/registry';
import type {Locale} from '@/lib/routing/types';

export function SavePlaceButton({placeId,locale}:{placeId:string;locale:Locale}){
 const d=demoCopy(locale),{kit,toggleKit,profile,loading}=useSocial(),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const selected=kit.favorites.includes(placeId);
 return <span className="sc-bookmark-wrap"><Button size="icon" variant="ghost" disabled={busy||loading||!profile} aria-pressed={selected} aria-label={(selected?d.saved:d.favorite)+': '+placeById[placeId]?.name} title={selected?d.saved:d.favorite} onClick={async()=>{setBusy(true);setError('');try{await toggleKit('place',placeId,!selected);}catch(e){setError(socialError(e instanceof SocialClientError?e.code:'service_unavailable',locale));}finally{setBusy(false);}}}><Bookmark size={19} fill={selected?'currentColor':'none'}/></Button>{error&&<span className="sc-inline-error" role="alert">{error}</span>}</span>;
}
export function TravelKit({locale}:{locale:Locale}){
 const d=demoCopy(locale),{kit,toggleKit}=useSocial(),[busy,setBusy]=useState(''),[error,setError]=useState('');
 return <section className="sc-travel-kit"><div className="sc-kit-heading"><Backpack size={22}/><h2>{d.favorites}</h2><span>{kit.favorites.length}</span></div>{kit.favorites.length?<ul className="sc-kit-places">{kit.favorites.map(id=>{const p=placeById[id];return p?<li key={id}><Link href={`${qrPath(locale)}#code=${codeFor('place',id)}`}><strong>{p.name}</strong><small>{p.district}</small></Link><SavePlaceButton placeId={id} locale={locale}/></li>:null;})}</ul>:<p className="sc-kit-empty">{d.emptyFavorites}</p>}<details className="sc-kit-checklist" open><summary><Check size={19}/><strong>{d.checklist}</strong><span>{kit.checked.length}/{kitItems.length}</span></summary><Progress value={kit.checked.length/kitItems.length*100} aria-label={d.checklist} className="sc-kit-progress"/><div>{kitItems.map(id=><label className="sc-checkbox" key={id}><Checkbox checked={kit.checked.includes(id)} disabled={!!busy} onCheckedChange={async v=>{setBusy(id);setError('');try{await toggleKit('check',id,v===true);}catch(e){setError(socialError(e instanceof SocialClientError?e.code:'service_unavailable',locale));}finally{setBusy('');}}}/><span>{d[id]}</span></label>)}</div></details>{error&&<p className="sc-error" role="alert">{error}</p>}</section>;
}
