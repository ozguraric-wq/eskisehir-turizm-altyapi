import {ArrowUpRight} from 'lucide-react';
import {awardDesigns} from '@/lib/festival/awards';
import {awards} from '@/lib/festival/content';
import {LinkButton,SectionHeading} from './shared';

export function AwardsTeaser(){
  return <section className="award-teaser" aria-labelledby="award-teaser-title">
    <div className="award-teaser-picture"><img src="./images/awards/altin-midas-640.webp" width="640" height="640" loading="lazy" decoding="async" alt={awardDesigns[0].alt}/></div>
    <div className="award-teaser-copy">
      <span className="eyebrow">PLANLANAN ÖDÜLLER</span>
      <h2 id="award-teaser-title">Lületaşından<br/>sinemaya.</h2>
      <p>Midas’ın cephesi, Porsuk’un akışı, genç yeteneğin potansiyeli. Her ödül, bu şehirden bir hikâye taşıyor.</p>
      <LinkButton to="festival?bolum=oduller" light>Ödülleri ve anlamlarını keşfet</LinkButton>
      <small>Görsel: ödül tasarım önerisi</small>
    </div>
  </section>;
}

export function AwardsGallery(){
  return <section className="section dark-section award-gallery" id="oduller" tabIndex={-1} aria-label="Planlanan ödüller ve anlamları">
    <div className="award-gallery-inner">
      <SectionHeading eyebrow="PLANLANAN ÖDÜLLER · 2027" title={"Bu şehrin elinden.\nSenin hikâyene."}>
        <p>Tamamının Eskişehir lületaşından, şehrin kendi ustaları tarafından üretilmesi planlanıyor. Kültürel mirası genç sinemacılara taşıyan beş simge, altı ödül.</p>
      </SectionHeading>
      <div className="award-gallery-meta"><span>BEŞ TASARIM · ALTI ÖDÜL</span><p>Altın Midas, kurmaca ve belgeselde ayrı ayrı verilir.</p></div>
      <div className="award-collection">
        {awardDesigns.map((award,i)=>{
          const categories=awards.filter(a=>a[0]===award.name);
          return <article className={'award-object '+(i===0?'award-object-featured':'')} key={award.id} aria-labelledby={'award-title-'+award.id}>
            <figure className="award-object-figure">
              <img src={'./images/awards/'+award.image+'-960.webp'} srcSet={'./images/awards/'+award.image+'-640.webp 640w, ./images/awards/'+award.image+'-960.webp 960w'} sizes="(max-width: 600px) 88vw, (max-width: 900px) 45vw, 42vw" width="960" height="960" loading="lazy" decoding="async" alt={award.alt}/>
              <figcaption><span>{String(i+1).padStart(2,'0')} / 05</span><span>TASARIM ÖNERİSİ</span></figcaption>
            </figure>
            <div className="award-object-copy">
              <p className="award-symbol">{award.symbol}</p>
              <h3 id={'award-title-'+award.id}>{award.name}</h3>
              <div className="award-categories" aria-label="Bölümler ve karar mercileri">{categories.map(c=><div key={c[1]}><strong>{c[1]}</strong><span>{c[2]}</span></div>)}</div>
              <p className="award-meaning">{award.meaning}</p>
              <dl className="award-form"><dt>Formun hikâyesi</dt><dd>{award.form}</dd></dl>
              {award.note&&<p className="award-specific-note">{award.note}</p>}
            </div>
          </article>;
        })}
      </div>
      <div className="award-craft-story">
        <div><span className="eyebrow">NEDEN LÜLETAŞI?</span><h3>Bir ödülün içinde<br/>bir şehrin emeği.</h3></div>
        <p>Lületaşı tercihi, Eskişehir’in el sanatını her yıl sinema sahnesinde görünür kılmayı amaçlar. Yerel ustaların emeğiyle üretilecek her ödül, kazanan yönetmenin yanında götüreceği somut bir kültürel hatıraya dönüşür.</p>
      </div>
      <div className="award-gallery-footer"><p>Ödül adları, bölümleri ve karar mercileri güncel uygulama sunumuna dayanır. Görseller, belgelerdeki form ve malzeme tariflerini yorumlayan tasarım önerileridir. Nihai biçim, renk ayrıntıları ve işçilik yerel lületaşı ustalarıyla netleşecektir.</p><a className="text-link" href="#/juri">Jüriler ve değerlendirme <ArrowUpRight size={19}/></a></div>
    </div>
  </section>;
}
