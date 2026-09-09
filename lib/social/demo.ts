import {normalizePreferences} from '../routing/engine';
import {placeById} from '../routing/data';
import type {Mode,Interest} from '../routing/types';
import type {SocialEnv} from './server-contract';

// The demo is an explicit product mode, never an identity or admin bypass.
export const demoEnabled=(env:SocialEnv)=>env.SOCIAL_DEMO_MODE!=='false';
export const isDemoUser=(id?:string)=>!!id?.startsWith('demo:');
export const isSeedUser=(id?:string)=>!!id?.startsWith('demo:seed:');
export const demoId=(group:number,n:number)=>`d${String(group).padStart(7,'0')}-2026-4000-8000-${String(n).padStart(12,'0')}`;
const definitions:[string,string[],Mode,Interest[],string][]=[
 ['Frigya’da kayaya yazılan hikâyeler',['midas','midasvillage'],'walk',['phrygia','heritage'],'Anıtın cephesine zaman ayıran, köy molasıyla tamamlanan bir keşif. Bu örnek rota Yazılıkaya’da başlar; ilçeye ulaşım ayrıca planlanır.'],
 ['Seyitgazi’nin iki yüzü',['battal','seyitcarsi'],'walk',['faith','heritage'],'Külliyenin mimarisi ve ilçe çarşısı aynı günün iki durağı. İbadet düzeni ve yokuşlar için zaman bırakılıyor.'],
 ['Ahşabın hafızası, Sivrihisar',['ulucami','sivricarsi','church'],'walk',['heritage','craft','taste'],'Ulu Camii, çarşı ve kilisenin dış cephesi. Yerel lezzet molası ve esnafla tanışmak için acele edilmeyen bir gün.'],
 ['Sakaryabaşı’nda suyun izinde',['sakarya','cifteler'],'bicycle',['nature','taste'],'Çifteler’de başlayan kısa bir bisiklet keşfi. Kaynak çevresinde bisikleti bırakıp kıyıdan yürüyüş yapılır; yüzme programa dahil değildir.'],
 ['Yunus’un izinden Mihalıççık',['yunus','mihaliccik'],'car',['faith','heritage'],'Yunus Emre’nin düşünce dünyasıyla ilçe yaşamını buluşturan kültür günü. Ziyaret düzeni yola çıkmadan kontrol edilir.'],
 ['İnönü’de kaya ve kent belleği',['inonu'],'bicycle',['heritage','nature'],'İnönü merkezinde başlayan, açık alana ve kaya peyzajına odaklanan örnek bisiklet planı. Mağara içine giriş önermez.'],
 ['Alpu’da gümüşün ince işi',['alpu'],'walk',['craft','heritage'],'Savat geleneğinin ilçesinde çarşıya ayrılmış bir keşif. Usta ziyareti, gösteri ve ürün bulunurluğu için önceden teyit gerekir.'],
 ['Beylikova’da yavaş bir gün',['beylikova'],'bicycle',['nature','taste'],'İlçe merkezinde başlayan sakin bir bisiklet günü. Porsuk ve üretim kültürü keşfedilir; özel çiftliklere giriş plana eklenmez.'],
 ['Günyüzü’nden Kayakent’e dokuma izi',['gunyuzu','kayakent'],'car',['craft','heritage'],'Kilim geleneğini iki yerleşimin gündelik yaşamıyla birlikte ele alan rota. Dokuma gösterisi için yerel iletişim gerekir.'],
 ['Mahmudiye’de atçılık hafızası',['mahmudiye'],'walk',['heritage','city'],'Mahmudiye merkezinin tarihini keşfetmeye ayrılmış örnek gün. Hara girişi veya binicilik rezervasyonu yapılmış sayılmaz.'],
 ['Mihalgazi’de vadi ve dinlenme',['mihalgazi','sakarilica'],'car',['nature','taste'],'Sakarya Vadisi ve termal tesisler çevresinde dinlenme. Havuz, banyo ve konaklama ayrıca işletmeden doğrulanır.'],
 ['Sarıcakaya’nın vadi yolu',['saricakaya','mayislar'],'motorcycle',['nature','taste'],'Asfalt bağlantılarla vadi yerleşimlerine uzanan motosiklet günü. Bahçelere giriş için izin, yol için güncel durum bilgisi gerekir.'],
 ['Odunpazarı’nda zanaat ve sokaklar',['odunpazari','kursunlu','atlihan'],'walk',['craft','heritage','taste'],'Tarihî sokaklar ve zanaat durakları arasında yürüyüş. Çarşıda üreticiyle tanışmak ve yöresel ürünleri sormak için mola bırakılır.'],
 ['Tepebaşı’nda bilim ve şehir',['devrim','sazova'],'car',['city','nature'],'Devrim otomobilinin hikâyesi ve Sazova’da açık alan gezisi. Müze çalışma günleri ve biletli iç alanlar ayrı kontrol edilir.'],
 ['Porsuk kıyısında iki teker',['porsuk','velespit','sumer'],'bicycle',['nature','city'],'Porsuk kıyısında mola odaklı şehir rotası. Yaya alanlarında bisikletten inilir; yoğunluğa göre tempo düşürülür.'],
 ['Kümbet’te çok katmanlı miras',['kumbet','himmet'],'walk',['phrygia','heritage','faith'],'Kaya mezarı, köy dokusu ve türbe çevresini birlikte anlatan örnek yürüyüş. Pürüzlü zemine uygun ayakkabı gerekir.'],
 ['Gerdekkaya ve Doğanlı’nın kaya izleri',['gerdek','hamamkaya'],'walk',['phrygia','heritage'],'Kayaya oyulan cepheleri dışarıdan gözlemleyen kısa kültür yürüyüşü. Giriş ve zemin koşulları yerinde doğrulanır.'],
 ['Sorkun’dan Gürleyik’e',['sorkun','gurleyik'],'car',['craft','nature'],'Çömlekçilik köyü ve dere çevresinde doğa molası. Atölye randevusu önceden teyit edilir; suya giriş planlanmaz.'],
 ['Pessinus’tan Sivrihisar’a',['pessinus','ulucami','sivricarsi'],'car',['phrygia','heritage','taste'],'Antik yerleşim ile ahşap direkli camiyi aynı günün kültür duraklarına dönüştüren plan. Kazı alanı sınırlarına uyulur.'],
 ['Han’da tarihî menzil ve Frigya',['han','midas','midasvillage'],'motorcycle',['phrygia','heritage'],'Han merkezinden Yazılıkaya’ya uzanan motosiklet keşfi. Arkeolojik alanda araç bırakılıp yürüyerek ziyaret edilir.'],
];
const names=['Ada','Deniz','Ekin','Mert','Duru','Bora','İpek','Can','Ece','Arda','Elif','Ozan','Selin','Efe','Yağmur','Emre','Defne','Kerem','Lale','Umut'];
export const demoRoutes=definitions.map(([title,placeIds,mode,interests,body],i)=>{
 const districts=[...new Set(placeIds.map(id=>placeById[id]?.district).filter(Boolean))];
 return {id:demoId(1,i+1),userId:'demo:seed:'+(i+1),name:names[i]+' · Demo',title,body,placeIds,districts,mode,days:1,
  preferences:normalizePreferences({days:1,mode,interests,startMode:'fixed',origin:placeById[placeIds[0]]?.zone,districts,required:placeIds,alternatives:3,pace:i===2?'balanced':'relaxed',date:''}),
  likes:24+(i*17)%123,ratingCount:8+i%13,rating:4.1+(i%8)/10,createdAt:new Date(Date.UTC(2026,8,8,12)-i*3600000).toISOString()};
});
export const demoRouteById=Object.fromEntries(demoRoutes.map(r=>[r.id,r]));
export const demoComments=demoRoutes.flatMap((r,i)=>[
 {id:demoId(2,i*3+1),postId:r.id,userId:demoRoutes[(i+3)%20].userId,body:`${placeById[r.placeIds[0]]?.name} durağını gezi planına ekleme akışını denedim. Kaynak bağlantısının görünmesi faydalı.`,createdAt:new Date(Date.parse(r.createdAt)+60000).toISOString()},
 {id:demoId(2,i*3+2),postId:r.id,userId:demoRoutes[(i+7)%20].userId,body:'Rotayı kendi tempoma uyarlayıp yemek molası ekleme fikrini sevdim. Bu yorum topluluk akışını göstermek için hazırlanmıştır.',createdAt:new Date(Date.parse(r.createdAt)+120000).toISOString()},
 {id:demoId(2,i*3+3),postId:r.id,userId:demoRoutes[(i+11)%20].userId,body:'Örnek fotoğraflar ve durakların kısa açıklamaları karar vermeyi kolaylaştırıyor. Gerçek ziyaret yorumu değildir.',createdAt:new Date(Date.parse(r.createdAt)+180000).toISOString()},
]);
export const featuredPlaceIds=['midas','ulucami','battal','sakarya','gurleyik','sorkun','porsuk','kumbet','alpu','inonu'];
export const demoTrends=featuredPlaceIds.map(placeId=>{const routes=demoRoutes.filter(r=>r.placeIds.includes(placeId));return {placeId,routeCount:routes.length,likes:routes.reduce((n,r)=>n+r.likes,0),visitors:0,demo:true};}).sort((a,b)=>b.likes-a.likes);

export const kitItems=['water','power','shoes','weather','hours','offline','booking','respect'] as const;
