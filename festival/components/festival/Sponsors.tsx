'use client';

import {ArrowUpRight,ArrowRight,Info} from 'lucide-react';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell,TableCaption} from '@/components/ui/table';
import {sponsorGroups,sponsorAreas,sponsorResearch,sponsorDemoNotice,companiesFor,type SponsorCompany,type SponsorArea} from '@/lib/festival/sponsors';
import {LinkButton,SectionHeading,PageIntro} from './shared';

function DemoBadge(){return <span className="sponsor-demo-badge">DEMO SPONSOR</span>;}

function CompanyNote({company}:{company:SponsorCompany}){
 return <article className="sponsor-company-note">
  <div className="sponsor-company-heading"><h4>{company.name}</h4><DemoBadge/></div>
  <p className="sponsor-connection">{company.connection}</p>
  <p>{company.fact} <a className="sponsor-source-link" href={company.source} target="_blank" rel="noreferrer" aria-label={company.sourceLabel+' (yeni sekme)'}>Kaynak <ArrowUpRight size={14}/></a></p>
  <p><strong>Neden önerildi?</strong> {company.rationale}</p>
 </article>;
}

function AreaScope({area}:{area:SponsorArea}){
 return <div className="sponsor-scope">
  <div className="sponsor-scope-meta"><span>{area.period}</span><div>{area.contribution.map(item=><span className="sponsor-contribution" key={item}>{item}</span>)}</div></div>
  <div className="sponsor-scope-columns">
   <div><h4>Karşılanması önerilen ihtiyaç</h4><ul>{area.covers.map(item=><li key={item}>{item}</li>)}</ul></div>
   <div><h4>Önerilen görünürlük ve haklar</h4><ul>{area.benefits.map(item=><li key={item}>{item}</li>)}</ul></div>
  </div>
  <p className="sponsor-measure"><strong>Sonuç raporu</strong><span>{area.measure}</span></p>
  {area.note&&<p className="sponsor-scope-note">{area.note}</p>}
 </div>;
}

export function SponsorsTeaser(){
 const featured=sponsorAreas.filter(area=>['ana-sponsor','akademi','frigya','odul'].includes(area.id));
 return <section className="section sponsor-teaser">
  <SectionHeading eyebrow="SPONSORLAR VE İŞ BİRLİKLERİ" title="Bir şehrin desteği.\nYeni hikâyelerin geleceği."><LinkButton to="sponsorlar" outline>Sponsorluk alanları</LinkButton></SectionHeading>
  <p className="sponsor-teaser-notice"><Info size={18}/><span>Aşağıdaki firmalar yalnızca <strong>DEMO SPONSOR</strong> örnekleridir. Gerçek bir sponsorluk veya firma onayı ifade etmez.</span></p>
  <div className="sponsor-teaser-grid">{featured.map(area=><a key={area.id} className="sponsor-teaser-item" href="#/sponsorlar"><span className="sponsor-teaser-area">{area.title}</span><strong>{companiesFor(area)[0].name}</strong><DemoBadge/></a>)}</div>
 </section>;
}

