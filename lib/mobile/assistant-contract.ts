import { z } from "zod";
import { districtNames, origins, placeById, themeById } from "../routing/data";
import { normalizePreferences, validDate } from "../routing/engine";
import type { Preferences } from "../routing/types";

const member=(items: readonly string[])=>z.string().refine(s=>items.includes(s));
const placeId=z.string().refine(s=>Object.hasOwn(placeById,s));
export const assistantRequestSchema=z.object({
  message:z.string().trim().min(2).max(1500), locale:z.enum(["tr","en","de","fr","ar"]), catalogVersion:z.string().max(30),
  preferences:z.unknown(),
  history:z.array(z.object({role:z.enum(["user","assistant"]),content:z.string().max(1800)}).strict()).max(8).default([]),
}).strict();
export const preferenceSchema=z.object({
  days:z.number().int().min(1).max(4), start:z.number().int().min(360).max(1320),end:z.number().int().min(420).max(1410),
  mode:z.enum(["car","walk","bicycle","motorcycle","transit"]),pace:z.enum(["relaxed","balanced","full"]),
  startMode:z.enum(["district","fixed"]),cycleKm:z.union([z.literal(25),z.literal(50),z.literal(80)]),
  transitHoliday:z.boolean(),interests:z.array(z.enum(["heritage","phrygia","nature","craft","taste","faith","city"])).min(1).max(7),
  origin:member(origins),meal:z.enum(["local","vegetarian","picnic"]),family:z.boolean(),lowWalk:z.boolean(),
  weather:z.enum(["indoors","outdoors"]),freeOnly:z.boolean(),date:z.string().refine(s=>s===""||validDate(s)),
  events:z.array(z.string().regex(/^[a-z0-9][a-z0-9-]{1,110}$/)).max(8).optional(),eventDurations:z.record(z.number().int().min(15).max(360)).optional(),
  excluded:z.array(placeId).max(47), required:z.array(placeId).max(8),
  focus:z.string().refine(s=>s===""||Object.hasOwn(themeById,s)),alternatives:z.number().int().min(2).max(6),districts:z.array(member(districtNames)).max(14),
}).strict().refine(p=>p.end-p.start>=60 && !p.required.some(id=>p.excluded.includes(id)));
export const assistantOutputSchema=z.object({
  action:z.enum(["plan","clarify","answer"]),message:z.string().min(1).max(1800),preferences:preferenceSchema,
  sourcePlaceIds:z.array(placeId).max(8),
}).strict();
const stringEnum=(values:string[])=>({type:"string",enum:values});
const array=(items:object,maxItems:number)=>({type:"array",items,maxItems});
const bool={type:"boolean"};
const properties={days:{type:"integer",minimum:1,maximum:4},start:{type:"integer",minimum:360,maximum:1320},end:{type:"integer",minimum:420,maximum:1410},mode:stringEnum(["car","walk","bicycle","motorcycle","transit"]),pace:stringEnum(["relaxed","balanced","full"]),startMode:stringEnum(["district","fixed"]),cycleKm:{type:"integer",enum:[25,50,80]},transitHoliday:bool,interests:{...array(stringEnum(["heritage","phrygia","nature","craft","taste","faith","city"]),7),minItems:1},origin:stringEnum(origins),meal:stringEnum(["local","vegetarian","picnic"]),family:bool,lowWalk:bool,weather:stringEnum(["indoors","outdoors"]),freeOnly:bool,date:{type:"string"},excluded:array(stringEnum(Object.keys(placeById)),47),required:array(stringEnum(Object.keys(placeById)),8),focus:stringEnum(["",...Object.keys(themeById)]),alternatives:{type:"integer",minimum:2,maximum:6},districts:array(stringEnum(districtNames),14)};
export const responseJsonSchema={type:"object",additionalProperties:false,required:["action","message","preferences","sourcePlaceIds"],properties:{action:stringEnum(["plan","clarify","answer"]),message:{type:"string"},preferences:{type:"object",properties,additionalProperties:false,required:Object.keys(properties)},sourcePlaceIds:array(stringEnum(Object.keys(placeById)),8)}};
export interface AssistantProposal { action:"plan"|"clarify"|"answer";message:string;preferences:Preferences;sources:{id:string;name:string;url:string}[];planCount:number;warnings:string[];provider:"openai";catalogVersion:string; }
export function validatedModelPreferences(raw:unknown) { return normalizePreferences(preferenceSchema.parse(raw)); }
