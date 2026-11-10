(() => {
  const defaults = { brandName: "Maison Fleur", tagline: "FLOWERS & LITTLE MOMENTS", whatsapp: "6285823538473", email: "hello@yourflorist.com" };
  let settings = { ...defaults };
  try { settings = { ...defaults, ...JSON.parse(localStorage.getItem("buketstore_brand_settings") || "{}") }; }
  catch (error) { console.warn("Brand settings could not be loaded.", error); }
  settings.whatsapp = String(settings.whatsapp || "").replace(/\D/g, "") || "6285823538473";
  document.querySelectorAll("[data-brand-name]").forEach(node => node.textContent = settings.brandName);
  document.querySelectorAll("[data-brand-tagline]").forEach(node => node.textContent = settings.tagline);
  document.querySelectorAll("[data-store-email]").forEach(node => node.textContent = settings.email);
  document.querySelectorAll("[data-whatsapp-link]").forEach(node => {
    if (settings.whatsapp) {
      node.href = "https://wa.me/" + String(settings.whatsapp).replace(/\\D/g, "");
      node.target = "_blank"; node.rel = "noopener";
    } else node.href = "contact.html";
  });
  document.querySelectorAll("[data-year]").forEach(node => node.textContent = new Date().getFullYear());
  let count = 0;
  try { count = JSON.parse(localStorage.getItem("buketstore_cart") || "[]").reduce((sum, item) => sum + (Number(item.quantity) || 0), 0); }
  catch (error) { console.warn("Cart count could not be loaded.", error); }
  document.querySelectorAll("[data-cart-count]").forEach(node => node.textContent = String(count));
  const toggle = document.querySelector(".menu-toggle"), nav = document.querySelector(".main-nav");
  if (toggle && nav) toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    toggle.textContent = open ? "×" : "☰";
  });
})();