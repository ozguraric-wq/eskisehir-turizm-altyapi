/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CalendarDays,
  Caravan,
  Check,
  ChevronRight,
  CircleUserRound,
  Compass,
  Film,
  ExternalLink,
  Landmark,
  Mountain,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import { districts, projectCards } from "@/lib/content";

const serviceIcons = [Building2, BarChart3, ShieldCheck, UsersRound, Bot];
const projectIcons = [CircleUserRound, Route, Caravan, Film, Sparkles, Mountain];

export default function Home() {
  return (
    <main id="ana-icerik">
      <section className="relative isolate min-h-[720px] overflow-hidden bg-[#17212b] text-white">
        <img
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src="/media/eskisehir-hero.webp"
          alt="Eskişehir'in ovalarını, kaya dokusunu, su kaynaklarını ve bağlantı yollarını temsil eden panoramik görünüm"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(17,24,32,.96)_0%,rgba(17,24,32,.86)_38%,rgba(17,24,32,.32)_72%,rgba(17,24,32,.15)_100%)]" />
        <div className="site-shell flex min-h-[720px] items-center py-20">
          <div className="max-w-[760px]">
            <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold tracking-[.12em] uppercase backdrop-blur">
              <ShieldCheck aria-hidden="true" size={16} />
              Valilik öncülüğünde ortak turizm koordinasyonu
            </span>
            <h1 className="display-title max-w-[740px] text-white">
              Eskişehir turizmine yön veren ortak kamu kapasitesi.
            </h1>
            <p className="mt-7 max-w-[680px] text-lg leading-8 text-white/85 md:text-xl">
              14 ilçenin yatırım sırasını, hizmet standardını, veri yönetimini ve destinasyon anlatısını ortaklaştıran; Vizyon Eskişehir 2036 kapsamında diğer illere emsal olmak üzere tasarlanan kurumsal model.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="button-light" href="/kurumsal">
                Birliği Tanıyın <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/35 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20" href="/rotani-olustur">
                Çoklu rota oluştur <ChevronRight aria-hidden="true" size={17} />
              </Link>
            </div>
            <div className="mt-12 grid max-w-[720px] grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/20 bg-white/20 sm:grid-cols-4">
              {[
                ["14", "ilçe"],
                ["1", "ortak destinasyon planı"],
                ["4 mevsim", "dengeli ziyaretçi akışı"],
                ["1", "doğrulanmış veri omurgası"],
              ].map(([number, label]) => (
                <div className="bg-[#17212b]/70 px-5 py-5 backdrop-blur" key={label}>
                  <strong className="block font-serif text-3xl font-normal text-[#edc887]">{number}</strong>
                  <span className="mt-1 block text-xs font-semibold text-white/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute right-5 bottom-5 hidden rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[10px] text-white/70 backdrop-blur md:block">
          Temsili kurumsal görselleştirme
        </div>
      </section>

      <section className="border-b border-[#ded7cc] bg-white">
        <div className="site-shell grid md:grid-cols-5">
          {[
            ["Yatırım", "İhtiyaca göre doğru sıra"],
            ["Ölçüm", "Geceleme ve ilçe akışı"],
            ["Standart", "Erişim, koruma ve kalite"],
            ["Koordinasyon", "Kurum, ilçe ve sektör ağı"],
            ["Dijitalleşme", "Doğrulanmış veri ve yapay zekâ"],
          ].map(([title, text], index) => {
            const Icon = serviceIcons[index];
            return (
              <div className="flex gap-3 border-[#ded7cc] px-5 py-6 md:border-r md:last:border-r-0" key={title}>
                <Icon className="shrink-0 text-[#8e0d2c]" aria-hidden="true" size={21} />
                <div>
                  <strong className="block text-sm">{title}</strong>
                  <span className="mt-1 block text-xs leading-5 text-[#65717b]">{text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="content-section" id="katki">
        <div className="site-shell">
          <div className="grid items-start gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div className="lg:sticky lg:top-36">
              <p className="eyebrow">Birlik şehre ne kazandırır?</p>
              <h2 className="section-title">Tanıtımdan fazlası: çalışan bir şehir turizmi işletim sistemi.</h2>
              <p className="section-copy">
                Birliğin temel işi turist danışma hizmeti değildir. Hangi altyapının nerede ve ne zaman yapılacağını; verinin kim tarafından doğrulanacağını; ilçelerin hangi rolü üstleneceğini ve turizm gelirinin yerel ekonomiye nasıl yayılacağını ortak kamu disipliniyle yönetmektir.
              </p>
              <Link className="button-secondary mt-7" href="/kurumsal">
                Kurumsal modeli incele <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Compass, "Dağınık değerleri rotaya çevirir", "Frigya, termal kaynaklar, Sakarya Vadisi, at kültürü, inanç mirası ve zanaat birbirinden kopuk duraklar olmaktan çıkar."],
                [Store, "Yerel ekonomiye temas kurar", "Rota; üretici, rehber, atölye, küçük konaklama tesisi ve yöresel sofrayla planlı biçimde buluşur."],
                [CalendarDays, "Konaklamayı ve sezonu uzatır", "İkinci gün önerileri, etkinlik takvimi ve kamp-karavan seçenekleri günübirlik ziyareti daha uzun kalışa dönüştürür."],
                [BarChart3, "Yatırımı veriye dayandırır", "Anonim rota kullanımı, QR etkileşimi, ziyaret yoğunluğu ve ilçe yönelimi; hangi altyapının önce yapılacağına ışık tutar."],
              ].map(([Icon, title, text]) => (
                <article className="card p-7" key={String(title)}>
                  <span className="icon-box"><Icon aria-hidden="true" size={21} /></span>
                  <h3 className="mt-5 text-xl font-bold tracking-[-.02em]">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section plan-home" id="vizyon">
        <div className="site-shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Ulusal plandan şehir uygulamasına</p><h2 className="section-title">12. Kalkınma Planının turizm ruhu, Vizyon Eskişehir 2036’nın uygulama aracı.</h2><p className="section-copy">Destinasyon bazlı yönetim, dijital yolculuk, paydaşların değer zincirinde bağlanması, turizm çeşitliliği ve sürdürülebilirlik; Birliğin görev ve ölçüm sistemine çevrilir.</p><div className="mt-7 flex flex-wrap gap-3"><Link className="button-primary" href="/kurumsal#kalkinma-plani">Uyum çerçevesi <ArrowRight aria-hidden="true" size={16} /></Link><a className="button-secondary" href="https://www.sbb.gov.tr/kalkinma-planlari/" rel="noreferrer" target="_blank">Resmî planlar <ExternalLink aria-hidden="true" size={15} /></a></div></div>
          <div className="vision-bridge">{[
            ["01", "Destinasyon yönetimi", "14 ilçe için ortak envanter, yatırım önceliği ve hizmet standardı."],
            ["02", "Dijital ve yapay zekâ", "Doğrulanmış veriyle çoklu rota; anonim göstergelerle kamu kararı."],
            ["03", "Yerel değer zinciri", "Rehber, üretici, zanaatkâr, işletme ve konaklamaya ölçülebilir temas."],
            ["04", "Sürdürülebilir altyapı", "Eski Eko Turizm Altyapı Birliği fikrindeki ekolojik omurgayı, seçilen ESTAB kurumsal kimliği altında koruyan yaklaşım."],
          ].map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        </div>
      </section>

      <section className="content-section soft-section" id="projeler">
        <div className="site-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Öncelikli programlar</p>
              <h2 className="section-title max-w-3xl">Birlik çatısı altında birbirini tamamlayan projeler.</h2>
              <p className="section-copy">
                Etkinlikler tek başına hedef değil; altyapıyı görünür kılan, ziyaretçiyi ilçelere taşıyan ve yıl boyu kapasite üreten araçlardır.
              </p>
            </div>
            <Link className="button-secondary shrink-0" href="/projeler">Tüm proje kapsamı <ArrowRight aria-hidden="true" size={17} /></Link>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projectCards.map((project, index) => {
              const Icon = projectIcons[index];
              return (
                <article className="group card flex min-h-[292px] flex-col p-7 transition duration-200 hover:-translate-y-1 hover:shadow-xl" key={project.id}>
                  <div className="flex items-start justify-between gap-4">
                    <span className="icon-box"><Icon aria-hidden="true" size={21} /></span>
                    <span className="text-xs font-extrabold tracking-[.12em] text-[#9b6b2c] uppercase">{project.kicker}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold tracking-[-.03em]">{project.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#5b6670]">{project.summary}</p>
                  <Link className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-[#8e0d2c]" href={project.id === "akilli-rota" ? "/rotani-olustur" : `/projeler#${project.id}`}>
                    Ayrıntıları gör <ArrowRight className="transition group-hover:translate-x-1" aria-hidden="true" size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell">
          <div className="grid overflow-hidden rounded-[2rem] bg-[#17212b] text-white lg:grid-cols-2">
            <div className="relative min-h-[420px]">
              <img className="absolute inset-0 h-full w-full object-cover" src="/media/film-academy.webp" alt="Genç sinemacıların açık hava gösterimiyle birlikte yürüttüğü uygulamalı film çalışması" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#65061f]">Kültür · Eğitim · İlçeler</span>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="mb-4 text-xs font-extrabold tracking-[.16em] text-[#edc887] uppercase">Eskişehir Gençlik Film Festivali + Film Akademisi</p>
              <h2 className="font-serif text-4xl leading-tight tracking-[-.03em] md:text-5xl">Dört günlük festival, on iki aylık üretim ekosistemi.</h2>
              <p className="mt-6 leading-8 text-white/75">
                30 yaş altı sinemacıların kısa kurmaca ve belgeselleri; uluslararası jüri ile 16–22 yaş gençlik jürisi tarafından değerlendirilir. Akademi ise senaryodan sese kadar ücretsiz ve uygulamalı bir üretim hattı kurar. Ödüllü filmler, sineması olmayan ilçelere mobil gösterimle taşınır.
              </p>
              <Link className="button-light mt-8 self-start" href="/projeler#kultur-spor">Programı incele <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>

          <div className="mt-6 grid overflow-hidden rounded-[2rem] border border-[#ded7cc] bg-white lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="eyebrow">Frigya Motokros ve Spor Turizmi Merkezi</p>
              <h2 className="font-serif text-4xl leading-tight tracking-[-.03em] md:text-5xl">Yarış haftasının ötesinde, yıl boyu spor ve konaklama hareketi.</h2>
              <p className="mt-6 leading-8 text-[#56616b]">
                Han’da arkeolojik ve korunan alanların dışında planlanan şampiyona, eğitim ve kamp parkurları; sporcu kamplarını, gençlik eğitimini ve Avrupa ölçekli organizasyonları destekler. Uygun kamp-karavan alanı, yerel rehber ve üretici ağı ekonomik etkinin ilçede kalmasını sağlar.
              </p>
              <Link className="button-primary mt-8 self-start" href="/projeler#motokros">Spor turizmi kapsamı <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
            <div className="relative min-h-[420px] lg:order-last">
              <img className="absolute inset-0 h-full w-full object-cover" src="/media/motocross-caravan.webp" alt="Korunan alanlardan ayrı planlanan motokros parkuru ile düzenli kamp ve karavan alanını gösteren temsili görünüm" />
              <span className="absolute right-5 bottom-5 rounded-full bg-[#17212b]/90 px-3 py-1.5 text-xs font-bold text-white">Temsili planlama görseli</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section dark-section" id="ilceler">
        <div className="site-shell">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.7fr]">
            <div>
              <p className="mb-4 text-xs font-extrabold tracking-[.16em] text-[#edc887] uppercase">14 ilçeli destinasyon modeli</p>
              <h2 className="section-title max-w-3xl text-white">Her ilçeye aynı tesis değil, doğru turizm rolü.</h2>
            </div>
            <p className="text-base leading-8 text-white/70">
              İlçeler çekim, deneyim ve bağlantı/konaklama rolleriyle ele alınır. Önce mevcut değer ve kapasite kullanılır; ardından düşük maliyetli mikro altyapıyla rota tamamlanır.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap gap-2.5">
            {districts.map((district) => (
              <Link
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:border-[#edc887]/60 hover:bg-white/10 hover:text-white"
                href={`/ilceler#${district.name.toLocaleLowerCase("tr-TR").replaceAll("ı", "i").replaceAll("ş", "s").replaceAll("ç", "c").replaceAll("ğ", "g").replaceAll("ü", "u").replaceAll("ö", "o")}`}
                key={district.name}
              >
                {district.name}
              </Link>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              [Landmark, "Çekim", "Ziyaret için güçlü birincil gerekçe oluşturan kültür, tarih veya doğa odağı."],
              [UsersRound, "Deneyim", "Üretici, rehber, atölye, gastronomi ve etkinlik üzerinden yerel temas."],
              [Building2, "Bağlantı ve konaklama", "Ulaşım, geceleme ve hizmet kapasitesiyle rotaları birbirine bağlayan merkez."],
            ].map(([Icon, title, text]) => (
              <div className="rounded-2xl border border-white/12 bg-white/[.045] p-6" key={String(title)}>
                <Icon className="text-[#edc887]" aria-hidden="true" size={23} />
                <h3 className="mt-5 text-lg font-bold">{String(title)}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">{String(text)}</p>
              </div>
            ))}
          </div>
          <Link className="button-light mt-9" href="/ilceler">14 ilçeyi keşfet <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell">
          <div className="text-center">
            <p className="eyebrow">Günübirlikten katma değerli ziyarete</p>
            <h2 className="section-title mx-auto max-w-4xl">Birinci gün keşif, ikinci gün ilçe, geceleme ve yerel gelir.</h2>
            <p className="section-copy mx-auto">
              Kişisel veri toplamadan üretilen toplulaştırılmış kullanım göstergeleri; rota, altyapı ve bütçe önceliklerini kanıta dayalı hâle getirir.
            </p>
          </div>
          <div className="mt-12 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {[
              ["01", "Doğrulanmış giriş", "Süre, ilgi ve açık noktalar anlaşılır"],
              ["02", "İlk gün", "Kent değeri doğru anlatıyla derinleşir"],
              ["03", "Yerel harcama", "Sofra, usta, rehber ve üreticiye temas"],
              ["04", "İkinci gün bağı", "Frigya, vadi, inanç veya UNESCO rotası"],
              ["05", "Geceleme", "Akşam programı ve konaklama gerekçesi"],
              ["06", "Anonim ölçüm", "İlçe akışı yatırıma ve standarda döner"],
            ].map(([number, title, text], index) => (
              <div className="relative rounded-2xl border border-[#ded7cc] bg-white p-5" key={number}>
                <span className="font-serif text-3xl text-[#c89549]">{number}</span>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#65717b]">{text}</p>
                {index < 5 && <ArrowRight className="absolute top-1/2 -right-[17px] z-10 hidden rounded-full bg-[#fffdf9] p-1 text-[#8e0d2c] xl:block" aria-hidden="true" size={30} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="site-shell">
          <div className="grid gap-8 rounded-[2rem] border border-[#ded7cc] bg-[#f5f1ea] p-8 md:p-12 lg:grid-cols-[1.2fr_.8fr] lg:p-16">
            <div>
              <span className="status-pill">Kuruluş hazırlığı</span>
              <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight tracking-[-.03em] md:text-5xl">Kamu ciddiyeti, ortak akıl ve ölçülebilir sonuç.</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#56616b]">
                Model; Eskişehir Valiliği öncülüğünde, Eskişehir İl Sosyal Etüt ve Proje Müdürlüğünün koordinasyon, yönetim takibi ve sekretaryasıyla; yerel yönetimler, üniversiteler, meslek kuruluşları ve turizm paydaşlarının katkısını bir araya getirir.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              {["Yetki ve sorumluluğu açık kurumsal yapı", "İlçe bazlı proje ve yatırım izleme", "Kamuya açık rapor, karar ve performans göstergeleri", "Koruma-kullanma dengesi ve erişilebilir tasarım"].map((item) => (
                <div className="flex items-start gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold" key={item}>
                  <Check className="mt-0.5 shrink-0 text-[#8e0d2c]" aria-hidden="true" size={18} />
                  {item}
                </div>
              ))}
              <Link className="button-primary mt-3 self-start" href="/kurumsal#yonetim">Yönetim yapısı <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
