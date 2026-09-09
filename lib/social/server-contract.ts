import {z} from 'zod';
import {districtNames,placeById} from '../routing/data';
import {preferenceSchema} from '../mobile/assistant-contract';
import {validDate} from '../routing/engine';
export const localeSchema=z.enum(['tr','en','de','fr','ar']);
export const districtSchema=z.string().refine(x=>districtNames.includes(x as never));
export const handleSchema=z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9_]{2,29}$/);
export const profileSchema=z.object({name:z.string().trim().min(2).max(60),bio:z.string().trim().max(400).default('')}).strict();
export const registerSchema=profileSchema.extend({handle:handleSchema,password:z.string().min(12).max(128),acceptedRules:z.literal(true)}).strict();
export const postSchema=z.object({title:z.string().trim().min(3).max(90),body:z.string().trim().max(3000),preferences:preferenceSchema,planId:z.string().min(1).max(600),acceptedRules:z.literal(true)}).strict();
export const voteSchema=z.object({liked:z.boolean(),rating:z.number().int().min(0).max(5)}).strict();
export const requestSchema=z.object({kind:z.enum(['guide','home']),district:districtSchema,listingId:z.string().max(60).nullable(),date:z.string().refine(validDate),time:z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),people:z.number().int().min(1).max(20),language:localeSchema,note:z.string().trim().max(1000),acknowledgedDemo:z.literal(true)}).strict();
export const visitSchema=z.object({placeId:z.string().refine(id=>Object.hasOwn(placeById,id)),date:z.string().refine(validDate)}).strict();
export interface Statement {bind(...values:unknown[]):Statement;first<T=Record<string,unknown>>():Promise<T|null>;all<T=Record<string,unknown>>():Promise<{results:T[]}>;run():Promise<{meta?:{changes?:number}}>;}
export interface Database {prepare(sql:string):Statement;batch(statements:Statement[]):Promise<unknown[]>;}
export interface Bucket {put(key:string,body:ReadableStream|ArrayBuffer,options?:unknown):Promise<unknown>;get(key:string):Promise<{body:ReadableStream;httpMetadata?:{contentType?:string};size:number}|null>;delete(key:string|string[]):Promise<void>;}
export interface SocialEnv {DB?:Database;BUCKET?:Bucket;SOCIAL_SESSION_SECRET?:string;SOCIAL_ADMIN_IDS?:string;SOCIAL_ADMIN_EMAILS?:string;SOCIAL_PUBLIC_ORIGIN?:string;SOCIAL_WEB_ORIGIN?:string;GOOGLE_CLIENT_ID?:string;GOOGLE_CLIENT_SECRET?:string;FACEBOOK_CLIENT_ID?:string;FACEBOOK_CLIENT_SECRET?:string;FACEBOOK_GRAPH_VERSION?:string;OPENAI_API_KEY?:string;}
export interface Identity {id:string;tokenHash?:string;admin:boolean;}
export class ApiError extends Error {constructor(public code:string,public status=400){super(code);}}
export const nowIso=()=>new Date().toISOString();
export async function readJson(request:Request){if(!request.headers.get('content-type')?.includes('application/json'))throw new ApiError('invalid_request',415);const reader=request.body?.getReader();if(!reader)throw new ApiError('invalid_request');let value='',bytes=0;const decoder=new TextDecoder();for(;;){const part=await reader.read();if(part.done)break;bytes+=part.value.length;if(bytes>32000){await reader.cancel();throw new ApiError('request_too_large',413);}value+=decoder.decode(part.value,{stream:true});}value+=decoder.decode();try{return JSON.parse(value);}catch{throw new ApiError('invalid_request');}}
