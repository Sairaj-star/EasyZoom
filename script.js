(() => {
  const views = ["homeView", "installView", "joinView", "helpView", "errorView"];
  const show = (id) => {
    views.forEach(v => document.getElementById(v).classList.toggle("hidden", v !== id));
    window.scrollTo({ top: 0, behavior: "auto" });
    const heading = document.querySelector(`#${id} h1`);
    if (heading) heading.setAttribute("tabindex", "-1"), heading.focus({ preventScroll: true });
  };
  const device = (() => {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Android/i.test(ua)) return "android";
    if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
    if (/Windows/i.test(ua)) return "windows";
    return "unknown";
  })();
  const installUrls = {
    android: "https://play.google.com/store/apps/details?id=us.zoom.videomeetings",
    ios: "https://apps.apple.com/app/zoom-workplace/id546505307",
    windows: "https://zoom.us/download",
    mac: "https://zoom.us/download",
    unknown: "https://zoom.us/download"
  };
  const deviceNames = { android: "Android phone or tablet", ios: "iPhone or iPad", windows: "Windows computer", mac: "Mac computer", unknown: "your device" };
  document.getElementById("installBtn").addEventListener("click", () => {
    document.getElementById("deviceNote").textContent = `This looks like ${deviceNames[device]}. Use the button below to open Zoom's official download destination.`;
    const link = document.getElementById("downloadLink");
    link.href = installUrls[device];
    link.textContent = device === "android" ? "Open Google Play ↗" : device === "ios" ? "Open the App Store ↗" : "Open official Zoom download page ↗";
    show("installView");
  });
  document.getElementById("joinBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("helpBtn").addEventListener("click", () => show("helpView"));
  document.getElementById("homeLink").addEventListener("click", e => { e.preventDefault(); show("homeView"); });
  document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => show("homeView")));
  document.getElementById("installDoneBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("helpJoinBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("errorRetryBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("textSizeBtn").addEventListener("click", e => {
    const on = document.body.classList.toggle("large-text");
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.textContent = on ? "A− Normal text" : "A+ Larger text";
  });

  const linkTab = document.getElementById("linkTab");
  const idTab = document.getElementById("idTab");
  const linkForm = document.getElementById("linkForm");
  const idForm = document.getElementById("idForm");
  function setTab(which) {
    const isLink = which === "link";
    linkTab.classList.toggle("active", isLink);
    idTab.classList.toggle("active", !isLink);
    linkTab.setAttribute("aria-selected", String(isLink));
    idTab.setAttribute("aria-selected", String(!isLink));
    linkForm.classList.toggle("hidden", !isLink);
    idForm.classList.toggle("hidden", isLink);
  }
  linkTab.addEventListener("click", () => setTab("link"));
  idTab.addEventListener("click", () => setTab("id"));

  function isZoomHost(host) {
    const h = host.toLowerCase().replace(/\.$/, "");
    return h === "zoom.us" || h.endsWith(".zoom.us") || h === "zoom.com" || h.endsWith(".zoom.com");
  }
  function safeZoomUrl(raw) {
    let url;
    try { url = new URL(raw.trim()); } catch (_) { return null; }
    if (!["https:", "http:"].includes(url.protocol) || !isZoomHost(url.hostname)) return null;
    // Zoom meeting invitations are generally /j/<meeting-id>, /my/<personal-link>,
    // or Zoom-provided join links. Disallow generic pages to reduce accidental misuse.
    if (!/^\/(j\/|my\/|wc\/|s\/|meeting\/)/i.test(url.pathname)) return null;
    url.protocol = "https:";
    return url;
  }
  linkForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("meetingLink");
    const error = document.getElementById("linkError");
    const url = safeZoomUrl(input.value);
    if (!url) {
      error.textContent = "Please paste a valid Zoom meeting invitation link beginning with https://zoom.us or an official Zoom subdomain.";
      input.focus();
      return;
    }
    error.textContent = "";
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  });
  idForm.addEventListener("submit", e => {
    e.preventDefault();
    const rawId = document.getElementById("meetingId").value.trim();
    const id = rawId.replace(/[\s-]/g, "");
    const passcode = document.getElementById("passcode").value.trim();
    const error = document.getElementById("idError");
    if (!/^\d{9,13}$/.test(id)) {
      error.textContent = "Please enter the meeting ID from your invitation. It is usually 9 to 13 digits.";
      document.getElementById("meetingId").focus();
      return;
    }
    error.textContent = "";
    // Use Zoom's official join URL. Passcode is added as a URL parameter only if provided;
    // it is never transmitted to EasyZoom or stored. Zoom may still request it in the app.
    const url = new URL(`https://zoom.us/j/${id}`);
    if (passcode) url.searchParams.set("pwd", passcode);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  });
})();