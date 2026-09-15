'use client';
import {ArrowUpRight,ArrowRight,Check,Info,Download} from 'lucide-react';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {statusLabels,type Status} from '@/lib/festival/domain';
import type {ReactNode} from 'react';
export const LinkButton=({to,children,light=false,outline=false}:{to:string;children:ReactNode;light?:boolean;outline?:boolean})=><a className={`button ${light?'light':''} ${outline?'outline':''}`} href={'#/'+to}>{children}<ArrowUpRight size={18}/></a>;
export const SectionHeading=({eyebrow,title,children}:{eyebrow:string;title:string;children?:ReactNode})=><div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{children&&<div className="section-aside">{children}</div>}</div>;
export const PageIntro=({eyebrow,title,children}:{eyebrow:string;title:string;children?:ReactNode})=><div className="page-intro"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children&&<p>{children}</p>}</div>;
export const Notice=({children,tone='info'}:{children:ReactNode;tone?:string})=><div className={`notice ${tone}`}><Info size={19}/><div>{children}</div></div>;
export function Choice({value,onChange,options,label,disabled=false}:{value:string;onChange:(v:string)=>void;options:{value:string;label:string}[];label:string;disabled?:boolean}){return <Select value={value} onValueChange={onChange} disabled={disabled}><SelectTrigger className="choice" aria-label={label}><SelectValue placeholder={label}/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>;}
export function Tick({checked,onChange,children}:{checked:boolean;onChange:(v:boolean)=>void;children:ReactNode}){return <label className="tick"><Checkbox checked={checked} onCheckedChange={v=>onChange(v===true)} className="checkbox"/><span>{children}</span></label>;}
export function Modal({open,onClose,title,description,children,wide=false}:{open:boolean;onClose:()=>void;title:string;description?:string;children:ReactNode;wide?:boolean}){return <Dialog open={open} onOpenChange={v=>!v&&onClose()}><DialogContent className={`festival-modal ${wide?'wide':''}`}><DialogTitle>{title}</DialogTitle><DialogDescription>{description||'Başvuru ve program ayrıntıları'}</DialogDescription><div className="modal-body">{children}</div></DialogContent></Dialog>;}
export const StatusBadge=({status}:{status:Status})=><span className={`status status-${status}`}>{['selected','accepted'].includes(status)&&<Check size={13}/>} {statusLabels[status]}</span>;
export function EmptyState({title,body}:{title:string;body:string}){return <div className="empty-state"><span className="empty-mark">/</span><h3>{title}</h3><p>{body}</p></div>;}
export const Field=({label,hint,children}:{label:string;hint?:string;children:ReactNode})=><div className="field"><div className="field-label">{label}</div>{children}{hint&&<small>{hint}</small>}</div>;
