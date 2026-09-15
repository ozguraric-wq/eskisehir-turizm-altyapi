import {assertTransition,businessDue,categories,deriveSelections,scoreSummary,validateReview,type Application,type State,type Status,type EventItem} from './domain.ts';
export type Actor={id:string;role:'admin'|'reviewer'};
export type ActionPayload={id?:string;status?:Status;note?:string;reviewer?:string;scores?:number[];conflict?:boolean;event?:EventItem;holidays?:string[]};
export function applyAction(state:State,action:string,p:ActionPayload,actor:Actor){
 const now=new Date().toISOString(); const a=state.applications.find(x=>x.id===p.id);
 const log=(text:string,internal=false)=>{if(a){a.history.push({at:now,text,actor:actor.role==='admin'?'Sekretarya':actor.id,internal});a.updatedAt=now;}};
 if(action!=='score'&&actor.role!=='admin')throw Error('Bu işlem için yönetici yetkisi gerekli.');
 if(['status','assign','score'].includes(action)&&!a)throw Error('Başvuru bulunamadı.');
 if(action==='status'&&a&&p.status){
   assertTransition(a,p.status);if(!p.note?.trim())throw Error('Karar veya düzeltme gerekçesi yazın.');
   if(p.status==='selected'){const c=categories.find(c=>c.id===a.category)!;if(state.applications.filter(x=>x.id!==a.id&&x.category===a.category&&x.status==='selected').length>=c.count)throw Error('Bu bölümün ana seçki kontenjanı dolu.');}
   a.status=p.status;a.dueAt=p.status==='correction'?businessDue(now,p.holidays):undefined;log(p.note);
 }else if(action==='assign'&&a){
   if(a.kind!=='film'||!['eligible','review','third'].includes(a.status))throw Error('Önce uygunluk kontrolünü tamamlayın.');
   if(!p.reviewer||a.assigned.includes(p.reviewer))throw Error('Farklı bir jüri üyesi seçin.');a.assigned.push(p.reviewer);if(a.assigned.length>=2&&a.status==='eligible')a.status='review';log('Bağımsız ön jüri görevlendirmesi yapıldı.',true);
 }else if(action==='score'&&a){
   if(actor.role!=='reviewer'||!a.assigned.includes(actor.id))throw Error('Bu film size atanmamış.');
   if(!['review','third'].includes(a.status)||a.reviews.some(r=>r.reviewer===actor.id))throw Error('Bu değerlendirme artık değiştirilemez.');
   if(!p.conflict&&!validateReview(p.scores||[]))throw Error('Puanlar değerlendirme ölçütlerinin sınırları içinde olmalı.');
   if(!p.note?.trim())throw Error('Değerlendirme notu gerekli.');
   a.reviews.push({reviewer:actor.id,scores:p.conflict?[]:p.scores!,conflict:!!p.conflict,note:p.note,at:now});
   const s=scoreSummary(a);a.status=s.third?'third':s.count>=2?'evaluated':'review';log(p.conflict?'Çıkar çatışması bildirildi; yeni değerlendirici atanmalı.':s.third?'20 puanı aşan fark nedeniyle üçüncü değerlendirme gerekli.':s.count>=2?'Bağımsız ön jüri puanlaması tamamlandı.':'Bağımsız değerlendirme kaydedildi.',true);
 }else if(action==='selections'){state.selections=deriveSelections(state.applications);
 }else if(action==='event'&&p.event){const e=p.event;if(!e.title.trim()||!e.place.trim()||!/^\d{2}:\d{2}$/.test(e.time)||![24,25,26,27].includes(e.day)||!Number.isInteger(e.capacity)||e.capacity<1||e.capacity>2000)throw Error('Program bilgileri geçersiz.');const used=state.reservations.filter(r=>r.eventId===e.id).reduce((s,r)=>s+r.count,0);if(e.capacity<used)throw Error('Kapasite mevcut rezervasyon sayısının altına indirilemez.');const i=state.events.findIndex(x=>x.id===e.id);if(i<0)state.events.push({...e});else state.events[i]={...e};
 }else if(!['status','assign','score','selections','event'].includes(action))throw Error('İşlem tanınmadı.');
 state.updatedAt=now;return state;
}
export function redactApplicant(a:Application):Application{return {...a,assigned:[],reviews:[],history:a.history.filter(h=>!h.internal)};}
export function redactReviewer(a:Application,reviewer:string):Application{return {...a,email:'',phone:'',code:'',files:a.files.filter(f=>!['identity','rights','student'].includes(f.slot)),assigned:[],reviews:a.reviews.filter(r=>r.reviewer===reviewer),history:[]};}
