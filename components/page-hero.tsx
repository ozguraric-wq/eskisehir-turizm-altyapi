import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="page-hero">
      <div className="site-shell page-hero-inner">
        <div className="breadcrumb">
          <Link href="/" aria-label="Ana sayfa"><Home aria-hidden="true" size={14} /></Link>
          <ChevronRight aria-hidden="true" size={14} />
          <span>{eyebrow}</span>
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title max-w-4xl">{title}</h1>
        <p className="page-lead">{lead}</p>
      </div>
    </section>
  );
}
