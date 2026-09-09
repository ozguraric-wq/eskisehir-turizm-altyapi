import type {District,Locale,Preferences} from '../routing/types';
export type ReviewState='pending'|'approved'|'rejected'|'deleted';
export interface Profile {id:string;handle:string;name:string;bio:string;status:ReviewState;admin?:boolean;createdAt:string;}
export interface Media {id:string;kind:'image'|'video';caption:string;status:ReviewState;url:string;}
export interface SocialPost {id:string;author:{id:string;name:string;handle:string};title:string;body:string;placeIds:string[];districts:District[];mode:string;days:number;preferences:Preferences;status:ReviewState;revision:number;createdAt:string;likes:number;rating:number;ratingCount:number;commentCount:number;media:Media[];mine?:boolean;myVote?:{liked:boolean;rating:number};}
export interface SocialComment {id:string;postId:string;author:{name:string;id:string};body:string;status:ReviewState;createdAt:string;mine:boolean;}
export interface ServiceRequest {id:string;kind:'guide'|'home';district:District;listingId:string|null;date:string;time:string;people:number;language:Locale;note:string;status:'demo'|'cancelled';createdAt:string;}
export interface ApiStatus {knowledgeAI:boolean;ready:boolean;mediaReady:boolean;providers:{google:boolean;facebook:boolean};moderation:'human-review'|'ai-and-human-review';}
export interface Trend {placeId:string;routeCount:number;likes:number;visitors:number;}
