/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  SITE_AUTH_USERNAME?: string;
  SITE_AUTH_PASSWORD?: string;
  SITE_AUTH_SESSION_SECRET?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const authResponse = await handleAccessGate(request, env);
    if (authResponse) return authResponse;

    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

const LOGIN_PATH = "/giris";
const LOGOUT_PATH = "/cikis";
const SESSION_COOKIE = "etahb_session";

async function handleAccessGate(request: Request, env: Env): Promise<Response | null> {
  const username = env.SITE_AUTH_USERNAME;
  const password = env.SITE_AUTH_PASSWORD;
  const sessionSecret = env.SITE_AUTH_SESSION_SECRET;
  const url = new URL(request.url);
  const hostname = url.hostname;
  const localDevelopment = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "terminal.local";

  if (!username && !password && !sessionSecret && localDevelopment) return null;

  if (!username || !password || !sessionSecret) {
    return renderLoginPage({
      status: 503,
      next: "/",
      unavailable: true,
    });
  }

  if (url.pathname === LOGOUT_PATH) {
    return redirectToLogin("/", `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  }

  const next = sanitizeNext(url.searchParams.get("next"));
  const authenticated = await hasValidSession(request, username, sessionSecret);

  if (url.pathname === LOGIN_PATH && request.method === "GET") {
    if (authenticated) return redirect(next, 302);
    return renderLoginPage({ status: 200, next });
  }

  if (url.pathname === LOGIN_PATH && request.method === "POST") {
    let submittedUsername = "";
    let submittedPassword = "";
    let submittedNext = "/";

    try {
      const form = await request.formData();
      submittedUsername = String(form.get("username") ?? "");
      submittedPassword = String(form.get("password") ?? "");
      submittedNext = sanitizeNext(String(form.get("next") ?? "/"));
    } catch {
      return renderLoginPage({ status: 400, next, error: "Giriş bilgileri okunamadı. Lütfen yeniden deneyin." });
    }

    const validCredentials =
      constantTimeEqual(submittedUsername, username) && constantTimeEqual(submittedPassword, password);

    if (!validCredentials) {
      return renderLoginPage({
        status: 401,
        next: submittedNext,
        error: "Kullanıcı adı veya şifre hatalı. Bilgilerinizi kontrol ederek yeniden deneyin.",
      });
    }

    const token = await createSessionToken(username, sessionSecret);
    return redirect(submittedNext, 303, `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`);
  }

  if (authenticated) return null;

  if (request.method === "GET" || request.method === "HEAD") {
    const requestedPath = `${url.pathname}${url.search}`;
    return redirectToLogin(requestedPath);
  }

  return new Response(JSON.stringify({ error: "Kimlik doğrulaması gerekli." }), {
    status: 401,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

async function hasValidSession(request: Request, username: string, sessionSecret: string): Promise<boolean> {
  const cookie = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!cookie) return false;
  const expected = await createSessionToken(username, sessionSecret);
  return constantTimeEqual(cookie, expected);
}

async function createSessionToken(username: string, sessionSecret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sessionSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`etahb:${username}:v1`));
  return bytesToBase64Url(new Uint8Array(signature));
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const item of header.split(";")) {
    const separator = item.indexOf("=");
    if (separator < 0) continue;
    if (item.slice(0, separator).trim() === name) return item.slice(separator + 1).trim();
  }
  return null;
}

function sanitizeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function redirectToLogin(next: string, cookie?: string): Response {
  return redirect(`${LOGIN_PATH}?next=${encodeURIComponent(sanitizeNext(next))}`, 302, cookie);
}

function redirect(location: string, status: 302 | 303, cookie?: string): Response {
  const headers = new Headers({
    "cache-control": "no-store",
    location,
  });
  if (cookie) headers.set("set-cookie", cookie);
  return new Response(null, { status, headers });
}

function renderLoginPage(options: {
  status: number;
  next: string;
  error?: string;
  unavailable?: boolean;
}): Response {
  const safeNext = escapeHtml(sanitizeNext(options.next));
  const errorMessage = options.error
    ? `<div class="form-alert" role="alert"><span aria-hidden="true">!</span><p>${escapeHtml(options.error)}</p></div>`
    : "";
  const form = options.unavailable
    ? `<div class="service-message" role="status"><span aria-hidden="true">●</span><div><strong>Giriş servisi hazırlanıyor</strong><p>Lütfen kısa bir süre sonra yeniden deneyin.</p></div></div>`
    : `<form method="post" action="${LOGIN_PATH}" class="login-form">
        <input type="hidden" name="next" value="${safeNext}">
        <div class="field">
          <label for="username">Kullanıcı adı</label>
          <input id="username" name="username" type="text" autocomplete="username" inputmode="text" required autofocus>
        </div>
        <div class="field">
          <label for="password">Şifre</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
        </div>
        ${errorMessage}
        <button type="submit">Güvenli giriş <span aria-hidden="true">→</span></button>
      </form>`;

  return new Response(`<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="theme-color" content="#0c0b0a">
  <title>Ratel Dijital · Korumalı Proje Sunumu</title>
  <style>
    :root{color-scheme:dark;--bg:#0c0b0a;--panel:#151311;--paper:#e8e1d4;--muted:#a39b8e;--line:rgba(232,225,212,.14);--accent:#e4544e;--red:#c30d0e;--danger:#ffb4ae}
    *{box-sizing:border-box}
    html,body{margin:0;min-height:100%;background:var(--bg)}
    body{min-height:100svh;color:var(--paper);font-family:"IBM Plex Sans",Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;display:grid;place-items:center;padding:32px;overflow-x:hidden}
    body:before{content:"";position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at 10% 5%,rgba(228,84,78,.18),transparent 31%),radial-gradient(circle at 92% 88%,rgba(195,13,14,.12),transparent 28%),linear-gradient(rgba(232,225,212,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(232,225,212,.025) 1px,transparent 1px);background-size:auto,auto,52px 52px,52px 52px;mask-image:linear-gradient(to bottom,black,transparent 88%)}
    a{color:inherit}
    .shell{position:relative;width:min(1080px,100%);min-height:650px;border:1px solid var(--line);border-radius:30px;overflow:hidden;background:rgba(21,19,17,.92);box-shadow:0 40px 100px rgba(0,0,0,.42);display:grid;grid-template-columns:1.08fr .92fr}
    .brand-panel{position:relative;padding:54px;display:flex;flex-direction:column;justify-content:space-between;isolation:isolate;background:linear-gradient(145deg,rgba(228,84,78,.08),transparent 48%)}
    .brand-panel:after{content:"";position:absolute;z-index:-1;width:340px;height:340px;border:1px solid rgba(232,225,212,.08);border-radius:50%;right:-145px;bottom:-135px;box-shadow:0 0 0 55px rgba(232,225,212,.025),0 0 0 110px rgba(232,225,212,.018)}
    .brand{display:inline-flex;align-items:center;gap:13px;width:max-content;text-decoration:none}
    .brand-mark{width:42px;height:48px;color:var(--paper);flex:none}
    .wordmark{display:flex;flex-direction:column;line-height:1}
    .wordmark b{font-size:1.6rem;letter-spacing:.035em}
    .wordmark em{position:relative;margin-top:5px;padding-right:34px;color:var(--muted);font-size:.61rem;font-style:normal;letter-spacing:.025em;white-space:nowrap}
    .wordmark em:after{content:"";position:absolute;right:0;top:50%;width:26px;height:2px;background:var(--accent);transform:rotate(-18deg)}
    .brand-copy{max-width:560px;margin:auto 0}
    .eyebrow{display:flex;align-items:center;gap:10px;margin:0 0 22px;color:var(--accent);font-size:.74rem;font-weight:750;letter-spacing:.2em;text-transform:uppercase}
    .eyebrow:before{content:"";width:28px;height:2px;background:currentColor}
    .brand-copy h1{max-width:520px;margin:0;font-size:clamp(2.55rem,5.5vw,5.15rem);line-height:.94;letter-spacing:-.055em;font-weight:590}
    .brand-copy p{margin:26px 0 0;color:var(--muted);font-size:.86rem;letter-spacing:.12em;text-transform:uppercase}
    .brand-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;color:var(--muted);font-size:.82rem}
    .brand-footer a{text-decoration:none;border-bottom:1px solid rgba(232,225,212,.28);padding-bottom:3px;transition:color .2s,border-color .2s}
    .brand-footer a:hover{color:var(--paper);border-color:var(--accent)}
    .form-panel{padding:34px;background:rgba(232,225,212,.045);display:flex}
    .form-card{width:100%;padding:48px 42px;border:1px solid var(--line);border-radius:22px;background:#11100f;display:flex;flex-direction:column;justify-content:center}
    .status{display:inline-flex;align-items:center;gap:9px;margin-bottom:28px;color:var(--muted);font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
    .status:before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgba(228,84,78,.12)}
    .form-card h2{margin:0;font-size:clamp(1.65rem,3vw,2.35rem);line-height:1.06;letter-spacing:-.035em}
    .intro{margin:16px 0 34px;color:var(--muted);font-size:.95rem;line-height:1.65}
    .login-form{display:grid;gap:18px}
    .field{display:grid;gap:8px}
    .field label{color:#c9c1b4;font-size:.78rem;font-weight:650;letter-spacing:.04em}
    .field input{width:100%;height:54px;padding:0 16px;border:1px solid var(--line);border-radius:12px;background:#0c0b0a;color:var(--paper);font:inherit;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
    .field input:hover{border-color:rgba(232,225,212,.28)}
    .field input:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(228,84,78,.12);background:#100e0d}
    .form-alert{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid rgba(255,180,174,.25);border-radius:10px;background:rgba(195,13,14,.12);color:var(--danger);font-size:.82rem;line-height:1.45}
    .form-alert span{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:rgba(255,180,174,.12);font-weight:800;flex:none}
    .form-alert p,.service-message p{margin:0}
    .login-form button{height:56px;margin-top:4px;padding:0 20px;border:0;border-radius:12px;background:var(--accent);color:#120c0b;font:inherit;font-weight:800;display:flex;align-items:center;justify-content:space-between;cursor:pointer;transition:transform .2s,background .2s,box-shadow .2s}
    .login-form button:hover{background:#f06660;box-shadow:0 12px 30px rgba(228,84,78,.18);transform:translateY(-1px)}
    .login-form button:focus-visible,.brand:focus-visible,.brand-footer a:focus-visible{outline:3px solid var(--paper);outline-offset:4px}
    .login-form button span{font-size:1.35rem;font-weight:400}
    .service-message{display:flex;gap:14px;padding:18px;border:1px solid var(--line);border-radius:12px;color:var(--paper);line-height:1.5}
    .service-message>span{color:var(--accent)}
    .service-message p{margin-top:5px;color:var(--muted);font-size:.9rem}
    .project-note{margin-top:30px;padding-top:22px;border-top:1px solid var(--line);color:#777167;font-size:.72rem;line-height:1.5}
    @media(max-width:820px){body{padding:18px}.shell{min-height:auto;grid-template-columns:1fr;border-radius:22px}.brand-panel{min-height:330px;padding:34px}.brand-copy{margin:52px 0 42px}.brand-copy h1{max-width:620px;font-size:clamp(2.5rem,11vw,4.6rem)}.form-panel{padding:18px}.form-card{padding:36px 28px}.brand-footer span{display:none}}
    @media(max-width:480px){body{padding:0;display:block}.shell{min-height:100svh;border:0;border-radius:0}.brand-panel{min-height:305px;padding:28px 24px}.brand-copy{margin:42px 0 30px}.brand-copy h1{font-size:2.7rem}.brand-copy p{font-size:.72rem;line-height:1.6}.form-panel{padding:14px}.form-card{padding:34px 22px;border-radius:18px}.intro{margin-bottom:27px}}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
  </style>
</head>
<body>
  <main class="shell">
    <section class="brand-panel" aria-label="Ratel Dijital">
      <a class="brand" href="https://rateldijital.com" target="_blank" rel="noreferrer" aria-label="Ratel Dijital web sitesini yeni sekmede aç">
        <svg class="brand-mark" viewBox="0 0 116 132" fill="none" aria-hidden="true"><path d="M22 7 H86 A16 16 0 0 1 102 23 V72 L110 124 L72 87 H22 A16 16 0 0 1 6 71 V23 A16 16 0 0 1 22 7 Z" stroke="currentColor" stroke-width="12" stroke-linejoin="round"/></svg>
        <span class="wordmark"><b>RATEL</b><em>start with confidence</em></span>
      </a>
      <div class="brand-copy">
        <p class="eyebrow">Proje sunum alanı</p>
        <h1>Fikirleri çalışan sistemlere dönüştürüyoruz.</h1>
        <p>Teknoloji × Yaratıcılık × Proje Geliştirme</p>
      </div>
      <div class="brand-footer">
        <span>© 2026 Ratel Dijital</span>
        <a href="https://rateldijital.com" target="_blank" rel="noreferrer">rateldijital.com ↗</a>
      </div>
    </section>
    <section class="form-panel">
      <div class="form-card">
        <span class="status">Korumalı erişim</span>
        <h2>Eskişehir Turizm Altyapı Hizmet Birliği</h2>
        <p class="intro">Kurumsal web sitesi sunumuna erişmek için size iletilen kullanıcı adı ve şifreyle giriş yapın.</p>
        ${form}
        <p class="project-note">Bu dijital deneyim Ratel Dijital tarafından hazırlanmıştır. Yetkisiz erişim girişimleri kayıt altına alınabilir.</p>
      </div>
    </section>
  </main>
</body>
</html>`, {
    status: options.status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
  });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function constantTimeEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < maxLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export default worker;
