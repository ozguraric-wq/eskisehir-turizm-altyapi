import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { RoutePlanner } from "@/components/route-planner";
import { places, themes } from "@/lib/routing/data";
import { siteAsset } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "Akıllı Rota · Eskişehir Keşif Asistanı",
  description: "36 keşif teması, yemek molaları ve beş ulaşım seçeneğiyle Eskişehir gezinizi planlayın. Sürenize göre birden çok alternatif oluşturun, düzenleyin ve kaydedin.",
};
export default function RoutePage() {
  return <main id="ana-icerik" className="rp-page">
    <section className="rp-hero"><div className="site-shell rp-hero-inner"><div><p className="rp-eyebrow"><Compass size={18} aria-hidden="true" /> ESKİŞEHİR KEŞİF ASİSTANI</p><h1>Sizin zamanınız.<br /><em>Sizin Eskişehir’iniz.</em></h1><p>Tarihten doğaya, yerel sofralardan yeni keşiflere.<br />Size uyan günleri birlikte planlayalım.</p><div className="rp-hero-facts"><span><strong>{places.length}</strong> kaynaklı durak</span><span><strong>{themes.length}</strong> keşif fikri</span><span><strong>5</strong> ulaşım seçeneği</span></div></div><div className="rp-hero-image"><img src={siteAsset("/media/eskisehir-hero.webp")} alt="Eskişehir’in tarihî ve doğal dokusunu yansıtan kent görünümü" /><span>Bir şehirden çok daha fazlası.</span></div></div></section>
    <section className="site-shell rp-main" id="rota-araci"><RoutePlanner /></section>
  </main>;
}
