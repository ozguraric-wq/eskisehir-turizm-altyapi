import { notFound } from "next/navigation";
import { SavedTrips } from "@/components/saved-trips";
import { mobileCopy } from "@/lib/mobile/copy";
import type { Locale } from "@/lib/routing/types";
const locales=["en","de","fr","ar"];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?mobileCopy(lang as Locale).trips:""};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <SavedTrips locale={lang as Locale}/>;}
