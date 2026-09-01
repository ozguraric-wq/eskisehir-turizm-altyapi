import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink, Landmark, Mountain, Route, ScrollText, ShoppingBag, UsersRound } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { DistrictExplorer } from "@/components/district-explorer";
import { geographicIndications } from "@/lib/content";

export const metadata: Metadata = {
  title: "14 İlçe",
  description: "Eskişehir'in 14 ilçesi için çekim, deneyim ve bağlantı-konaklama rollerine dayalı turizm modeli.",
};

export default function DistrictsPage() {
  return (
    <main id="ana-icerik">
      <PageHero
        eyebrow="Eskişehir’i Keşfet"
        title="14 ilçe, 14 ayrı karakter, tek ziyaretçi ağı."
        lead="Birlik her ilçeye aynı tesisi önermek yerine, o ilçenin gerçek değerine ve kapasitesine uygun rol tanımlar; rotaları bu roller arasında kurar."
      />

      <section className="content-section" id="miras">
        <div className="site-shell">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.7fr]"><div><p className="eyebrow">Şehrin dört büyük anlatısı</p><h2 className="section-title max-w-4xl">Eskişehir’in tarihî dokusu tek bir mahalleden ibaret değil.</h2></div><p className="section-copy text-sm">Frigya’nın kaya anıtları, Anadolu’nun inanç ve düşünce mirası, UNESCO tescilli ahşap mimari ve yaşayan zanaatlar aynı destinasyon sisteminde birbirini tamamlar.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              [Mountain, "Frigya ve Yazılıkaya", "Han'daki Yazılıkaya/Midas Anıtı; anıtsal kaya cephesi, Midas Şehri çevresi ve resmî Frig yürüyüş parkurlarıyla şehrin dünya ölçeğindeki arkeoloji omurgasıdır.", "https://eskisehir.ktb.gov.tr/TR-364149/yazilikaya-midas-aniti.html"],
              [Landmark, "Seyyid Battal Gazi", "Seyitgazi'deki külliye; mimariyi, inanç tarihini ve antik Nakoleia çevresini aynı kültür koridorunda buluşturur.", "https://eskisehir.ktb.gov.tr/TR-336884/seyyid-battal-gazi-kulliyesi-ve-turbesi-seyitgazi.html"],
              [ScrollText, "UNESCO Sivrihisar", "Sivrihisar Ulu Cami, UNESCO'nun Ortaçağ Anadolu'sunun Ahşap Direkli Camileri seri mirasının Eskişehir bileşenidir.", "https://whc.unesco.org/en/list/1694/"],
              [ShoppingBag, "Yaşayan kültür", "Lületaşı, savat, Sorkun çömleği, kök boyalı kilim ve Sivrihisar zanaatları; ziyaret harcamasını usta ve üreticiyle buluşturur.", "https://ci.turkpatent.gov.tr/cografi-isaretler/liste?il=26"],
            ].map(([Icon, title, text, href]) => <article className="card p-7" key={String(title)}><span className="icon-box"><Icon aria-hidden="true" size={22} /></span><h3 className="mt-6 text-xl font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p><a className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#8e0d2c]" href={String(href)} rel="noreferrer" target="_blank">Resmî kaynak <ExternalLink aria-hidden="true" size={13} /></a></article>)}
          </div>
        </div>
      </section>

      <section className="content-section soft-section">
        <div className="site-shell">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [Landmark, "Çekim", "Ziyaret için güçlü birincil neden oluşturan tarih, kültür veya doğa odağı."],
              [UsersRound, "Deneyim", "Yerel yaşam, üretim, atölye, gastronomi ve rehberlik üzerinden temas."],
              [Building2, "Bağlantı ve konaklama", "Ulaşım, hizmet ve geceleme kapasitesiyle rotaları birbirine bağlayan merkez."],
            ].map(([Icon, title, text]) => (
              <div className="rounded-2xl bg-[#17212b] p-6 text-white" key={String(title)}><Icon className="text-[#edc887]" aria-hidden="true" size={23} /><h2 className="mt-5 text-lg font-bold">{String(title)}</h2><p className="mt-2 text-sm leading-7 text-white/60">{String(text)}</p></div>
            ))}
          </div>
          <div className="mt-12"><DistrictExplorer /></div>
        </div>
      </section>

      <section className="content-section" id="cografi-isaretler">
        <div className="site-shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Coğrafi işaretler</p><h2 className="section-title">Tescil, raftaki etiketten fazlasıdır.</h2><p className="section-copy">Birlik; tescilli ürünleri rota, atölye, yerel sofra, satış noktası ve dijital doğrulamayla ilişkilendirerek bilginin ve gelirin üreticide kalmasını hedefler. Aşağıdaki seçki TÜRKPATENT kayıtlarına doğrudan bağlanır.</p><a className="button-secondary mt-7" href="https://ci.turkpatent.gov.tr/cografi-isaretler/liste?il=26" rel="noreferrer" target="_blank">Eskişehir tam listesini doğrula <ExternalLink aria-hidden="true" size={15} /></a></div>
          <div className="gi-grid">{geographicIndications.map(([name, href], index) => <a href={href} rel="noreferrer" target="_blank" key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><ExternalLink aria-hidden="true" size={14} /></a>)}</div>
        </div>
      </section>

      <section className="content-section soft-section" id="kaynaklar">
        <div className="site-shell grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">İlçe yatırım mantığı</p>
            <h2 className="section-title">Önce envanter, sonra rota, en son ihtiyaç kadar yatırım.</h2>
            <p className="section-copy">Model; mevcut yapı ve işletme kapasitesini kullanmayı, düşük maliyetli mikro altyapı ile eksik bağlantıları tamamlamayı ve büyük yatırımları ölçülen talebe göre aşamalandırmayı öngörür.</p>
          </div>
          <div className="grid gap-3">
            {[
              ["01", "Değer ve hizmet envanteri", "Doğal-kültürel varlık, erişim, işletme ve yerel kapasite doğrulanır."],
              ["02", "İlçe rolü ve rota bağı", "Çekim, deneyim veya konaklama işlevi komşu duraklarla eşleştirilir."],
              ["03", "Mikro altyapı", "Yönlendirme, dinlenme, QR, erişim ve küçük hizmet eksikleri giderilir."],
              ["04", "Ölçüm ve ölçekleme", "Kullanım verisi güçlü olan noktalar için yatırım kademeli büyütülür."],
            ].map(([number, title, text]) => <div className="flex gap-4 rounded-2xl border border-[#ded7cc] bg-white p-4" key={number}><span className="font-serif text-2xl text-[#c89549]">{number}</span><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-xs leading-6 text-[#65717b]">{text}</p></div></div>)}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#65061f] p-9 text-white md:flex-row md:items-center md:p-14">
          <div><p className="text-xs font-extrabold tracking-[.15em] text-[#edc887] uppercase">İlçeleri birbirine bağlayın</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">İlgi alanınıza göre birden fazla ilçeyi kapsayan rotayı görün.</h2></div>
          <Link className="button-light shrink-0" href="/rotani-olustur"><Route aria-hidden="true" size={17} />Rota oluştur <ArrowRight aria-hidden="true" size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
