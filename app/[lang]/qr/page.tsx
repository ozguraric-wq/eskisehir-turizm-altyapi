import { notFound } from "next/navigation";
import { QrGuide } from "@/components/qr-guide";
import { qrCopy } from "@/lib/qr/copy";
import type { Locale } from "@/lib/routing/types";
const locales=["en","de","fr","ar"];
export function generateStaticParams(){return locales.map(lang=>({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;return {title:locales.includes(lang)?qrCopy(lang as Locale).scan:""};}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!locales.includes(lang))notFound();return <QrGuide locale={lang as Locale}/>;}
