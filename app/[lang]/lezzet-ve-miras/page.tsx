import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeritageExplorer } from "@/components/heritage-explorer";
import { heritageCopy } from "@/lib/routing/heritage-copy";
import type { Locale } from "@/lib/routing/types";
const locales=["en","de","fr","ar"];
export function generateStaticParams(){return locales.map(lang => ({lang}));}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const {lang}=await params;if(!locales.includes(lang))return {};
  const c=heritageCopy(lang as Locale);return {title:`${c.menu} · Eskişehir`,description:c.lead};
}
export default async function InternationalHeritagePage({params}:{params:Promise<{lang:string}>}){
  const {lang}=await params;if(!locales.includes(lang))notFound();return <HeritageExplorer locale={lang as Locale}/>;
}
