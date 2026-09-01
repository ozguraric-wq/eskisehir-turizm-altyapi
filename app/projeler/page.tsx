/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  Bike,
  Bot,
  BusFront,
  CalendarDays,
  Camera,
  Caravan,
  CheckCircle2,
  Clapperboard,
  Database,
  Film,
  GraduationCap,
  Headphones,
  MapPinned,
  Mic2,
  QrCode,
  Route,
  ShieldCheck,
  Sparkles,
  Store,
  TentTree,
  UsersRound,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { siteAsset } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Projeler ve Faaliyet Alanları",
  description: "Turist karşılama, yapay zekâ destekli rota, kamp-karavan, film ve motokros projelerinin kapsamı.",
};

const fields = [
  [MapPinned, "Destinasyon yönetimi", "14 ilçenin çekim, deneyim ve konaklama rollerini tek plan altında ilişkilendirmek."],
  [TentTree, "Turizm altyapısı", "Yönlendirme, erişim, karşılama, rota, dinlenme ve uygun konaklama altyapısını standartlaştırmak."],
  [Bot, "Dijital ziyaretçi hizmeti", "Doğrulanmış içerik, kişiselleştirilmiş rota, QR anlatı ve karar destek sistemini kurmak."],
  [GraduationCap, "Eğitim ve kapasite", "Gençleri, yerel rehberleri, işletmeleri ve üreticileri turizm değer zincirine hazırlamak."],
  [CalendarDays, "Etkinlik ve spor ekonomisi", "Festival, film üretimi ve spor organizasyonlarını yıl boyu ziyaretçi hareketine dönüştürmek."],
];

