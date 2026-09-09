import {notFound} from 'next/navigation';
import {EventsCalendar} from '@/components/events-calendar';
import {eventCopy} from '@/lib/events/copy';
import type {Locale} from '@/lib/routing/types';
const locales=['en','de','fr','ar'];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?eventCopy(lang as Locale).menu:''};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <EventsCalendar locale={lang as Locale}/>;}
