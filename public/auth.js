(() => {
  "use strict";

  const BASE_PATH = "/eskisehir-turizm-altyapi";
  const LOGIN_PATH = `${BASE_PATH}/login.html`;
  const SESSION_KEY = "ratel-tourism-demo-auth-v1";
  const USER_HASH = "0b30da3b6696ab7a08dcc1b5264b5767d18a2bd93c9828067907737dc998a2fd";
  const PASSWORD_HASH = "95f5c93cdf6f7d46d7c7cd41d2b6199ee390f2cc82259ce2233bad2cab194ad3";

  const revealPage = () => document.documentElement.classList.remove("auth-pending");
  const isLoginPage = window.location.pathname === LOGIN_PATH;
  const isAuthenticated = sessionStorage.getItem(SESSION_KEY) === "1";

  function safeNext(value) {
    if (!value || value.startsWith("//")) return `${BASE_PATH}/`;
    try {
      const url = new URL(value, window.location.origin);
      if (url.origin !== window.location.origin) return `${BASE_PATH}/`;
      if (url.pathname !== BASE_PATH && !url.pathname.startsWith(`${BASE_PATH}/`)) return `${BASE_PATH}/`;
      if (url.pathname === LOGIN_PATH) return `${BASE_PATH}/`;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return `${BASE_PATH}/`;
    }
  }

  if (!isLoginPage && !isAuthenticated) {
    const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.replace(`${LOGIN_PATH}?next=${encodeURIComponent(next)}`);
    return;
  }

  if (!isLoginPage) {
    revealPage();
    window.ratelSignOut = () => {
      sessionStorage.removeItem(SESSION_KEY);
      window.location.replace(LOGIN_PATH);
    };
    return;
  }

  const requestedNext = safeNext(new URLSearchParams(window.location.search).get("next"));
  if (isAuthenticated) {
    window.location.replace(requestedNext);
    return;
  }

  revealPage();

  async function sha256(value) {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#login-form");
    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    const message = document.querySelector("#login-message");
    const submit = document.querySelector("#login-submit");

    if (!form || !username || !password || !message || !submit) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submit.disabled = true;
      submit.textContent = "Kontrol ediliyor…";
      message.textContent = "";

      try {
        const [userHash, passwordHash] = await Promise.all([
          sha256(username.value.trim().toLowerCase()),
          sha256(password.value),
        ]);

        if (userHash === USER_HASH && passwordHash === PASSWORD_HASH) {
          sessionStorage.setItem(SESSION_KEY, "1");
          window.location.replace(requestedNext);
          return;
        }

        message.textContent = "Kullanıcı adı veya şifre hatalı.";
        password.value = "";
        password.focus();
      } catch {
        message.textContent = "Güvenli doğrulama başlatılamadı. Lütfen güncel bir tarayıcı kullanın.";
      } finally {
        submit.disabled = false;
        submit.textContent = "Sunuma Giriş";
      }
    });
  });
})();