export function Sponsors(){
 const main=sponsorAreas.find(area=>area.id==='ana-sponsor')!;
 const mainCompany=companiesFor(main)[0];
 return <>
  <PageIntro eyebrow="2027 / ÖNERİLEN İŞ BİRLİĞİ MODELİ" title="Sponsorlar ve iş birlikleri.">Festivalin dört gününe, Akademi’nin bir yılına ve Frigya’nın yeni hikâyelerine katkı sunabilecek destek alanları.</PageIntro>
  <div className="section top-small sponsor-page">
   <div className="sponsor-demo-notice"><Info size={23}/><div><strong>Örnek firmalar. Önerilen kapsamlar.</strong><p>{sponsorDemoNotice}</p></div></div>
   <section className="sponsor-main" aria-labelledby="main-sponsor-title">
    <div className="sponsor-main-brand"><span className="eyebrow">01 / ANA SPONSOR ALANI</span><span className="sponsor-main-name">{mainCompany.name}</span><DemoBadge/><p>{mainCompany.connection}</p></div>
    <div className="sponsor-main-copy"><span className="eyebrow">TEMSİLİ YERLEŞİM · 1 ANA SPONSOR ÖNERİSİ</span><h2 id="main-sponsor-title">Festivalin bütününe<br/>birlikte destek.</h2><p>{main.summary}</p><p className="sponsor-main-rationale">{mainCompany.fact} Bu şehir bağı nedeniyle ana sponsor alanı için örnek olarak önerildi.</p><a className="sponsor-source-link" href={mainCompany.source} target="_blank" rel="noreferrer">ETİ’nin Eskişehir bağı <ArrowUpRight size={15}/></a></div>
    <div className="sponsor-main-scope"><AreaScope area={main}/></div>
   </section>

   <section className="sponsor-model" aria-labelledby="sponsor-model-title">
    <div className="sponsor-section-heading"><span className="eyebrow">DESTEK DÜZEYLERİ</span><h2 id="sponsor-model-title">Her katkının alanı belli.</h2><p>Ana sponsor festivalin geneline; diğer partnerler belirli bir programa, hizmete veya duyuru ihtiyacına katkı sunar.</p></div>
    <Table className="sponsor-table"><TableCaption>Öneri modelidir. Bedel, adet, süre, davetli kontenjanı ve marka kullanım hakları görüşme ve sözleşmeyle netleştirilir.</TableCaption><TableHeader><TableRow><TableHead scope="col">Düzey</TableHead><TableHead scope="col">Destek kapsamı</TableHead><TableHead scope="col">Görünürlük</TableHead></TableRow></TableHeader><TableBody>{sponsorGroups.map(group=><TableRow key={group.id}><TableCell><span className="sponsor-table-number">{group.number}</span><strong>{group.name}</strong><small>{group.capacity}</small></TableCell><TableCell>{group.scope}</TableCell><TableCell>{group.visibility}</TableCell></TableRow>)}</TableBody></Table>
   </section>

   <section className="sponsor-areas" aria-labelledby="sponsor-areas-title">
    <div className="sponsor-section-heading"><span className="eyebrow">PROGRAM, HİZMET VE MEDYA</span><h2 id="sponsor-areas-title">Nereye, nasıl katkı?</h2><p>Her başlıkta ihtiyaçları, katkı biçimini, önerilen hakları ve firma eşleştirmesinin gerekçesini inceleyin. Tüm firma yerleşimleri demodur.</p></div>
    <Accordion type="multiple" defaultValue={['akademi']} className="sponsor-accordion">
     {sponsorAreas.filter(area=>area.group!=='main').map(area=><AccordionItem value={area.id} key={area.id}>
      <AccordionTrigger className="sponsor-area-trigger"><span className="sponsor-area-title"><span className="sponsor-area-group">{sponsorGroups.find(group=>group.id===area.group)!.name}</span><span className="sponsor-area-name">{area.title}</span><span className="sponsor-area-summary">{area.summary}</span></span><span className="sponsor-area-companies">{companiesFor(area).map(company=><span className="sponsor-company-chip" key={company.id}><strong>{company.name}</strong><DemoBadge/></span>)}</span></AccordionTrigger>
      <AccordionContent className="sponsor-area-content"><AreaScope area={area}/><div className="sponsor-company-notes">{companiesFor(area).map(company=><CompanyNote company={company} key={company.id}/>)}</div></AccordionContent>
     </AccordionItem>)}
    </Accordion>
   </section>

   <section className="sponsor-independence"><div><span className="eyebrow">İŞ BİRLİĞİNİN SINIRI</span><h2>Destek görünür.<br/>Kararlar bağımsız.</h2></div><div><p>Sponsorluk; film seçkisi, jüri oyu veya ödül kararı üzerinde hak sağlamaz. Festivalin ve ödüllerin adları korunur. Katılımcıların kişisel verileri sponsorluk karşılığı paylaşılmaz.</p><p>Ücretsiz başvuru ve Akademi yaklaşımı sürdürülür. Marka alanları, programın ihtiyacına ve katkının kapsamına göre belirlenir.</p><a className="text-link dark" href="#/juri">Değerlendirme süreci <ArrowRight size={18}/></a></div></section>

   <section className="sponsor-research" aria-labelledby="sponsor-research-title"><div className="sponsor-section-heading"><span className="eyebrow">ARAŞTIRMANIN DAYANAKLARI</span><h2 id="sponsor-research-title">Festival örneklerinden Eskişehir’e.</h2><p>Resmî festival kaynakları incelenerek hazırlanan EGFF önerisi. Aşağıdaki kurumlar EGFF’nin partneri olarak gösterilmemektedir.</p></div><div className="sponsor-research-grid">{sponsorResearch.map(source=><article key={source.name}><h3>{source.name}</h3><p>{source.finding}</p><p className="sponsor-research-adaptation"><strong>EGFF’ye uyarlama</strong>{source.adaptation}</p><div>{source.links.map(link=><a className="sponsor-source-link" key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15}/></a>)}</div></article>)}</div><p className="sponsor-research-date">Kaynak inceleme: 15 Eylül 2026. Firma faaliyetleri kaynaklara dayanır; EGFF ile eşleştirmeler öneridir. Bu sayfa fiyat teklifi veya sponsorluk sözleşmesi değildir.</p></section>
  </div>
 </>;
}
