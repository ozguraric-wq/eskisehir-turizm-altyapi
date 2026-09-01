import type { Metadata } from "next";
import { Building2, ExternalLink, FileQuestion, Landmark, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "İletişim", description: "Birliğin koordinasyon ve iletişim bilgileri ile görüş formu." };

export default function ContactPage() {
  return (
    <main id="ana-icerik">
      <PageHero eyebrow="İletişim" title="Sorunuzu doğru kanala, görüşünüzü ortak masaya taşıyın." lead="Kuruluş hazırlıkları; Eskişehir Valiliği öncülüğünde, Eskişehir İl Sosyal Etüt ve Proje Müdürlüğünün koordinasyon, yönetim takibi ve sekretaryasıyla yürütülecek model üzerinden ele alınmaktadır." />
      <section className="content-section">
        <div className="site-shell grid gap-10 lg:grid-cols-[.78fr_1.22fr]">
          <div>
            <p className="eyebrow">Kurumsal temas</p><h2 className="section-title">Doğrulanmış iletişim bilgisi ilkesi.</h2><p className="section-copy">Birliğe ait resmî adres, telefon, KEP ve e-posta bilgileri kuruluş süreci tamamlandıktan sonra burada yayımlanacaktır. Taslakta geçici ya da tahmini iletişim bilgisi kullanılmamıştır.</p>
            <div className="mt-8 grid gap-4">
              <div className="card flex gap-4 p-5"><span className="icon-box shrink-0"><Landmark aria-hidden="true" size={21} /></span><div><h3 className="font-bold">Öncü makam</h3><p className="mt-2 text-sm leading-7 text-[#5b6670]">T.C. Eskişehir Valiliği</p><a className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-[#8e0d2c]" href="https://www.eskisehir.gov.tr/" target="_blank" rel="noreferrer">Resmî site <ExternalLink aria-hidden="true" size={13} /></a></div></div>
              <div className="card flex gap-4 p-5"><span className="icon-box shrink-0"><Building2 aria-hidden="true" size={21} /></span><div><h3 className="font-bold">Koordinasyon ve sekretarya</h3><p className="mt-2 text-sm leading-7 text-[#5b6670]">Eskişehir İl Sosyal Etüt ve Proje Müdürlüğü</p></div></div>
              <div className="card flex gap-4 p-5"><span className="icon-box shrink-0"><MapPin aria-hidden="true" size={21} /></span><div><h3 className="font-bold">Birlik iletişim kanalları</h3><p className="mt-2 text-sm leading-7 text-[#5b6670]">Kuruluş sonrası doğrulanarak yayımlanacak.</p></div></div>
            </div>
          </div>
          <div><p className="eyebrow">Görüş ve ön talep</p><h2 className="mb-7 font-serif text-4xl tracking-[-.03em]">Mesaj formu</h2><ContactForm /></div>
        </div>
      </section>
      <section className="content-section soft-section">
        <div className="site-shell grid gap-5 md:grid-cols-3">
          {[
            [FileQuestion, "Bilgi edinme", "Kuruluş sonrası resmî bilgi edinme ve CİMER yönlendirmeleri açık biçimde yayımlanır."],
            [Mail, "Proje ve iş birliği", "Üniversite, meslek kuruluşu, işletme ve yerel topluluk önerileri sınıflandırılarak ilgili çalışma grubuna aktarılır."],
            [MapPin, "Ziyaretçi geri bildirimi", "Rota, karşılama noktası, erişilebilirlik ve hizmet kalitesine ilişkin bildirimler konum bazlı izlenir."],
          ].map(([Icon, title, text]) => <article className="card p-6" key={String(title)}><Icon className="text-[#8e0d2c]" aria-hidden="true" size={23} /><h2 className="mt-5 text-lg font-bold">{String(title)}</h2><p className="mt-3 text-sm leading-7 text-[#5b6670]">{String(text)}</p></article>)}
        </div>
      </section>
    </main>
  );
}
