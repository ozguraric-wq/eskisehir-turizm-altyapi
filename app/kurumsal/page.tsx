/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Cpu,
  ExternalLink,
  FileCheck2,
  FileText,
  Goal,
  Handshake,
  Landmark,
  Leaf,
  MapPinned,
  Network,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { siteAsset } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Kurumsal",
  description: "Birliğin amacı, yönetim modeli, görev alanları, misyonu ve şeffaflık yaklaşımı.",
};

export default function CorporatePage() {
  return (
    <main id="ana-icerik">
      <PageHero
        eyebrow="Kurumsal"
        title="Turiste yol göstermenin ötesinde, şehrin turizm dinamiklerine yön veren kamu kapasitesi."
        lead="Eskişehir Turizm Altyapı Hizmet Birliği; yatırım sırasını, altyapı standardını, veri yönetimini ve ilçe rollerini ortaklaştırmak üzere Vizyon Eskişehir 2036 kapsamında geliştirilen; diğer illere emsal olmayı hedefleyen kurumsal modeldir."
      />

      <section className="content-section" id="birlik-hakkinda">
        <div className="site-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Birlik neden gerekli?</p>
            <h2 className="section-title">Sorun değer eksikliği değil, bağlantı eksikliği.</h2>
            <p className="section-copy">
              Eskişehir güçlü tarih, doğa, kültür, termal kaynak ve yaratıcı endüstri birikimine sahip. Ancak ziyaretçi hareketi ağırlıkla kent merkezinde ve günübirlik kalıpta yoğunlaşıyor. Proje ön analizindeki yaklaşık 500 bin yıllık ziyaretçi ve yüzde 37–40 konaklama doluluğu kabulü, resmî istatistik iddiası değil; altyapı ile rota yönetimini birlikte ele alan model için çalışma varsayımıdır.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [Network, "Parçalı kararları birleştirir", "Kamu kurumları, yerel yönetimler, üniversiteler, meslek örgütleri ve sektör aynı hedef seti üzerinden çalışır."],
              [Goal, "Yatırımı hedefe yöneltir", "Her ilçeye aynı çözüm yerine, o ilçenin çekim, deneyim veya bağlantı rolüne uygun altyapı kurulur."],
              [UsersRound, "Ziyaretçiyi yerelle buluşturur", "Rehber, üretici, zanaatkâr, küçük işletme ve yerel konaklama rota sisteminin görünür parçası olur."],
              [BarChart3, "Sonucu ölçer", "Ziyaretçi yönelimi, rota tamamlama, geceleme ve sezon dağılımı performans göstergelerine dönüşür."],
            ].map(([Icon, title, text]) => (
              <article className="card p-6" key={String(title)}>
                <span className="icon-box"><Icon aria-hidden="true" size={21} /></span>
                <h3 className="mt-5 text-lg font-bold">{String(title)}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section soft-section" id="yonetim">
        <div className="site-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Yönetim ve koordinasyon</p>
            <h2 className="section-title">Valilik öncülüğünde açık sorumluluk zinciri.</h2>
            <p className="section-copy">
              Yönetim modeli, kararın kimde; koordinasyonun, uygulama takibinin ve sekretaryanın kimde olduğunu görünür kılar. Böylece proje üretimi ile kamu yönetimi birbirinden kopmaz.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <article className="rounded-3xl bg-[#65061f] p-8 text-white shadow-xl">
              <span className="inline-flex rounded-xl bg-white/10 p-3"><Landmark aria-hidden="true" size={25} /></span>
              <p className="mt-7 text-xs font-extrabold tracking-[.14em] text-[#edc887] uppercase">Öncülük ve üst koordinasyon</p>
              <h3 className="mt-3 font-serif text-3xl">Eskişehir Valiliği</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">Kurumlar arası eşgüdüm, stratejik yön, kamu kaynaklarının uyumu ve il ölçeğindeki temsil.</p>
            </article>
            <article className="rounded-3xl bg-[#17212b] p-8 text-white shadow-xl lg:translate-y-6">
              <span className="inline-flex rounded-xl bg-white/10 p-3"><Building2 aria-hidden="true" size={25} /></span>
              <p className="mt-7 text-xs font-extrabold tracking-[.14em] text-[#edc887] uppercase">Koordinasyon · yönetim takibi · sekretarya</p>
              <h3 className="mt-3 font-serif text-3xl">İl Sosyal Etüt ve Proje Müdürlüğü</h3>
              <p className="mt-4 text-sm leading-7 text-white/75">Proje portföyü, paydaş süreci, karar takibi, raporlama, toplantı düzeni ve kurumsal hafızanın yürütülmesi.</p>
            </article>
            <article className="rounded-3xl border border-[#ded7cc] bg-white p-8 shadow-xl lg:translate-y-12">
              <span className="icon-box"><Handshake aria-hidden="true" size={25} /></span>
              <p className="mt-7 text-xs font-extrabold tracking-[.14em] text-[#8e0d2c] uppercase">Uygulama ve katkı ağı</p>
              <h3 className="mt-3 font-serif text-3xl">Şehir paydaşları</h3>
              <p className="mt-4 text-sm leading-7 text-[#5b6670]">Büyükşehir ve ilçe belediyeleri, kamu kurumları, üniversiteler, meslek kuruluşları, turizm işletmeleri ve yerel topluluklar.</p>
            </article>
          </div>

          <div className="mt-24 rounded-2xl border border-[#d6bd94] bg-[#fff8ec] p-6 text-sm leading-7 text-[#5c4931]">
            <strong className="block text-[#65061f]">Kurumsal statü notu</strong>
            Bu yapı Vizyon Eskişehir 2036 kapsamında önerilen kuruluş modelidir. Hukuki statü, üyelik yapısı, organlar, bütçe ve görev devri; ilgili mevzuat ile yetkili organ kararları sonucunda kesinleşir. Eskişehir Büyükşehir Belediyesi modelde öncü makam değil, uygulama ve iş birliği paydaşlarından biridir.
          </div>
        </div>
      </section>

      <section className="content-section" id="kalkinma-plani">
        <div className="site-shell">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.65fr]"><div><p className="eyebrow">12. Kalkınma Planı × Vizyon Eskişehir 2036</p><h2 className="section-title max-w-4xl">Ulusal hedefi, ilçe ölçeğinde çalışan sisteme dönüştürmek.</h2></div><p className="section-copy text-sm">Birlik; plan belgesindeki destinasyon yönetimi, turizmde dijitalleşme, değer zinciri paydaşlarının bağlantısı, çeşitlendirme, kalite ve sürdürülebilirlik yönelimlerini Eskişehir’in 2036 ufkuyla buluşturur.</p></div>
          <div className="plan-alignment-grid">
            {[
              [MapPinned, "Destinasyon bazlı yönetim", "14 ilçeyi ayrı tanıtım dosyaları değil; ortak veri, rota, yatırım ve hizmet standardı olan tek destinasyon ağı olarak ele alır."],
              [Cpu, "Uçtan uca dijital yolculuk", "Ziyaret öncesi planlamadan yerinde QR anlatıya, anonim geri bildirimden kamu yatırım kararına kadar dijital süreklilik kurar."],
              [Network, "Değer zinciri bağlantısı", "Kamu, yerel yönetim, üniversite, rehber, işletme, üretici ve zanaatkârı açık görev ve ortak gösterge setiyle ilişkilendirir."],
              [Leaf, "Çeşitlilik ve sürdürülebilirlik", "Merkez yoğunluğunu ilçelere ve dört mevsime dağıtır; yeni yatırımı koruma, taşıma kapasitesi ve ölçülen ihtiyaçla sınırlar."],
            ].map(([Icon, title, text], index) => <article key={String(title)}><span>0{index + 1}</span><Icon aria-hidden="true" size={23} /><h3>{String(title)}</h3><p>{String(text)}</p></article>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3"><a className="button-secondary" href="https://www.sbb.gov.tr/wp-content/uploads/2023/12/On-Ikinci-Kalkinma-Plani_2024-2028_11122023.pdf" rel="noreferrer" target="_blank">12. Kalkınma Planı <ExternalLink aria-hidden="true" size={15} /></a><Link className="button-primary" href="/tuzuk">Tüzük taslağını incele <ArrowRight aria-hidden="true" size={16} /></Link></div>
        </div>
      </section>

      <section className="content-section soft-section" id="ilkeler">
        <div className="site-shell">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-[#17212b] p-9 text-white md:p-12">
              <span className="text-xs font-extrabold tracking-[.15em] text-[#edc887] uppercase">Misyon</span>
              <p className="mt-7 font-serif text-3xl leading-snug md:text-4xl">Eskişehir’in doğal, tarihî ve kültürel değerlerini koruyarak erişilebilir turizm altyapısına; bu altyapıyı da yerel refaha dönüştürmek.</p>
            </div>
            <div className="rounded-[2rem] border border-[#ded7cc] bg-white p-9 md:p-12">
              <span className="text-xs font-extrabold tracking-[.15em] text-[#8e0d2c] uppercase">Vizyon</span>
              <p className="mt-7 font-serif text-3xl leading-snug md:text-4xl">2036’da 14 ilçesiyle bağlantılı, dört mevsim ziyaret edilen, veriye dayalı ve sürdürülebilir bir Eskişehir destinasyonu.</p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [ShieldCheck, "Kamu yararı", "Her yatırımın ziyaretçiye, yerel topluma ve uzun vadeli şehir değerine katkısı."],
              [Scale, "Koruma-kullanma dengesi", "Arkeolojik, doğal ve kültürel alanlarda taşıma kapasitesi ve hassasiyet."],
              [BadgeCheck, "Erişilebilir kalite", "Fiziksel, dijital ve içerik erişilebilirliğinde ortak hizmet standardı."],
              [Handshake, "Katılımcılık", "İlçelerin, sektörün ve yerel toplulukların karar ve uygulama sürecine dahil olması."],
            ].map(([Icon, title, text]) => (
              <article className="card p-6" key={String(title)}>
                <Icon className="text-[#8e0d2c]" aria-hidden="true" size={24} />
                <h3 className="mt-5 text-lg font-bold">{String(title)}</h3>
                <p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section soft-section" id="kurumsal-kimlik">
        <div className="site-shell grid items-center gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div className="flex min-h-[560px] items-center justify-center rounded-[2rem] border border-[#ded7cc] bg-white p-10 shadow-xl shadow-black/5">
            <img className="max-h-[500px] w-auto object-contain" src={siteAsset("/brand/logo-full.webp")} alt="Eskişehir Turizm Altyapı Hizmet Birliği logosu" />
          </div>
          <div>
            <p className="eyebrow">Kurumsal kimlik</p>
            <h2 className="section-title">Bir eşiğin içinden geçen ortak rota.</h2>
            <p className="section-copy">Logo tek bir yapıyı işaret etmek yerine Eskişehir’in katmanlı tarihini, ziyaretçi karşılama işlevini ve 14 ilçeyi birbirine bağlayan hizmet ağını aynı soyut dilde buluşturur.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                ["Eşik ve kapı", "Kente geliş, karşılama noktası ve erişilebilir kamu hizmeti."],
                ["Kaya silueti", "Frigya’dan günümüze uzanan çok katmanlı tarih ve coğrafya."],
                ["Rota ve düğümler", "İlçeler, ziyaretçi akışı, doğrulanmış veri ve kesintisiz bağlantı."],
                ["Bordo ve altın", "Kamusal güven, kurumsal ciddiyet, kültürel değer ve gelecek yatırımı."],
              ].map(([title, text]) => <div className="rounded-2xl border border-[#ded7cc] bg-white p-5" key={title}><h3 className="font-bold text-[#65061f]">{title}</h3><p className="mt-2 text-xs leading-6 text-[#65717b]">{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="seffaflik">
        <div className="site-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Şeffaflık ve hesap verebilirlik</p>
            <h2 className="section-title">Belgeye, karara ve sonuca açık kamu yönetimi.</h2>
            <p className="section-copy">Kuruluş tamamlandığında kamuya açık kurumsal belgeler tek merkezde yayımlanacak; proje ilerlemesi yalnızca faaliyet sayısıyla değil, ölçülebilir etkiyle izlenecek.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [FileText, "Tüzük ve görev çerçevesi", "Çalışma taslağı yayımlandı; kuruluş onayıyla kesinleşecek"],
              [Scale, "Meclis ve encümen kararları", "Karar numarası ve tarih ile"],
              [FileCheck2, "Faaliyet ve performans raporları", "İlçe ve proje göstergeleriyle"],
              [BarChart3, "Bütçe, ihale ve yatırım izlemesi", "Mevzuata uygun açık kayıt"],
            ].map(([Icon, title, status]) => (
              <div className="card flex gap-4 p-5" key={String(title)}>
                <span className="icon-box shrink-0"><Icon aria-hidden="true" size={20} /></span>
                <div>
                  <h3 className="font-bold">{String(title)}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#67727b]">{String(status)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#65061f] p-9 text-white md:flex-row md:items-center md:p-14">
          <div>
            <p className="text-xs font-extrabold tracking-[.15em] text-[#edc887] uppercase">Sahadaki karşılığı</p>
            <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">Kurumsal modelin nasıl projeye dönüştüğünü görün.</h2>
          </div>
          <Link className="button-light shrink-0" href="/projeler">Projeleri incele <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
