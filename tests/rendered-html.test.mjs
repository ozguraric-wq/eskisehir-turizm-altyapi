import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("renders charter, route and four language portals", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("routes", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const expected = new Map([
    ["/tuzuk", "Tüzük"],
    ["/rotani-olustur", "alternatif"],
    ["/en", "steering Eskişehir"],
    ["/de", "Tourismuswirtschaft"],
    ["/fr", "économie touristique"],
    ["/ar", "اقتصاد السياحة"],
  ]);

  for (const [path, phrase] of expected) {
    const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), new RegExp(phrase), path);
  }
});

test("renders the Ratel Digital access screen and creates a secure session", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("auth", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    SITE_AUTH_USERNAME: "test-user",
    SITE_AUTH_PASSWORD: "test-password",
    SITE_AUTH_SESSION_SECRET: "test-session-secret-that-is-long-enough",
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };

  const blocked = await worker.fetch(new Request("http://localhost/"), env, ctx);
  assert.equal(blocked.status, 302);
  assert.equal(blocked.headers.get("location"), "/giris?next=%2F");

  const loginPage = await worker.fetch(new Request("http://localhost/giris"), env, ctx);
  assert.equal(loginPage.status, 200);
  const loginHtml = await loginPage.text();
  assert.match(loginHtml, /RATEL/);
  assert.match(loginHtml, /rateldijital\.com/);
  assert.match(loginHtml, /Eskişehir Turizm Altyapı Hizmet Birliği/);
  assert.doesNotMatch(loginHtml, /test-password/);

  const failedLogin = await worker.fetch(new Request("http://localhost/giris", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: "test-user", password: "wrong", next: "/" }),
  }), env, ctx);
  assert.equal(failedLogin.status, 401);
  assert.match(await failedLogin.text(), /Kullanıcı adı veya şifre hatalı/);

  const login = await worker.fetch(new Request("http://localhost/giris", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: "test-user", password: "test-password", next: "/tuzuk" }),
  }), env, ctx);
  assert.equal(login.status, 303);
  assert.equal(login.headers.get("location"), "/tuzuk");
  assert.match(login.headers.get("set-cookie") ?? "", /^etahb_session=/);
  assert.match(login.headers.get("set-cookie") ?? "", /HttpOnly/);
  assert.match(login.headers.get("set-cookie") ?? "", /Secure/);

  const sessionCookie = (login.headers.get("set-cookie") ?? "").split(";")[0];
  const authorized = await worker.fetch(new Request("http://localhost/", {
    headers: { cookie: sessionCookie },
  }), env, ctx);
  assert.equal(authorized.status, 200);
});
