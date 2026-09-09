import type {EventVenue} from './types';
/** Reviewed areas, not invented coordinates. Each transfer includes a last-mile allowance. */
export const eventVenues:EventVenue[]=[
 {id:'aktif-yasam',name:'Aktif Yaşam Parkı',aliases:['aktif yaşam parkı'],district:'Tepebaşı',zone:'sazova',query:'Aktif Yaşam Parkı, Sazova, Tepebaşı, Eskişehir',source:'https://www.eskisehir.bel.tr/sayfalar.php?sayfalar_id=158',accessMinutes:15},
 {id:'ataturk-kongre',name:'Atatürk Kültür, Sanat ve Kongre Merkezi',aliases:['atatürk kültür sanat ve kongre merkezi','atatürk kültür, sanat ve kongre merkezi'],district:'Odunpazarı',zone:'kentpark',query:'Atatürk Kültür Sanat ve Kongre Merkezi, Kurtuluş Mahallesi Cumhuriyet Bulvarı No:104, Eskişehir',source:'https://senfoni.eskisehir.bel.tr/yonetim.php',accessMinutes:20},
 {id:'atilla-ozer',name:'Atilla Özer Karikatürlü Ev',aliases:['atilla özer karikatürlü ev'],district:'Tepebaşı',zone:'center',query:'Atilla Özer Karikatürlü Ev, Espark yanı, Eskişehir',source:'https://www.tepebasi.bel.tr/Etkinlikler/Detay/gelenek-gelecek-sergisi',accessMinutes:10},
];
export const venueById=Object.fromEntries(eventVenues.map(v=>[v.id,v])) as Record<string,EventVenue>;
export const folded=(s:string)=>s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,' ').trim();
export function resolveVenue(name:string){const n=folded(name);return eventVenues.find(v=>v.aliases.some(a=>n===folded(a)||n.startsWith(folded(a)+' ')))??null;}
export function eventStopId(event:{id:string;venueId:string|null}){return `event:${event.venueId}:${event.id}`;}
export function stopVenue(id:string){return id.startsWith('event:')?venueById[id.split(':')[1]]:undefined;}
