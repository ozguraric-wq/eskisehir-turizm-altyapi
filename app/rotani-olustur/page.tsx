import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, Database, Map, QrCode, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { RoutePlanner } from "@/components/route-planner";
import { routeFamilies, routeStops } from "@/lib/content";

export const metadata: Metadata = {
  title: "Çoklu Rota Oluştur",
  description: "Birden çok ilgi alanı, 1–4 gün, tempo ve ulaşım tercihine göre Eskişehir'in mevcut ziyaret noktalarından alternatif rotalar oluşturun.",
};

export default function RoutePage() {
  return (
    <main id="ana-icerik">
      <PageHero eyebrow="Akıllı Çoklu Rota" title="Tek öneriye mahkûm değilsiniz: Eskişehir’i birkaç farklı biçimde görün." lead="Birden çok ilgi alanı, 1–4 gün, tempo ve ulaşım tercihi seçin. Çalışan prototip yalnızca bugün ziyaret edilebilen değerleri kullanır; henüz devreye alınmayan Birlik projelerini gezi noktası gibi göstermez." />

      <section className="content-section bg-[#fffdf9]" id="rota-araci"><div className="site-shell"><RoutePlanner /></div></section>

      <section className="content-section soft-section" id="hazir-rotalar">
        <div className="site-shell">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_.6fr]"><div><p className="eyebrow">Sekiz ayrıntılı omurga</p><h2 className="section-title max-w-4xl">Merkezden ilçelere dağılan, ikinci günü gerekçelendiren rotalar.</h2></div><p className="section-copy text-sm">Rota omurgaları sabit paket değildir. Mevsim, süre, hareket kabiliyeti ve açık/kapalı durumuna göre akıllı araç tarafından yeniden sıralanır.</p></div>
          <div className="route-library">
            {routeFamilies.map((route, index) => {
              const stops = route.stopIds.map((id) => routeStops[id]).filter(Boolean);
              return <article className="route-library-card" key={route.id}><div className="route-library-number">{String(index + 1).padStart(2, "0")}</div><div><h3>{route.label}</h3><p>{route.strapline}</p><div className="route-library-stops">{stops.map((stop) => <span key={stop.id}>{stop.district} · {stop.name}</span>)}</div><a href="#rota-araci">Tercihlerimle eşleştir <ArrowRight aria-hidden="true" size={15} /></a></div></article>;
            })}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="site-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Map, "Doğrulanabilir içerik", "Her durakta resmî kaynak, ziyaret koşulu, yaklaşık süre ve önceden teyit gereksinimi gösterilir."],
              [QrCode, "Yerinde dijital katman", "Hedef modelde rota telefona aktarılır; QR ve çok dilli sesli anlatıyla ziyaret sırasında da devam eder."],
              [ShieldCheck, "Kamu yararı", "Öneri ticari sıralama yerine ziyaretçi ihtiyacı, koruma koşulu ve harcamanın ilçelere dengeli dağılımını gözetir."],
            ].map(([Icon, title, text]) => <div className="rounded-3xl bg-[#17212b] p-7 text-white" key={String(title)}><Icon className="text-[#edc887]" aria-hidden="true" size={24} /><h3 className="mt-6 text-xl font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-white/65">{String(text)}</p></div>)}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#d6bd94] bg-[#fff8ec] p-7"><div className="flex gap-3"><AlertTriangle className="mt-1 shrink-0 text-[#8e0d2c]" aria-hidden="true" size={22} /><div><h3 className="text-xl font-bold">Ziyaret öncesi son kontrol</h3><p className="mt-3 text-sm leading-7 text-[#5b6670]">Açılış saatleri, ibadet düzeni, kazı alanı erişimi, kırsal yol, hava, üretici randevusu ve toplu ulaşım seferi değişebilir. Rota “kesin açık” vaadi vermez; resmî doğrulama bağlantısı sunar.</p></div></div></div>
            <div className="rounded-3xl border border-[#b8d1c9] bg-[#f0f8f5] p-7"><div className="flex gap-3"><Database className="mt-1 shrink-0 text-[#315c50]" aria-hidden="true" size={22} /><div><h3 className="text-xl font-bold">Üretim sürümünün veri mimarisi</h3><p className="mt-3 text-sm leading-7 text-[#4d625b]">İlgili kurumların doğruladığı mekân ve etkinlik verisi, anonim rota tamamlanma ve ilçe akışı göstergeleriyle birlikte kullanılır. Kişisel profil çıkarmadan hizmet ve yatırım kararını iyileştirmek hedeflenir.</p></div></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
