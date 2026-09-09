import type {District,Locale,Preferences} from '../routing/types';
export type ReviewState='pending'|'approved'|'rejected'|'deleted';
export interface Profile {demo?:boolean;id:string;handle:string;name:string;bio:string;status:ReviewState;admin?:boolean;createdAt:string;}
export interface Media {demo?:boolean;credit?:string;source?:string;license?:string;licenseUrl?:string;thumbnail?:string;position?:string;id:string;kind:'image'|'video';caption:string;status:ReviewState;url:string;}
export interface SocialPost {demo?:boolean;id:string;author:{id:string;name:string;handle:string};title:string;body:string;placeIds:string[];districts:District[];mode:string;days:number;preferences:Preferences;status:ReviewState;revision:number;createdAt:string;likes:number;rating:number;ratingCount:number;commentCount:number;media:Media[];mine?:boolean;myVote?:{liked:boolean;rating:number};}
export interface SocialComment {demo?:boolean;id:string;postId:string;author:{name:string;id:string};body:string;status:ReviewState;createdAt:string;mine:boolean;}
export interface ServiceRequest {id:string;kind:'guide'|'home';district:District;listingId:string|null;date:string;time:string;people:number;language:Locale;note:string;status:'demo'|'cancelled';createdAt:string;}
export interface ApiStatus {demoMode?:boolean;knowledgeAI:boolean;ready:boolean;mediaReady:boolean;providers:{google:boolean;facebook:boolean};moderation:'human-review'|'ai-and-human-review';}
export interface Trend {demo?:boolean;placeId:string;routeCount:number;likes:number;visitors:number;}