export default function ProjectsPage() {
  return (
    <main id="ana-icerik">
      <PageHero
        eyebrow="Projeler ve Faaliyet Alanları"
        title="Tek tek etkinlikler değil, birbirini besleyen bir turizm sistemi."
        lead="Birliğin planlanan proje portföyü; ziyaretçi hizmetinden önce altyapı, yatırım, veri ve insan kaynağı kapasitesi kurar. Bu sayfadaki programların uygulama takvimi yetkili organ kararlarıyla kesinleşecektir."
      />

      <section className="content-section" id="faaliyet-alanlari">
        <div className="site-shell">
          <p className="eyebrow">Beş ana faaliyet alanı</p>
          <h2 className="section-title max-w-4xl">Altyapı, dijital hizmet, eğitim ve etkinlik aynı hedefe bağlanır.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {fields.map(([Icon, title, text], index) => (
              <article className="card relative overflow-hidden p-6" key={String(title)}>
                <span className="absolute top-4 right-5 font-serif text-4xl text-[#ede6db]">0{index + 1}</span>
                <Icon className="relative text-[#8e0d2c]" aria-hidden="true" size={24} />
                <h3 className="relative mt-7 text-lg font-bold">{String(title)}</h3>
                <p className="relative mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section soft-section" id="karsilama">
        <div className="site-shell grid items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <span className="status-pill">Planlanan hizmet</span>
            <p className="eyebrow mt-7">Turist karşılama noktaları</p>
            <h2 className="section-title">Ziyaretçinin ilk sorusundan ikinci gününe kadar.</h2>
            <p className="section-copy">
              Karşılama noktaları broşür dağıtan bir masa değil; doğrulanmış şehir verisini, yerel insan bilgisini ve akıllı rota sistemini bir araya getiren hizmet merkezidir. Ulaşım düğümleri ve yoğun ziyaret alanları esas alınarak kademeli biçimde planlanır.
            </p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {["Çok dilli ve erişilebilir bilgi", "Etkinlik ve açık/kapalı alan durumu", "Yerel rehber ve işletme yönlendirmesi", "Mobil cihaza rota aktarımı"].map((item) => (
                <div className="flex gap-2.5 text-sm font-semibold" key={item}><CheckCircle2 className="shrink-0 text-[#8e0d2c]" aria-hidden="true" size={19} />{item}</div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] bg-[#17212b] p-7 text-white md:p-10">
            <p className="text-xs font-extrabold tracking-[.14em] text-[#edc887] uppercase">Örnek ziyaretçi akışı</p>
            <div className="mt-8 grid gap-3">
              {[
                [UsersRound, "1 · Karşılan", "Süre, ilgi, ulaşım ve erişilebilirlik ihtiyacı anlaşılır."],
                [Bot, "2 · Rota oluştur", "Doğrulanmış veri içinden uygulanabilir bir program hazırlanır."],
                [BusFront, "3 · Yola çık", "Toplu taşıma, araç, yürüyüş ve aktarma seçenekleri birlikte gösterilir."],
                [QrCode, "4 · Yerinde keşfet", "QR anlatıları, sesli içerik ve yerel hikâyelerle deneyim derinleşir."],
                [Store, "5 · Yerelle buluş", "Üretici, atölye, rehber, sofra ve konaklama rotanın parçası olur."],
              ].map(([Icon, title, text]) => (
                <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[.055] p-4" key={String(title)}>
                  <Icon className="mt-0.5 shrink-0 text-[#edc887]" aria-hidden="true" size={21} />
                  <div><h3 className="font-bold">{String(title)}</h3><p className="mt-1 text-xs leading-6 text-white/60">{String(text)}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="akilli-rota">
        <div className="site-shell">
          <div className="grid items-start gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Yapay zekâ destekli rota</p>
              <h2 className="section-title">Kişiye uygun; kuruma açıklanabilir karar.</h2>
              <p className="section-copy">
                Hedef sistem; ziyaretçinin ilgi alanı, ayırdığı süre, hareket kabiliyeti, mevsim ve ulaşım tercihini işler. Öneri yalnızca popüler noktaları sıralamaz; çalışma saatini, yol süresini, hizmet kapasitesini ve ikinci gün olasılığını dikkate alır. Yayımdaki araç denetlenebilir bir eşleştirme prototipidir.
              </p>
              <Link className="button-primary mt-7" href="/rotani-olustur">Rota aracını dene <ArrowRight aria-hidden="true" size={17} /></Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [Route, "Rota motoru", "Doğrulanmış duraklar, süre ve mesafe kısıtlarıyla gerçekçi gezi zinciri."],
                [Accessibility, "Erişilebilirlik", "Düşük hareket kabiliyeti, dinlenme ihtiyacı ve fiziksel erişim bilgisini hesaba katan seçenekler."],
                [ShieldCheck, "Mahremiyet", "Kişisel profil oluşturmadan; hizmet iyileştirmek için toplulaştırılmış ve anonim kullanım verisi."],
                [Database, "Karar desteği", "İlçe yönelimi, rota tamamlama, yoğunluk ve sezon göstergeleriyle yatırım önceliği."],
              ].map(([Icon, title, text]) => (
                <article className="card p-6" key={String(title)}>
                  <span className="icon-box"><Icon aria-hidden="true" size={21} /></span>
                  <h3 className="mt-5 text-lg font-bold">{String(title)}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section soft-section" id="kamp-karavan">
        <div className="site-shell grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem]">
            <img className="absolute inset-0 h-full w-full object-cover" src={siteAsset("/media/motocross-caravan.webp")} alt="Düzenli kamp ve karavan altyapısı ile kontrollü spor alanını gösteren temsili görünüm" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 text-white">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-[#65061f]">Temsili planlama görseli</span>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">Alan seçimi; koruma kararları, taşıma kapasitesi, su ve atık yönetimi, ulaşım güvenliği ve yerel kabul birlikte değerlendirilerek yapılır.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="status-pill">Planlanan altyapı</span>
            <p className="eyebrow mt-6">Kamp ve karavan alanları</p>
            <h2 className="section-title">Gecelemeyi artıran, doğayı yük altında bırakmayan altyapı.</h2>
            <p className="section-copy">
              Amaç rastgele konaklamayı yaygınlaştırmak değil; uygun noktalarda küçük ve orta ölçekli, rezervasyon ve taşıma kapasitesi yönetilebilen, yerel ekonomiye bağlı alanlar oluşturmaktır.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                [Caravan, "Temel servis", "Temiz su, elektrik, gri/siyah su ve atık ayrıştırma."],
                [ShieldCheck, "Güvenlik", "Aydınlatma, acil durum, yangın ve saha yönetim standardı."],
                [TentTree, "Doğa uyumu", "Geçirgen yüzey, gölgeleme, düşük iz ve kontrollü kapasite."],
                [Store, "Yerel bağ", "Yakın üretici, pazar, rehber ve deneyimlere yönlendirme."],
              ].map(([Icon, title, text]) => (
                <div className="rounded-2xl border border-[#ded7cc] bg-white p-5" key={String(title)}>
                  <Icon className="text-[#8e0d2c]" aria-hidden="true" size={22} />
                  <h3 className="mt-4 font-bold">{String(title)}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#65717b]">{String(text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="kultur-spor">
        <div className="site-shell">
          <div className="max-w-4xl">
            <p className="eyebrow">Kültür, eğitim ve spor programları</p>
            <h2 className="section-title">Takvimde bir gün değil, şehirde kalıcı kapasite.</h2>
            <p className="section-copy">Festival, akademi ve motokros merkezi; kuruluş ve izin süreçleri tamamlandığında turizm altyapısını görünür kılması ve yıl boyunca ziyaretçi, öğrenci, sporcu, ekip ve izleyici hareketi üretmesi planlanan öncü programlardır.</p>
          </div>

          <article className="mt-12 overflow-hidden rounded-[2rem] bg-[#17212b] text-white" id="film-festivali">
            <div className="grid lg:grid-cols-2">
              <div className="relative min-h-[430px]"><img className="absolute inset-0 h-full w-full object-cover" src={siteAsset("/media/film-academy.webp")} alt="Genç sinemacılar ve açık hava film gösterimi" /></div>
              <div className="p-8 md:p-12">
                <span className="status-pill border-white/20 bg-white/10 text-white">Planlanan program</span>
                <div className="flex flex-wrap gap-2"><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">30 yaş altı</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">4 gün</span><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">Haziran 2027 hedefi</span></div>
                <h3 className="mt-7 font-serif text-4xl">Eskişehir Gençlik Film Festivali</h3>
                <p className="mt-5 text-sm leading-7 text-white/70">İlk edisyonun Haziran 2027’nin son haftasında, dört gün olarak gerçekleştirilmesi hedeflenir. Gündüz kapalı salon gösterimleri, akşam açık hava gösterimleriyle tamamlanır.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {["Kısa kurmaca yarışması", "Kısa belgesel yarışması", "Uluslararası jüri", "16–22 yaş gençlik jürisi", "İlçelerde mobil gösterimler", "Frigya çekim lokasyonları"].map((item) => <div className="flex gap-2 text-xs font-semibold text-white/80" key={item}><CheckCircle2 className="shrink-0 text-[#edc887]" aria-hidden="true" size={17} />{item}</div>)}
                </div>
                <div className="mt-7 grid gap-3">
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/65">Ödüllerin, Midas Anıtı formundan esinlenen ve Eskişehirli zanaatkârların lületaşından üreteceği özgün tasarımlar olması planlanır.</p>
                  <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/65"><strong className="text-white">Frigya çekim rotası:</strong> Han’da Midas Anıtı, Seyitgazi’de kaya anıtları ve Sivrihisar’ın tarihî sokakları genç yapımlar için izin ve koruma koşulları gözetilen lokasyon ağına dönüştürülür.</p>
                </div>
              </div>
            </div>
          </article>

          <article className="mt-6 grid gap-8 rounded-[2rem] border border-[#ded7cc] bg-white p-8 md:p-12 lg:grid-cols-[.75fr_1.25fr]" id="film-akademisi">
            <div>
              <span className="icon-box"><GraduationCap aria-hidden="true" size={24} /></span>
              <span className="status-pill ml-3">Planlanan program</span>
              <p className="eyebrow mt-6">12 aylık ücretsiz program</p>
              <h3 className="font-serif text-4xl">Film Akademisi</h3>
              <p className="mt-5 text-sm leading-7 text-[#5b6670]">Üniversiteler ve halk eğitimi merkezleriyle geliştirilmesi öngörülen akademi, festivalin yıl boyu süren üretim ve insan kaynağı ayağıdır.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                [Clapperboard, "Senaryo", "Fikirden kısa film senaryosuna"],
                [Camera, "Görüntü", "Kamera, ışık ve görsel anlatım"],
                [Film, "Kurgu", "Hikâye ritmi ve post-prodüksiyon"],
                [Headphones, "Ses", "Kayıt, tasarım ve miks"],
                [Mic2, "Uygulama", "Ekip kurma ve sahada üretim"],
                [Sparkles, "Gösterim", "Üretimlerin şehir ve ilçelerle buluşması"],
              ].map(([Icon, title, text]) => (
                <div className="flex gap-4 rounded-2xl bg-[#f5f1ea] p-4" key={String(title)}><Icon className="mt-0.5 shrink-0 text-[#8e0d2c]" aria-hidden="true" size={20} /><div><h4 className="font-bold">{String(title)}</h4><p className="mt-1 text-xs leading-6 text-[#66717a]">{String(text)}</p></div></div>
              ))}
            </div>
          </article>

          <article className="mt-6 overflow-hidden rounded-[2rem] border border-[#ded7cc] bg-[#f5f1ea]" id="motokros">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <span className="icon-box"><Bike aria-hidden="true" size={24} /></span>
                <span className="status-pill ml-3">Planlanan merkez</span>
                <p className="eyebrow mt-6">Han · Frigya</p>
                <h3 className="font-serif text-4xl">Frigya Motokros ve Spor Turizmi Merkezi</h3>
                <p className="mt-5 text-sm leading-7 text-[#5b6670]">Eskişehir’in Frig kimliğine, alan hassasiyetine ve ilçe ekonomisine göre; yarış, eğitim ve sporcu kampı işlevlerini yıl boyu kullanımla birleştirecek şekilde planlanan merkez.</p>
                <div className="mt-7 grid gap-3">
                  {["Şampiyona parkuru ile eğitim parkurlarının ayrılması", "Türkiye Şampiyonası etapları ve Avrupa ölçekli organizasyon hedefi", "Sporcu kampları ve genç sporcu eğitimleri", "Han'dan Seyitgazi, Frigya ve kent merkezine yayılan ziyaretçi akışı", "Konaklama, ulaşım, yeme-içme ve yerel hizmetlerde ekonomik etki"].map((item) => <div className="flex gap-2.5 text-sm font-semibold" key={item}><CheckCircle2 className="shrink-0 text-[#8e0d2c]" aria-hidden="true" size={19} />{item}</div>)}
                </div>
              </div>
              <div className="relative min-h-[520px]"><img className="absolute inset-0 h-full w-full object-cover" src={siteAsset("/media/motocross-caravan.webp")} alt="Motokros eğitim parkuru ve kamp-karavan alanını gösteren temsili planlama görseli" /><span className="absolute right-5 bottom-5 rounded-full bg-[#17212b]/90 px-3 py-1.5 text-xs font-bold text-white">Korunan alanlardan ayrı planlama</span></div>
            </div>
          </article>

          <section className="programme-impact">
            <div><p className="eyebrow">Şehir ekonomisine etki zinciri</p><h3>Etkinliğin değeri bilet sayısında değil, bıraktığı kapasitede.</h3></div>
            <div className="programme-impact-grid">{[
              ["Konaklama", "Festival konuğu, film ekibi, sporcu ve takım için geceleme talebi."],
              ["Yerel tedarik", "Ulaşım, teknik ekipman, dekor, güvenlik, yeme-içme ve saha hizmetleri."],
              ["Nitelikli iş", "Akademi mezunu gençlerin set, kurgu, ses, etkinlik ve içerik üretimine katılması."],
              ["İlçe dolaşımı", "Mobil gösterim, çekim lokasyonu ve yarış öncesi/sonrası rota ile merkez dışına akış."],
              ["Şehir markası", "Yapım, yayın, spor medyası ve katılımcı içerikleriyle uzun ömürlü görünürlük."],
              ["Yatırım mirası", "Ölçülen talebin sonraki altyapı, eğitim ve hizmet standardına veri sağlaması."],
            ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h4>{title}</h4><p>{text}</p></article>)}</div>
          </section>
        </div>
      </section>

      <section className="content-section soft-section">
        <div className="site-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="eyebrow">Eşgüdümlü çalışmalar</p>
            <h2 className="section-title">Aynı hedefe çalışan, kurumsal olarak ayrı projeler.</h2>
          </div>
          <div className="card p-7 md:p-9">
            <span className="status-pill">Bağımsız proje</span>
            <h3 className="mt-6 font-serif text-3xl">Bi’de Beni Tek Çek</h3>
            <p className="mt-4 text-sm leading-7 text-[#5b6670]">Bu çalışma Birlik projesi değildir. Rota verisi, görsel anlatı, ziyaretçi yönlendirmesi ve tanıtım standartlarında Birlikle stratejik eşgüdüm kurabilecek bağımsız bir projedir. Kurumsal sahiplik ve bütçe ilişkisi birbirinden açıkça ayrılır.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#65061f] p-9 text-white md:flex-row md:items-center md:p-14">
          <div><p className="text-xs font-extrabold tracking-[.15em] text-[#edc887] uppercase">Bugün ziyaret edilebilen Eskişehir</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">Planlanan projeleri gezi noktası saymadan, mevcut değerlerden çoklu rota üretin.</h2></div>
          <Link className="button-light shrink-0" href="/rotani-olustur">Mevcut rotaları oluştur <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
