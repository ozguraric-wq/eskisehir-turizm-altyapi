import { notFound } from "next/navigation";
import { MobileInstitution } from "@/components/mobile-institution";
import { qrCopy } from "@/lib/qr/copy";
import type { Locale } from "@/lib/routing/types";
const locales=["en","de","fr","ar"];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?qrCopy(lang as Locale).institution:""};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <MobileInstitution locale={lang as Locale}/>;}
