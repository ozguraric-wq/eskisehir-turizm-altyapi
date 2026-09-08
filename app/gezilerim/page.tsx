import type { Metadata } from "next";
import { SavedTrips } from "@/components/saved-trips";
export const metadata:Metadata={title:"Gezilerim · Eskişehir Cebimde",description:"Eskişehir gezi planlarınız, kayıtlı duraklar ve gezi ilerlemeniz."};
export default function TripsPage(){return <SavedTrips/>;}
