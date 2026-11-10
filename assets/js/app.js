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


  // Maison Fleur smart navbar: visible search + persistent ID/EN language switcher.
  (() => {
    const header = document.querySelector(".site-header");
    const menuButton = header?.querySelector(".menu-toggle");
    const nav = header?.querySelector(".main-nav");
    if (!header || !menuButton || !nav) return;

    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.className = "mf-search-toggle";
    searchButton.setAttribute("aria-label", "Cari produk");
    searchButton.setAttribute("aria-expanded", "false");
    searchButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg>';
    header.insertBefore(searchButton, menuButton);

    const language = document.createElement("div");
    language.className = "mf-language";
    language.innerHTML = '<span class="mf-language-label">Language / Bahasa</span><div class="mf-language-options"><button type="button" data-lang="id">Indonesia</button><button type="button" data-lang="en">English</button></div>';
    nav.append(language);

    const overlay = document.createElement("section");
    overlay.className = "mf-search-overlay";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Pencarian produk");
    overlay.innerHTML = '<div class="mf-search-panel"><div class="mf-search-heading"><div><span class="eyebrow">MAISON FLEUR</span><h2 data-search-title>Temukan bunga pilihanmu</h2></div><button type="button" class="mf-search-close" aria-label="Tutup pencarian">×</button></div><label class="mf-search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"></circle><path d="m16 16 5 5"></path></svg><input type="search" class="mf-search-input" placeholder="Cari nama buket atau kategori..." autocomplete="off"></label><div class="mf-search-results" aria-live="polite"><p class="mf-search-hint">Mulai ketik untuk mencari koleksi kami.</p></div></div>';
    document.body.append(overlay);
    const searchInput = overlay.querySelector(".mf-search-input");
    const results = overlay.querySelector(".mf-search-results");
    const closeSearch = () => { overlay.hidden = true; searchButton.setAttribute("aria-expanded","false"); };
    searchButton.addEventListener("click", () => {
      overlay.hidden = false;
      searchButton.setAttribute("aria-expanded","true");
      setTimeout(() => searchInput.focus(), 20);
      if (nav.classList.contains("open")) { nav.classList.remove("open"); menuButton.setAttribute("aria-expanded","false"); menuButton.textContent="☰"; }
    });
    overlay.querySelector(".mf-search-close").addEventListener("click",closeSearch);
    overlay.addEventListener("click",e=>{if(e.target===overlay)closeSearch()});
    document.addEventListener("keydown",e=>{if(e.key==="Escape")closeSearch()});
    function searchProducts(query) {
      let products=[];
      try { const stored=JSON.parse(localStorage.getItem("buketstore_products")||"null"); if(Array.isArray(stored)&&stored.length) products=stored; } catch {}
      if(!products.length) products=[
        {id:"p-1794308831306",name:"Blush in Bloom",category:"Romantic",price:285000,image:"assets/buket1.webp"},
        {id:"p-1794308878562",name:"Ivory Elegance",category:"Wedding",price:325000,image:"assets/buket2.webp"},
        {id:"p-1794308937108",name:"Midnight Romance",category:"Romantic",price:350000,image:"assets/buket3.webp"},
        {id:"p-1794308975590",name:"Lavender Dream",category:"Birthday",price:375000,image:"assets/buket4.webp"},
        {id:"p-1794309024217",name:"Golden Sunshine",category:"Birthday",price:275000,image:"assets/buket5.webp"},
        {id:"p-1794309065208",name:"Burgundy Love",category:"Romantic",price:375000,image:"assets/buket6.webp"}
      ];
      const q=query.trim().toLowerCase();
      if(!q) return [];
      return products.filter(p=>(String(p.name||"")+" "+String(p.category||"")+" "+String(p.description||"")).toLowerCase().includes(q)).slice(0,8);
    }
    searchInput.addEventListener("input",()=>{
      const q=searchInput.value;
      if(!q.trim()){results.innerHTML='<p class="mf-search-hint" data-search-hint>Mulai ketik untuk mencari koleksi kami.</p>';translateTree(results);return}
      const found=searchProducts(q);
      results.innerHTML=found.length?found.map(p=>'<a class="mf-search-result" href="product.html?id='+encodeURIComponent(p.id)+'"><span class="mf-search-thumb" style="background-image:url(&quot;'+String(p.image||"").replace(/&/g,"%26").replace(/"/g,"%22")+'&quot;)"></span><span><strong>'+escapeHtml(p.name||"Buket")+'</strong><small>'+escapeHtml(p.category||"Flowers")+'</small></span><b>↗</b></a>').join(""):'<p class="mf-search-hint" data-search-empty>Tidak ada produk yang cocok. Coba kata kunci lain.</p>';
      translateTree(results);
    });
    function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

    const pairs = [
      ["Home","Beranda"],["Shop","Belanja"],["Our Story","Cerita Kami"],["Our story","Cerita Kami"],["Testimonials","Testimoni"],["Contact","Kontak"],["Contact us","Hubungi kami"],["Explore","Jelajahi"],["Shop all","Lihat semua"],["Shop all flowers ↗","Lihat semua buket ↗"],["Explore collection","Jelajahi koleksi"],["Explore collection ↗","Jelajahi koleksi ↗"],["Discover our story","Kenali cerita kami"],["Discover their stories ↗","Baca cerita mereka ↗"],["Read all testimonials ↗","Baca semua testimoni ↗"],["Find your flowers","Temukan bunga pilihanmu"],["Our Collection","Koleksi Kami"],["Product Detail","Detail Produk"],["Your Bag","Keranjang Belanja"],["Almost yours.","Sedikit lagi jadi milikmu."],["Continue to checkout ↗","Lanjut ke pembayaran ↗"],["Checkout","Pembayaran"],["Order via WhatsApp ↗","Pesan via WhatsApp ↗"],["Search bouquets","Cari buket"],["Search flower name...","Cari nama bunga..."],["Category","Kategori"],["All categories","Semua kategori"],["Sort by","Urutkan"],["Featured","Unggulan"],["Lowest price","Harga terendah"],["Highest price","Harga tertinggi"],["Full name","Nama lengkap"],["WhatsApp number","Nomor WhatsApp"],["Delivery address","Alamat pengiriman"],["Delivery date","Tanggal pengiriman"],["Note for florist","Catatan untuk florist"],["Recipient name","Nama penerima"],["Recipient's full address","Alamat lengkap penerima"],["Favorite colors, greeting card, or special message (optional)","Warna favorit, kartu ucapan, atau pesan khusus (opsional)"],["Product subtotal","Subtotal produk"],["ORDER SUMMARY","RINGKASAN PESANAN"],["YOUR ORDER","PESANANMU"],["SAVED WITH LOVE","TERSIMPAN DENGAN CINTA"],["A LITTLE ABOUT US","TENTANG KAMI"],["A LITTLE SOMETHING SPECIAL","SESUATU YANG ISTIMEWA"],["FIND YOUR FLOWERS","TEMUKAN BUNGA PILIHANMU"],["A FEW DETAILS BEFORE THE SURPRISE","SEDIKIT DETAIL SEBELUM KEJUTAN"],["Thoughtful flowers for the moments that matter.","Bunga penuh makna untuk momen yang berharga."],["Every bouquet has a story. Discover the sweet moments shared by Maison Fleur customers.","Setiap rangkaian punya cerita. Temukan kesan manis dari mereka yang telah memilih Maison Fleur."],["From simple celebrations to special days, let flowers tell an unforgettable story.","Dari perayaan sederhana hingga hari istimewa, biarkan bunga menyampaikan cerita yang tak terlupakan."],["For words left unspoken and moments worth remembering. Discover heartfelt floral arrangements.","Untuk kata yang sulit terucap dan momen yang ingin selalu diingat. Temukan rangkaian bunga yang dibuat sepenuh hati."],["Loading bouquet collection...","Memuat koleksi buket..."],["A collection curated for you","Koleksi pilihan untukmu"],["No matching products found.","Belum ada produk yang cocok."],["The bouquet is beautiful! Soft colors, neat wrapping, and exactly as imagined. Absolutely love it!","Buketnya cantik banget! Warna bunganya lembut, wrapping-nya rapi, dan hasilnya persis seperti yang dibayangkan. Suka sekali!"],["Ordered as a birthday gift for a friend. Fresh flowers and an elegant look. The recipient loved it!","Pesan untuk hadiah ulang tahun sahabat. Bunganya fresh dan tampilannya elegan. Penerima hadiahnya senang banget."],["Friendly service and a bouquet made with lovely details. Perfect for someone special.","Pelayanannya ramah dan buketnya dibuat dengan detail yang manis. Cocok untuk hadiah orang tersayang."],["Daily · 9 AM–8 PM","Setiap hari · 09.00–20.00"],["Your bag is waiting for flowers.","Belum ada bunga di keranjangmu."],["Remove","Hapus"],["Add to bag ↗","Tambah ke keranjang ↗"],["+ Add","+ Tambah"],["Available stock:","Stok tersedia:"],["Bouquet collection coming soon.","Koleksi buket akan segera hadir."],["Customer testimonials will appear here once approved by the admin.","Testimoni pelanggan akan tampil di sini setelah disetujui admin."]
    ];
    const toEn=new Map(pairs.map(([en,id])=>[id,en]));
    const toId=new Map(pairs.map(([en,id])=>[en,id]));
        const langKey="maison_fleur_language";
    let currentLang=localStorage.getItem(langKey)==="en"?"en":"id";
    function translateTree(root) {
      const map=currentLang==="en"?toEn:toId;
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
      const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node=>{
        if(node.parentElement?.closest("script,style,textarea,input,select,option,[data-brand-name],[data-brand-tagline],.mf-language,.mf-search-toggle")) return;
        const raw=node.nodeValue, trimmed=raw.trim();
        if(!trimmed||!map.has(trimmed)) return;
        node.nodeValue=raw.replace(trimmed,map.get(trimmed));
      });
      root.querySelectorAll?.("input[placeholder],textarea[placeholder],button[aria-label],a[aria-label]").forEach(el=>{
        const attr=el.hasAttribute("placeholder")?"placeholder":"aria-label";
        const value=el.getAttribute(attr); if(map.has(value))el.setAttribute(attr,map.get(value));
      });
    }
    function applyLanguage(lang) {
      currentLang=lang; localStorage.setItem(langKey,lang);
      document.documentElement.lang=lang;
      document.querySelectorAll(".mf-language [data-lang]").forEach(b=>{b.classList.toggle("is-active",b.dataset.lang===lang);b.setAttribute("aria-pressed",String(b.dataset.lang===lang))});
      translateTree(document.body);
      overlay.querySelector("[data-search-title]").textContent=lang==="en"?"Find your flowers":"Temukan bunga pilihanmu";
      searchInput.placeholder=lang==="en"?"Search bouquet name or category...":"Cari nama buket atau kategori...";
      searchButton.setAttribute("aria-label",lang==="en"?"Search products":"Cari produk");
      menuButton.setAttribute("aria-label",lang==="en"?"Open menu":"Buka menu");
      if(searchInput.value) searchInput.dispatchEvent(new Event("input"));
    }
    language.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>applyLanguage(b.dataset.lang)));
    const observer=new MutationObserver(records=>records.forEach(record=>{
      record.addedNodes.forEach(node=>{if(node.nodeType===1)translateTree(node);else if(node.nodeType===3)translateTree(node.parentElement||document.body)});
    }));
    observer.observe(document.body,{childList:true,subtree:true});
    applyLanguage(currentLang);
  })();

})();