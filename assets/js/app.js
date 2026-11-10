(() => {
  const defaults = { brandName: "Maison Fleur", tagline: "FLOWERS & LITTLE MOMENTS", whatsapp: "6285823538473", email: "hello@yourflorist.com" };
  let settings = { ...defaults };
  try { settings = { ...defaults, ...JSON.parse(localStorage.getItem("buketstore_brand_settings") || "{}") }; }
  catch (error) { console.warn("Brand settings could not be loaded.", error); }
  settings.whatsapp = "6285823538473";
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

  // Maison Fleur custom select: keep the native select as the real form control.
  (() => {
    let selectId = 0;
    const closeAll = except => document.querySelectorAll(".mf-select.is-open").forEach(w => {
      if (w !== except) {
        w.classList.remove("is-open");
        w.querySelector(".mf-select-trigger")?.setAttribute("aria-expanded", "false");
      }
    });
    function enhance(select) {
      if (select.dataset.mfEnhanced === "true" || select.multiple || select.size > 1) return;
      select.dataset.mfEnhanced = "true";
      const wrap = document.createElement("div");
      wrap.className = "mf-select";
      const id = "mf-select-list-" + (++selectId);
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "mf-select-trigger";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", id);
      const label = document.createElement("span");
      label.className = "mf-select-value";
      const chevron = document.createElement("span");
      chevron.className = "mf-select-chevron";
      chevron.setAttribute("aria-hidden", "true");
      chevron.textContent = "⌄";
      trigger.append(label, chevron);
      const menu = document.createElement("div");
      menu.className = "mf-select-menu";
      menu.id = id;
      menu.setAttribute("role", "listbox");
      wrap.append(trigger, menu);
      select.parentNode.insertBefore(wrap, select);
      wrap.append(select);
      select.classList.add("mf-select-native");
      function sync() {
        const current = select.options[select.selectedIndex];
        label.textContent = current ? current.textContent : "Pilih...";
        trigger.disabled = select.disabled;
        menu.innerHTML = "";
        Array.from(select.options).forEach((option, index) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "mf-select-option";
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", String(option.selected));
          item.disabled = option.disabled;
          item.textContent = option.textContent;
          item.addEventListener("click", () => {
            if (option.disabled) return;
            select.selectedIndex = index;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            sync();
            wrap.classList.remove("is-open");
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
          });
          menu.append(item);
        });
      }
      trigger.addEventListener("click", () => {
        const opening = !wrap.classList.contains("is-open");
        closeAll(wrap);
        wrap.classList.toggle("is-open", opening);
        trigger.setAttribute("aria-expanded", String(opening));
      });
      trigger.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          wrap.classList.remove("is-open");
          trigger.setAttribute("aria-expanded", "false");
        }
        if (event.key === "ArrowDown" && !wrap.classList.contains("is-open")) {
          event.preventDefault();
          trigger.click();
          menu.querySelector(".mf-select-option:not(:disabled)")?.focus();
        }
      });
      select.addEventListener("change", sync);
      new MutationObserver(sync).observe(select, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "selected"] });
      sync();
    }
    function scan(scope) {
      if (scope.matches?.("select")) enhance(scope);
      scope.querySelectorAll?.("select").forEach(enhance);
    }
    scan(document);
    new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType === 1) scan(node);
    }))).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener("click", event => {
      if (!event.target.closest(".mf-select")) closeAll();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeAll();
    });
  })();

})();