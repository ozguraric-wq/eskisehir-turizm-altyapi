import {notFound} from 'next/navigation';
import { SocialFeed } from '@/components/social-feed';
import {socialCopy} from '@/lib/social/copy';
import type {Locale} from '@/lib/routing/types';
const locales=['en','de','fr','ar'];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?socialCopy(lang as Locale).community:''};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <SocialFeed locale={lang as Locale}/>;}
