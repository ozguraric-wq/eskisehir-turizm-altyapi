(() => {
  "use strict";
  document.documentElement.classList.remove("auth-pending");
  if (/\/login\.html$/.test(location.pathname)) {
    const base = new URL("./", location.href);
    let next = base;
    try {
      const requested = new URL(new URLSearchParams(location.search).get("next") || "./", base);
      if (requested.origin === base.origin && requested.pathname.startsWith(base.pathname) && !/\/login\.html$/.test(requested.pathname)) next = requested;
    } catch { /* Use the presentation home for malformed links. */ }
    location.replace(next.href);
  }
})();
