import type { Metadata } from "next";
import { AlertTriangle, ExternalLink, FileCheck2, Landmark, Scale, ShieldCheck } from "lucide-react";
import { CharterViewer } from "@/components/charter-viewer";
import { PageHero } from "@/components/page-hero";
import { charterAnnexes } from "@/lib/charter";

export const metadata: Metadata = {
  title: "Tüzük Taslağı",
  description: "Eskişehir Turizm Altyapı Hizmet Birliği için 5355 sayılı Kanun ve emsal turizm altyapı hizmet birlikleri dikkate alınarak hazırlanan çalışma taslağı.",
};

export default function CharterPage() {
  return (
    <main id="ana-icerik">
      <PageHero eyebrow="Kurumsal Belge · Çalışma Taslağı" title="Eskişehir Turizm Altyapı Hizmet Birliği Tüzüğü" lead="5355 sayılı Kanunun zorunlu tüzük başlıkları ile turizm altyapı hizmet birliklerinin uygulama örnekleri esas alınarak Eskişehir’in 14 ilçeli modeli, Valilik öncülüğü, sekretarya, dijitalleşme ve ölçülebilir etki yaklaşımına uyarlanmıştır." />

      <section className="charter-notice"><div className="site-shell"><div><AlertTriangle aria-hidden="true" size={23} /><p><strong>TASLAK – onaylanmış kuruluş belgesi değildir.</strong> Üye mahallî idareler, temsil sayıları, devredilecek hizmetler, katkı payı ve hukuki sekretarya mekanizması; yetkili meclis kararları, hukuk/mali hizmetler incelemesi ve mevzuattaki onay süreciyle kesinleşmelidir.</p></div></div></section>

      <section className="content-section">
        <div className="site-shell">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Scale, "Kanuni omurga", "Ad, amaç, üyeler, merkez, süre, devredilen hizmetler, organlar, temsil, katılım payı, bütçe, hizmetten yararlanma, değişiklik ve tasfiye başlıkları işlendi."],
              [Landmark, "Yetki ayrımı", "Valilik stratejik öncülüğü ile Meclis–Encümen–Başkanın kanuni karar yetkileri ayrıldı; Valiliğin kendiliğinden üye olmadığı açıklandı."],
              [ShieldCheck, "Modern kamu standardı", "Veri yönetişimi, yapay zekâ etiği, erişilebilirlik, iklim, performans, risk ve şeffaflık hükümleri Eskişehir modeline eklendi."],
            ].map(([Icon, title, text]) => <article className="card p-7" key={String(title)}><span className="icon-box"><Icon aria-hidden="true" size={22} /></span><h2 className="mt-6 text-xl font-bold">{String(title)}</h2><p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p></article>)}
          </div>

          <div className="source-panel">
            <div><p className="eyebrow">Araştırma dayanağı</p><h2 className="font-serif text-3xl">Resmî mevzuat ve emsal tüzükler</h2><p className="mt-3 text-sm leading-7 text-[#5b6670]">Metin birebir kopya değildir; zorunlu unsurlar korunarak Eskişehir’in kurumsal ihtiyacına göre yeniden yazılmıştır.</p></div>
            <div className="source-links">
              <a href="https://www.icisleri.gov.tr/illeridaresi/birlikler" rel="noreferrer" target="_blank"><strong>İçişleri Bakanlığı · Birlikler</strong><span>5355 kapsamı ve zorunlu tüzük unsurları</span><ExternalLink aria-hidden="true" size={15} /></a>
              <a href="https://www.kaphib.org/icerik/tuzuk/25" rel="noreferrer" target="_blank"><strong>KAPHİB Tüzüğü</strong><span>Koruma, geliştirme, tanıtım ve altyapı görevleri</span><ExternalLink aria-hidden="true" size={15} /></a>
              <a href="https://atgab.gov.tr/tuzuk/" rel="noreferrer" target="_blank"><strong>ATGAB Tüzüğü</strong><span>Organlar, bütçe ve uygulama yapısı</span><ExternalLink aria-hidden="true" size={15} /></a>
            </div>
          </div>

          <div className="mt-14"><CharterViewer /></div>
        </div>
      </section>

      <section className="content-section soft-section">
        <div className="site-shell"><div className="max-w-3xl"><p className="eyebrow">Zorunlu ekler</p><h2 className="section-title">Boşluk bırakılan karar alanları görünür.</h2><p className="section-copy">Tüzüğün güvenilir olması, henüz alınmamış kararları olmuş gibi yazmamakla başlar. Aşağıdaki ekler kuruluş işlemleri sırasında tamamlanmalıdır.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2">{charterAnnexes.map(([code, title, status]) => <div className="card flex gap-4 p-6" key={code}><span className="icon-box shrink-0"><FileCheck2 aria-hidden="true" size={20} /></span><div><p className="text-xs font-extrabold tracking-[.12em] text-[#8e0d2c] uppercase">{code}</p><h3 className="mt-2 font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-[#65717b]">{status}</p></div></div>)}</div></div>
      </section>
    </main>
  );
}
