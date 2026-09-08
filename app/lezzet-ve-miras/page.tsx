import type { Metadata } from "next";
import { HeritageExplorer } from "@/components/heritage-explorer";
export const metadata: Metadata = { title:"Lezzet & Miras · Eskişehir", description:"Eskişehir’in 15 coğrafi işaretli ürünü, UNESCO kayıtları ve kültürel mirası. Resmî kaynaklı hikâyeler, yerel alışveriş fikirleri ve rotanızla eşleşen keşifler." };
export default function HeritagePage(){ return <HeritageExplorer/>; }
