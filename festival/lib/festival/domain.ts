export type ApplicationKind = 'film' | 'academy' | 'route' | 'youth' | 'volunteer';
export type Status = 'received' | 'correction' | 'eligible' | 'review' | 'third' | 'evaluated' | 'selected' | 'rejected' | 'accepted' | 'withdrawn';
export type FileItem = {name:string; type:string; size:number; data:string; slot:string};
export type Director = {name:string; dob:string; citizen:boolean};
export type Review = {reviewer:string; scores:number[]; note:string; conflict:boolean; at:string};
export type History = {at:string; text:string; actor:string; internal?:boolean};
export type Application = {
  id:string; code:string; kind:ApplicationKind; name:string; email:string; phone:string; title:string;
  category:string; directors:Director[]; duration:number; completed:string; school:string;
  city:string; locations:string; localFilm:boolean; short:string; synopsis:string; bio:string; note:string;
  watchUrl:string; watchPassword:string; files:FileItem[]; rights:boolean; consent:boolean; thirdParty:boolean;
  status:Status; createdAt:string; updatedAt:string; dueAt?:string; history:History[]; assigned:string[]; reviews:Review[];
  choice:string; date:string; demo:boolean;
};
export type EventItem = {id:string; day:number; time:string; title:string; type:string; place:string; duration:number; capacity:number; demo:boolean; published?:boolean};
export type Reservation = {id:string; name:string; email:string; eventId:string; count:number; createdAt:string; demo:boolean};
export type State = {version:1; applications:Application[]; events:EventItem[]; reservations:Reservation[]; selections:{youth:string[]; local:string[]}; updatedAt:string};
export const categories = [
  {id:'fiction', title:'Kısa Kurmaca', count:12, duration:'En fazla 20 dakika', max:20, min:0, award:'Altın Midas', description:'Kendi sesini bulan genç yönetmenlerden kurmaca kısa filmler.'},
  {id:'documentary', title:'Kısa Belgesel', count:8, duration:'En fazla 30 dakika', max:30, min:0, award:'Altın Midas', description:'Gerçek hayatın içinden, yeni bakışlarla anlatılan hikâyeler.'},
  {id:'student', title:'Öğrenci Filmleri', count:8, duration:'En fazla 20 dakika', max:20, min:0, award:'Gümüş Midas', description:'Öğrenci yapımları için ayrı bir yarışma ve görünürlük alanı.'},
  {id:'feature', title:'Uzun Metraj', count:4, duration:'60 dakika ve üzeri', max:10000, min:60, award:'Porsuk Ödülü', description:'Seyirci oyuyla belirlenen ödül için uzun metraj gösterimleri.'},
];
export const statusLabels:Record<Status,string> = {received:'Başvuru alındı',correction:'Düzeltme bekleniyor',eligible:'Uygunluk onaylandı',review:'Ön jüri değerlendirmesinde',third:'Üçüncü değerlendirme gerekli',evaluated:'Puanlama tamamlandı',selected:'Ana seçkide',rejected:'Uygun bulunmadı',accepted:'Kabul edildi',withdrawn:'Geri çekildi'};
export const kindLabels:Record<ApplicationKind,string> = {film:'Film başvurusu',academy:'Akademi kaydı',route:'Çekim mekânı talebi',youth:'Gençlik jürisi',volunteer:'Gönüllü başvurusu'};
export const rubric = [{name:'Senaryo ve hikâye yapısı',max:20},{name:'Yönetmenlik başarısı',max:15},{name:'Özgünlük ve yaratıcılık',max:15},{name:'Oyunculuk ve performanslar',max:10},{name:'Görsel anlatım',max:10},{name:'Kurgu ve ritim',max:10},{name:'Ses ve müzik kullanımı',max:5},{name:'Duygusal ve düşünsel etki',max:10},{name:'Festival uygunluğu',max:5}];
export const rubricFor = (category:string) => rubric.map((x,i)=>({...x,name:category==='documentary'&&i===0?'Konu seçimi ve anlatı yaklaşımı':category==='documentary'&&i===3?'Araştırma ve saha çalışması':x.name}));
export const dateTR = (value:string) => new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Istanbul'}).format(new Date(value));
export const countWords = (s:string) => s.trim() ? s.trim().split(/\s+/u).length : 0;
export const totalScore = (r:Review) => r.scores.reduce((s,n)=>s+n,0);
export const validReviews = (a:Application) => a.reviews.filter(r=>!r.conflict);
export const scoreSummary = (a:Application) => {const rr=validReviews(a);return {count:rr.length,mean:rr.length?Math.round(rr.reduce((s,r)=>s+totalScore(r),0)/rr.length*10)/10:null,third:rr.length===2&&Math.abs(totalScore(rr[0])-totalScore(rr[1]))>20};};
export const requiredSlots = (a:Pick<Application,'category'|'thirdParty'>) => ['identity','poster','still1','still2','still3','portrait','rights',...(a.category==='student'?['student']:[])];
export const slotLabels:Record<string,string>={identity:'Kimlik belgesi',poster:'Film afişi',still1:'Film karesi 1',still2:'Film karesi 2',still3:'Film karesi 3',portrait:'Yönetmen fotoğrafı',rights:'Telif izin / hak sahipliği belgesi',student:'Öğrenci belgesi'};
export function validDate(v:string){return /^\d{4}-\d{2}-\d{2}$/.test(v)&&!Number.isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
export function ageAt(dob:string,at='2027-03-31'){if(!validDate(dob))return NaN;const [y,m,d]=dob.split('-').map(Number);const [ay,am,ad]=at.split('-').map(Number);return ay-y-((am<m||(am===m&&ad<d))?1:0);}
export function businessDue(iso:string,holidays:string[]=[]){const d=new Date(iso);for(let n=0;n<5;){d.setUTCDate(d.getUTCDate()+1);if(d.getUTCDay()!==0&&d.getUTCDay()!==6&&!holidays.includes(d.toISOString().slice(0,10)))n++;}return d.toISOString();}
export function validateApplication(a:Partial<Application>,full=true):string[]{
  const errors:string[]=[]; if(!a.kind||!Object.keys(kindLabels).includes(a.kind))errors.push('Başvuru türü geçersiz.');
  if(!a.name?.trim())errors.push('Ad ve soyad gerekli.');
  if(!a.email||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email))errors.push('Geçerli bir e-posta adresi girin.');
  if(a.kind==='film'){
    const c=categories.find(c=>c.id===a.category); if(!c)errors.push('Dört başvuru bölümünden birini seçin.');
    if(!a.title?.trim())errors.push('Film adı gerekli.');
    if(!a.directors?.length)errors.push('En az bir yönetmen gerekli.');
    for(const [i,d] of (a.directors||[]).entries()){const age=ageAt(d.dob);if(!d.name.trim())errors.push(`${i+1}. yönetmenin adı gerekli.`);if(!Number.isFinite(age)||age<0||age>=30)errors.push(`${i+1}. yönetmen 31 Mart 2027 itibarıyla 30 yaşını doldurmamış olmalı.`);if(!d.citizen)errors.push('Tüm yönetmenler T.C. vatandaşı olmalı.');}
    if(!Number.isFinite(a.duration)||!a.duration||a.duration<=(c?.min===0?0:-1)||(c&&a.duration<c.min)||(c&&a.duration>c.max))errors.push('Film süresi seçilen bölümün koşullarına uymuyor.');
    if(!a.completed||!validDate(a.completed)||a.completed<='2024-01-01'||a.completed>'2027-03-31')errors.push('Yapım 1 Ocak 2024 sonrasında ve son başvuru tarihine kadar tamamlanmış olmalı.');
    if(full){
      try{const u=new URL(a.watchUrl||'');if(u.protocol!=='https:'||u.username||u.password)throw Error();}catch{errors.push('HTTPS ile başlayan geçerli bir izleme bağlantısı girin.');}
      for(const [key,label,max] of [['short','Kısa tanıtım',50],['synopsis','Sinopsis',300],['bio','Biyografi',250]] as const){if(!a[key]?.trim())errors.push(`${label} gerekli.`);else if(countWords(a[key]!)>max)errors.push(`${label} en fazla ${max} kelime olabilir.`);}
      if(!a.note?.trim())errors.push('Yönetmen notu gerekli.');
      if(a.category==='student'&&!a.school?.trim())errors.push('Öğrenci bölümü için okul bilgisi gerekli.');
      for(const slot of requiredSlots({category:a.category!,thirdParty:!!a.thirdParty})){if(!a.files?.some(f=>f.slot===slot))errors.push(`${slotLabels[slot]} eksik.`);}
      if(!a.rights)errors.push('Telif ve gösterim beyanını onaylayın.');
      if(a.localFilm&&!a.locations?.trim())errors.push('Eskişehir çekim yerlerini belirtin.');
    }
  } else if(full){
    if(!a.choice?.trim())errors.push('Program veya görev seçimi gerekli.');
    if(!a.note?.trim())errors.push('Başvuru açıklaması gerekli.');
    if(a.kind==='route'&&(!a.date||!a.locations))errors.push('Çekim tarihi ve mekân bilgisi gerekli.');
    if(a.kind==='youth'){const age=ageAt(a.directors?.[0]?.dob||'','2027-06-24');if(!Number.isFinite(age)||age<16||age>22)errors.push('Gençlik jürisi 16–22 yaş aralığına açıktır.');if(!a.synopsis?.trim())errors.push('İzlediğiniz bir kısa film hakkındaki değerlendirme yazısını ekleyin.');}
  }
  if(full&&!a.consent)errors.push('Başvuru bilgilendirmesini okuyup onaylayın.');
  return errors;
}
export function validateReview(scores:number[]){return Array.isArray(scores)&&scores.length===rubric.length&&scores.every((v,i)=>Number.isFinite(v)&&v>=0&&v<=rubric[i].max);}
export function assertTransition(a:Application,next:Status){
  const film:Partial<Record<Status,Status[]>>={received:['correction','eligible','rejected'],correction:['eligible','rejected'],eligible:['review','correction','rejected'],review:['correction','rejected'],third:['rejected'],evaluated:['selected','rejected'],selected:['rejected'],rejected:[]};
  const other:Partial<Record<Status,Status[]>>={received:['accepted','correction','rejected'],correction:['accepted','rejected'],accepted:['rejected']};
  if(!(a.kind==='film'?film:other)[a.status]?.includes(next))throw Error('Bu aşamadan seçilen duruma geçilemez.');
  if(next==='review'&&a.assigned.length<2)throw Error('En az iki farklı ön jüri üyesi atayın.');
  if(next==='selected'&&(scoreSummary(a).count<2||scoreSummary(a).third))throw Error('Bağımsız değerlendirmeler tamamlanmadan seçki kararı verilemez.');
}
export function deriveSelections(apps:Application[]){const scored=apps.filter(a=>a.kind==='film'&&['evaluated','selected'].includes(a.status)&&scoreSummary(a).count>=2&&!scoreSummary(a).third).sort((a,b)=>(scoreSummary(b).mean||0)-(scoreSummary(a).mean||0));return {youth:['fiction','documentary','student'].flatMap(c=>scored.filter(a=>a.category===c&&a.status!=='selected').slice(0,5).map(a=>a.id)),local:scored.filter(a=>a.localFilm).slice(0,6).map(a=>a.id)};}
export function freshApplication(kind:ApplicationKind='film'):Application{return {id:'',code:'',kind,name:'',email:'',phone:'',title:'',category:'fiction',directors:[{name:'',dob:'',citizen:false}],duration:0,completed:'',school:'',city:'',locations:'',localFilm:false,short:'',synopsis:'',bio:'',note:'',watchUrl:'',watchPassword:'',files:[],rights:false,consent:false,thirdParty:false,status:'received',createdAt:'',updatedAt:'',history:[],assigned:[],reviews:[],choice:'',date:'',demo:true};}
