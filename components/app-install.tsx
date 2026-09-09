"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Copy, Download, Share, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { isNativeApp } from "@/lib/mobile/native";
import { installCopy } from "@/lib/mobile/install-copy";
import { siteAsset } from "@/lib/site-path";
import type { Locale } from "@/lib/routing/types";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type Device = "ios" | "android" | "desktop";
const DISMISSED_UNTIL = "etahb-install-dismissed-until";

export function AppInstall() {
  const pathname = usePathname();
  const first = pathname.split("/").filter(Boolean)[0];
  const locale = (["en", "de", "fr", "ar"].includes(first) ? first : "tr") as Locale;
  const c = installCopy(locale);
  const [device, setDevice] = useState<Device | null>(null);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [needsBrowser, setNeedsBrowser] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"" | "copied" | "copyFallback">("");
  const [error, setError] = useState(false);
  const [appUrl, setAppUrl] = useState("");
  const deferred = useRef<InstallEvent | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const ua = nav.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
    const android = /Android/i.test(ua);
    const native = isNativeApp();
    const display = matchMedia("(display-mode: standalone), (display-mode: fullscreen)");
    setDevice(ios ? "ios" : android ? "android" : "desktop");
    setNeedsBrowser(ios
      ? !/Safari\//.test(ua) || /CriOS|FxiOS|EdgiOS|OPiOS|GSA|FBAN|FBAV|Instagram|Line\//i.test(ua)
      : /; wv\)|FBAN|FBAV|Instagram|Line\//i.test(ua));
    try { setDismissed(Number(localStorage.getItem(DISMISSED_UNTIL)) > Date.now()); } catch { /* Private browsing remains usable. */ }
    const hideInstalled = () => {
      if (native || nav.standalone === true || display.matches) {
        setInstalled(true);
        setOpen(false);
        deferred.current = null;
      }
    };
    const capture = (event: Event) => {
      if (native || nav.standalone === true || display.matches) return;
      event.preventDefault();
      deferred.current = event as InstallEvent;
    };
    const onInstalled = () => {
      setInstalled(true);
      setOpen(false);
      deferred.current = null;
    };
    hideInstalled();
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", onInstalled);
    display.addEventListener("change", hideInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capture);
      window.removeEventListener("appinstalled", onInstalled);
      display.removeEventListener("change", hideInstalled);
    };
  }, []);

  useEffect(() => {
    const base = locale === "tr" ? "/" : `/${locale}/`;
    // Share the app entry point, never the current page's private query or QR payload.
    setAppUrl(new URL(`${siteAsset(base)}?app=1`, window.location.origin).href);
  }, [locale]);

  function postpone() {
    setDismissed(true);
    try { localStorage.setItem(DISMISSED_UNTIL, String(Date.now() + 7 * 24 * 60 * 60 * 1000)); } catch { /* Dismiss for this visit if storage is unavailable. */ }
  }

  async function install() {
    if (busy) return;
    setError(false);
    setCopyStatus("");
    const event = deferred.current;
    if (!event || device === "ios") { setOpen(true); return; }
    deferred.current = null;
    setBusy(true);
    try {
      // Call directly from the user's click; browsers require this gesture.
      await event.prompt();
      const choice = await event.userChoice;
      if (choice.outcome === "accepted") { setInstalled(true); setOpen(false); }
      else postpone();
    } catch {
      setError(true);
      setOpen(true);
    } finally { setBusy(false); }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(appUrl); setCopyStatus("copied"); }
    catch { setCopyStatus("copyFallback"); }
  }

  if (!device || installed) return null;
  const steps = device === "ios" ? c.iosSteps : device === "android" ? c.androidSteps : c.desktopSteps;

  return (
    <div className="app-install" dir={locale === "ar" ? "rtl" : "ltr"}>
      {dismissed ? (
        <div className="app-install-reminder"><Button type="button" variant="ghost" onClick={install} disabled={busy}><Smartphone aria-hidden="true" />{c.install}</Button></div>
      ) : (
        <aside className="app-install-card" aria-label={c.heading}>
          <img className="app-install-icon" src={siteAsset("/brand/app-192.png")} alt="" width={52} height={52} />
          <div className="app-install-copy"><strong>{c.title}</strong><p>{c.subtitle}</p></div>
          <Button type="button" variant="ghost" size="icon" className="app-install-dismiss" aria-label={c.later} onClick={postpone}><X aria-hidden="true" /></Button>
          <div className="app-install-actions"><Button type="button" className="app-install-primary" onClick={install} disabled={busy}><Download aria-hidden="true" />{busy ? c.installing : c.install}</Button><Button type="button" variant="ghost" onClick={postpone}>{c.later}</Button></div>
        </aside>
      )}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="app-install-sheet" showCloseButton={false} dir={locale === "ar" ? "rtl" : "ltr"}>
          <div className="app-install-heading"><div><SheetTitle>{c.heading}</SheetTitle><SheetDescription>{c.description}</SheetDescription></div><SheetClose asChild><Button type="button" variant="ghost" size="icon" aria-label={c.close}><X aria-hidden="true" /></Button></SheetClose></div>
          {error && <p className="app-install-notice" role="status">{c.error}</p>}
          {(needsBrowser || device === "desktop") && <div className="app-install-browser"><p>{device === "ios" ? c.openSafari : device === "android" ? c.openBrowser : c.openDesktop}</p><label htmlFor="app-install-link">{c.link}</label><input id="app-install-link" value={appUrl} readOnly dir="ltr" onFocus={event => event.currentTarget.select()} /><Button type="button" variant="outline" onClick={copyLink}><Copy aria-hidden="true" />{copyStatus === "copied" ? c.copied : c.copy}</Button>{copyStatus === "copyFallback" && <p role="status">{c.copyFallback}</p>}</div>}
          <ol className="app-install-steps">{steps.map((step, index) => <li key={index}><span aria-hidden="true">{index === 0 && device === "ios" ? <Share size={20} /> : index + 1}</span><p>{step}</p></li>)}</ol>
          <SheetClose asChild><Button type="button" className="app-install-primary">{c.done}</Button></SheetClose>
        </SheetContent>
      </Sheet>
    </div>
  );
}
