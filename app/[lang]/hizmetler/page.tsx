import {notFound} from 'next/navigation';
import { LocalServices } from '@/components/local-services';
import {socialCopy} from '@/lib/social/copy';
import type {Locale} from '@/lib/routing/types';
const locales=['en','de','fr','ar'];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?socialCopy(lang as Locale).services:''};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <LocalServices locale={lang as Locale}/>;}
