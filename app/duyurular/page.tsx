import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, FileText, Megaphone, Newspaper, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = { title: "Duyurular", description: "Kuruluş süreci, proje takvimi, etkinlikler ve kurumsal belge merkezi." };

const preparationItems = [
  ["Kurumsal", "Kuruluş ve paydaş katılım modeli", "Birlik organları, üyelik ve kurumlar arası görev çerçevesinin yetkili süreçlerle kesinleştirilmesi."],
  ["Veri", "14 ilçe turizm envanteri", "Durak, hizmet, erişim, çalışma saati, rota ve yerel işletme verisinin ortak standartta doğrulanması."],
  ["Hizmet", "Ziyaretçi hizmet standardı", "Karşılama noktası, QR içerik, erişilebilirlik, yönlendirme ve geri bildirim standartlarının hazırlanması."],
  ["Program", "2027 kültür ve spor hazırlığı", "Film festivali, film akademisi ve Frigya spor turizmi programlarının paydaş ve alan planlaması."],
];

export default function AnnouncementsPage() {
  return (
    <main id="ana-icerik">
      <PageHero eyebrow="Duyurular ve Belge Merkezi" title="Kamuoyuna açık süreç, düzenli bilgi, tek kaynak." lead="Kuruluş hazırlıkları, proje gelişmeleri, etkinlik takvimi ve mevzuat gereği yayımlanacak belgeler bu alanda sınıflandırılacaktır." />
      <section className="content-section">
        <div className="site-shell">
          <div><span className="status-pill">Hazırlık dönemi</span><h2 className="section-title mt-6 max-w-3xl">İzlenen çalışma başlıkları</h2><p className="section-copy">Aşağıdaki içerikler haber değil; kurumsal hazırlık sürecinde izlenecek ana çalışma dosyalarıdır.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {preparationItems.map(([category, title, text]) => (
              <article className="card p-7" key={title}><div className="flex items-center justify-between"><span className="text-xs font-extrabold tracking-[.12em] text-[#8e0d2c] uppercase">{category}</span><span className="rounded-full bg-[#f5f1ea] px-3 py-1 text-[11px] font-bold text-[#66717a]">Hazırlanıyor</span></div><h3 className="mt-6 text-2xl font-bold tracking-[-.03em]">{title}</h3><p className="mt-4 text-sm leading-7 text-[#5b6670]">{text}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section soft-section">
        <div className="site-shell">
          <p className="eyebrow">Yayın düzeni</p><h2 className="section-title max-w-3xl">Kuruluş sonrası dört ayrı bilgi kanalı.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              [Megaphone, "Duyurular", "Başvuru, toplantı, program ve kamuoyu bilgilendirmeleri."],
              [CalendarClock, "Etkinlik takvimi", "Festival, gösterim, eğitim, yarış ve ilçe etkinlikleri."],
              [FileText, "Kurumsal belgeler", "Tüzük, karar, faaliyet raporu, plan ve performans belgeleri."],
              [Newspaper, "Haber ve basın", "Saha gelişmeleri, iş birlikleri ve ölçülen proje sonuçları."],
            ].map(([Icon, title, text]) => <div className="card p-6" key={String(title)}><span className="icon-box"><Icon aria-hidden="true" size={21} /></span><h3 className="mt-5 text-lg font-bold">{String(title)}</h3><p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p></div>)}
          </div>
          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-[#d6bd94] bg-[#fff8ec] p-5 text-sm leading-7 text-[#5c4931]"><ShieldCheck className="mt-1 shrink-0 text-[#8e0d2c]" aria-hidden="true" size={21} /><p>Bu taslakta gerçeğe aykırı duyuru, ihale, karar numarası veya iletişim bilgisi yayımlanmamıştır. Resmî içerikler ancak yetkili makam onayı ve kaynak doğrulamasından sonra yayına alınacaktır.</p></div>
        </div>
      </section>
      <section className="content-section"><div className="site-shell flex flex-col items-start justify-between gap-7 rounded-[2rem] bg-[#17212b] p-9 text-white md:flex-row md:items-center md:p-14"><div><p className="text-xs font-extrabold tracking-[.15em] text-[#edc887] uppercase">Bilgi ve iş birliği</p><h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight">Kuruluş süreciyle ilgili görüş ve proje önerinizi iletin.</h2></div><Link className="button-light shrink-0" href="/iletisim">İletişime geç <ArrowRight aria-hidden="true" size={17} /></Link></div></section>
    </main>
  );
}
