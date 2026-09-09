import type {District,Zone} from '../routing/types';
export type EventCategory='theatre'|'musical'|'concert'|'cinema'|'exhibition'|'festival'|'sport'|'workshop'|'talk'|'ceremony';
export type EventStatus='scheduled'|'announced'|'cancelled'|'postponed';
export interface CityEvent {
 id:string; title:string; category:EventCategory; district:District|null;
 date:string|null; time:string|null; endTime:string|null; venue:string; venueId:string|null;
 organizer:string; sourceId:string; sourceUrl:string; checkedAt:string;
 status:EventStatus; price:'free'|'paid'|'unknown'; bookingUrl:string|null;
 summary:string; family:boolean|null; indoor:boolean|null;
}
export interface EventVenue {id:string;name:string;aliases:string[];district:District;zone:Zone;query:string;source:string;accessMinutes:number;}
export interface EventSource {id:string;name:string;url:string;district:District|null;kind:'municipality'|'governorship'|'directorate'|'district'|'culture';adapter:'tepebasi'|'ebb-news'|'structured';}
export interface FeedStatus {sourceId:string;checkedAt:string|null;attemptedAt:string|null;state:'snapshot'|'connected'|'no-structured-events'|'unavailable';count:number;}
export interface EventCatalog {events:CityEvent[];sources:FeedStatus[];generatedAt:string;}
export type EventIssueCode='date'|'missing'|'unconfirmed'|'expired'|'stale'|'duration'|'outside'|'overlap'|'limit'|'preferences'|'travel';
export interface EventIssue {code:EventIssueCode;eventIds:string[];}
