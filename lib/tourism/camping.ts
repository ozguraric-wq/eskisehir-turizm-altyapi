import {text} from '../routing/types';
export const CAMP_CHECKED='2026-09-09';
export const CAMP_NOTICE_SOURCE='https://eskisehir.ktb.gov.tr/';
export const FOREST_RESTRICTION={from:'2026-06-15',until:'2026-10-15',source:CAMP_NOTICE_SOURCE};
export interface CampRecord {id:string;name:string;district:string;type:'nature-area'|'camp-reference';source:string;summary:ReturnType<typeof text>;overnight:'unverified'|'confirmed';operatingVerified:boolean;forest:boolean;}
// A mention of camping infrastructure is not evidence of a currently permitted overnight service.
export const camps:CampRecord[]=[{id:'musaozu',name:'Musaözü Tabiat Parkı',district:'Tepebaşı',type:'camp-reference',source:'https://ekotaban.tarimorman.gov.tr/alan/376',summary:text('Bakanlığın doğa turizmi kaydında kamp ve karavan altyapısı anılır. Güncel geceleme izni ve alan erişimi ayrıca doğrulanmalıdır.','Camping infrastructure appears in the Ministry nature record. Current overnight permission and access need confirmation.','Der Natureintrag nennt Camping-Infrastruktur. Aktuelle Übernachtungserlaubnis und Zugang müssen bestätigt werden.','Le registre naturel mentionne le camping. Autorisation actuelle de nuitée et accès à confirmer.','يشير سجل الطبيعة إلى بنية تخييم. يجب تأكيد السماح الحالي بالمبيت والدخول.'),overnight:'unverified',operatingVerified:false,forest:true}];
export function campCanBeScheduled(camp:CampRecord,date:string){return camp.operatingVerified&&camp.overnight==='confirmed'&&!!date&&!(camp.forest&&date>=FOREST_RESTRICTION.from&&date<=FOREST_RESTRICTION.until);}
