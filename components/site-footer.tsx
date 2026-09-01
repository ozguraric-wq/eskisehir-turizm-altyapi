/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteAsset } from "@/lib/site-path";

const intl = {
  en: { line: "The public capacity steering tourism infrastructure, investment, data and destination standards across all 14 districts.", institution: "Institution", city: "14 districts", routes: "Routes", programmes: "Programmes", charter: "Draft charter", note: "Institutional concept developed within Eskişehir Vision 2036. Legal structure and programme schedules become final through competent authority decisions." },
  de: { line: "Die öffentliche Kapazität für Tourismusinfrastruktur, Investitionen, Daten und Destinationsstandards in allen 14 Landkreisen.", institution: "Institution", city: "14 Landkreise", routes: "Routen", programmes: "Programme", charter: "Satzungsentwurf", note: "Institutionelles Konzept im Rahmen der Vision Eskişehir 2036. Rechtsform und Zeitpläne werden durch die zuständigen Organe beschlossen." },
  fr: { line: "La capacité publique qui pilote les infrastructures, les investissements, les données et les standards touristiques des 14 districts.", institution: "Institution", city: "14 districts", routes: "Itinéraires", programmes: "Programmes", charter: "Projet de statuts", note: "Concept institutionnel élaboré dans le cadre de Vision Eskişehir 2036. Le statut juridique et les calendriers seront arrêtés par les autorités compétentes." },
  ar: { line: "قدرة عامة تقود البنية التحتية والاستثمار والبيانات ومعايير الوجهة السياحية في المقاطعات الأربع عشرة.", institution: "المؤسسة", city: "14 مقاطعة", routes: "المسارات", programmes: "البرامج", charter: "مسودة النظام", note: "تصور مؤسسي ضمن رؤية إسكي شهير 2036، وتُعتمد الصيغة القانونية والجداول بقرارات الجهات المختصة." },
} as const;

export function SiteFooter() {
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] as keyof typeof intl;
  const foreign = intl[locale];
  const base = foreign ? `/${locale}` : "";
  const copy = foreign ?? { line: "Turizm altyapısını, yatırım sırasını, veri yönetimini ve destinasyon standardını 14 ilçe ölçeğinde yöneten ortak kamu kapasitesi.", institution: "Birlik", city: "14 İlçe", routes: "Rotalar", programmes: "Programlar", charter: "Tüzük Taslağı", note: "Vizyon Eskişehir 2036 kapsamında hazırlanan kurumsal modeldir. Hukuki yapı ve uygulama takvimi yetkili organ kararlarıyla kesinleşecektir." };

  return (
    <footer className="footer">
      <div className="site-shell footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><img src={siteAsset("/brand/logo-mark.webp")} alt="" /><h2>Eskişehir Turizm Altyapı Hizmet Birliği</h2></div>
          <p className="mt-5 max-w-md text-sm leading-7">{copy.line}</p>
        </div>
        <div><h3>{copy.institution}</h3><div className="footer-links"><Link href={foreign ? `${base}#institution` : "/kurumsal"}>{copy.institution}</Link><Link href={foreign ? `${base}#impact` : "/kurumsal#kalkinma-plani"}>Vizyon Eskişehir 2036</Link><Link href="/tuzuk">{copy.charter}</Link><Link href="/duyurular">Duyurular</Link></div></div>
        <div><h3>{copy.city}</h3><div className="footer-links"><Link href={foreign ? `${base}#heritage` : "/ilceler"}>{copy.city}</Link><Link href={foreign ? `${base}#routes` : "/rotani-olustur"}>{copy.routes}</Link><Link href={foreign ? `${base}#programmes` : "/projeler"}>{copy.programmes}</Link><a href="https://eskisehir.ktb.gov.tr/TR-111540/ilceler.html" rel="noreferrer" target="_blank">Resmî turizm bilgisi ↗</a></div></div>
        <div><h3>Bağlantılar</h3><div className="footer-links"><Link href="/iletisim">İletişim</Link><Link href="/kurumsal#seffaflik">Şeffaflık</Link><a href="https://www.eskisehir.gov.tr/" rel="noreferrer" target="_blank">Eskişehir Valiliği ↗</a><a href="https://www.sbb.gov.tr/kalkinma-planlari/" rel="noreferrer" target="_blank">12. Kalkınma Planı ↗</a></div></div>
      </div>
      <div className="site-shell footer-note"><p>{copy.note}</p><p className="mt-2">© 2026 Eskişehir Turizm Altyapı Hizmet Birliği · Erişilebilirlik · KVKK · Bilgi Edinme</p></div>
    </footer>
  );
}
