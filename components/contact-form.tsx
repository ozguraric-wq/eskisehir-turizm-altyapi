"use client";

import { CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [checked, setChecked] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setChecked(true);
  }

  return (
    <form className="card p-6 md:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">Ad soyad<input className="min-h-12 rounded-xl border border-[#d7d0c6] bg-[#fffdf9] px-4 font-normal outline-none focus:border-[#8e0d2c] focus:ring-2 focus:ring-[#8e0d2c]/10" name="name" required /></label>
        <label className="grid gap-2 text-sm font-bold">E-posta<input className="min-h-12 rounded-xl border border-[#d7d0c6] bg-[#fffdf9] px-4 font-normal outline-none focus:border-[#8e0d2c] focus:ring-2 focus:ring-[#8e0d2c]/10" name="email" type="email" required /></label>
      </div>
      <label className="mt-5 grid gap-2 text-sm font-bold">Konu
        <select className="min-h-12 rounded-xl border border-[#d7d0c6] bg-[#fffdf9] px-4 font-normal outline-none focus:border-[#8e0d2c]" name="topic" defaultValue="" required>
          <option value="" disabled>Konu seçin</option><option>Proje ve iş birliği</option><option>İlçe ve rota bilgisi</option><option>Festival ve akademi</option><option>Kamp, karavan ve spor turizmi</option><option>Bilgi edinme</option>
        </select>
      </label>
      <label className="mt-5 grid gap-2 text-sm font-bold">Mesaj<textarea className="min-h-36 resize-y rounded-xl border border-[#d7d0c6] bg-[#fffdf9] p-4 font-normal outline-none focus:border-[#8e0d2c] focus:ring-2 focus:ring-[#8e0d2c]/10" name="message" required /></label>
      <label className="mt-5 flex items-start gap-3 text-xs leading-6 text-[#5e6972]"><input className="mt-1" type="checkbox" required />Kişisel verilerin yalnızca talebin değerlendirilmesi amacıyla işlenmesine ilişkin aydınlatma metnini okudum.</label>
      <button className="button-primary mt-6" type="submit"><Send aria-hidden="true" size={17} />Formu doğrula</button>
      {checked && <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#b8d1c9] bg-[#f0f8f5] p-4 text-sm leading-6 text-[#244b40]"><CheckCircle2 className="mt-0.5 shrink-0" aria-hidden="true" size={20} /><span><strong>Form alanları doğrulandı.</strong><br />Bu kurumsal prototip gerçek gönderim yapmaz. Kuruluş sonrası form, resmî evrak ve başvuru kanalına bağlanacaktır.</span></div>}
    </form>
  );
}
