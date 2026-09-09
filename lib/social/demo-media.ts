import type {Media} from './types';
import photos from './demo-photos.json';
import {demoRouteById} from './demo';
const match:Record<string,string>={midas:'han-midas',midasvillage:'han-midas',battal:'seyitgazi-battal-gazi',ulucami:'sivrihisar-ulu-camii',sivricarsi:'sivrihisar-ulu-camii',sakarya:'cifteler-sakaribasi',gurleyik:'mihaliccik-gurleyik',inonu:'inonu-panorama',porsuk:'eskisehir-porsuk',odunpazari:'odunpazari-houses'};
export function demoPhotoForPlace(placeId:string){return photos.find(p=>p.id===match[placeId]);}
export function demoMediaFor(postId:string):Media[]{
 const route=demoRouteById[postId];if(!route)return [];
 return [...new Set(route.placeIds.map(id=>match[id]).filter(Boolean))].map(id=>{
  const p=photos.find(p=>p.id===id)!;
  return {id:'sample-'+id,kind:'image',demo:true,caption:p.title+(p.photographed?' · '+p.photographed.slice(0,4):''),status:'approved',url:'/media/community/'+id+'.webp',thumbnail:'/media/community/'+id+'-thumb.webp',credit:p.author,source:p.sourcePage,license:p.license,licenseUrl:p.licenseUrl,position:p.suggestedObjectPosition};
 });
}
