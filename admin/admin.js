/* ============================================================
   Configuración del panel admin.
   Pega aquí los datos de tu proyecto Supabase y elige un PIN.
   ============================================================ */
const SUPABASE_URL = "https://edquyomwiiaawqslsisd.supabase.co";
const SUPABASE_KEY = "sb_publishable_aIIwHt4T8cDIeZjy48hRxQ_sdY7_QIf";
const PIN = "1234";

/* ============================================================
   Panel de pedidos de Mandala Sushi.
   Lee pedidos desde Supabase (REST), los muestra en tiempo real
   (polling) y permite cambiar su estado.
   ============================================================ */
(function () {
  "use strict";

  const API = SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/orders";
  const HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY
  };

  const STATUS = {
    nuevo:      { label: "Nuevo",     cls: "s-nuevo" },
    recibido:   { label: "Recibido",  cls: "s-recibido" },
    listo:      { label: "Listo",     cls: "s-listo" },
    entregado:  { label: "Entregado", cls: "s-entregado" },
    cancelado:  { label: "Cancelado", cls: "s-cancelado" },
    archivado:  { label: "Archivado", cls: "s-archivado" }
  };

  const FLOW = ["nuevo", "recibido", "listo", "entregado"];

  let state = {
    orders: [],
    seen: new Set(),
    soundOn: true,
    onlyNew: false,
    showArch: false,
    pollTimer: null
  };

  const $ = id => document.getElementById(id);

  /* ---------- Utilidades ---------- */
  const money = n => "$" + Number(n || 0).toLocaleString("es-MX");
  const fmtTime = iso => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" }) + " " +
      d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.add("hidden"), 3500);
  }

  function beep() {
    try {
      const ctx = beep._ctx || (beep._ctx = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") ctx.resume();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.25;
      o.connect(g); g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.4);
    } catch (e) { /* sin audio */ }
  }

  function notify(title, body) {
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body, icon: "../logo.png" });
      }
    } catch (e) { /* sin notificaciones */ }
  }

  /* ---------- API ---------- */
  async function fetchOrders() {
    if (!SUPABASE_URL || !SUPABASE_KEY) return [];
    const q = API + "?select=*&order=created_at.desc&limit=200";
    const r = await fetch(q, { headers: HEADERS });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }

  async function setStatus(id, status) {
    const r = await fetch(API + "?id=eq." + id, {
      method: "PATCH",
      headers: Object.assign({ "Content-Type": "application/json", "Prefer": "return=minimal" }, HEADERS),
      body: JSON.stringify({ status })
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
  }

  /* ---------- Render ---------- */
  function statusBadge(s) {
    const d = STATUS[s] || STATUS.nuevo;
    return '<span class="st-badge ' + d.cls + '">' + d.label + "</span>";
  }

  function cardHtml(o) {
    const items = (o.items || []).map(i =>
      '<div class="o-item"><span>' + esc(i.name) + "</span><span class='x" + i.qty + "'>" +
      i.qty + " × " + money(i.price * i.qty) + "</span></div>"
    ).join("");

    const notes = (o.notes || o.salsas)
      ? '<div class="o-notes">' +
        (o.notes ? "<div>📝 " + esc(o.notes) + "</div>" : "") +
        (o.salsas ? "<div>🥫 " + esc(o.salsas) + "</div>" : "") +
        "</div>"
      : "";

    const flowBtns = FLOW.map(s => {
      const d = STATUS[s];
      return '<button class="fbtn' + (o.status === s ? " on" : "") + '" data-id="' + o.id + '" data-s="' + s + '">' +
        d.label + "</button>";
    }).join("");

    return '<div class="card' + (o.status === "nuevo" ? " card-new" : "") + '" data-id="' + o.id + '">' +
      '<div class="c-top">' +
        '<div class="c-left"><span class="c-folio">#' + esc(o.folio) + "</span>" + statusBadge(o.status) + "</div>" +
        '<span class="c-time">' + fmtTime(o.created_at) + "</span>" +
      "</div>" +
      '<div class="c-name">' + esc(o.name) + ' <span class="c-phone">📞 ' + esc(o.phone) + "</span></div>" +
      '<div class="c-meta">' +
        (o.order_type === "domicilio" ? "🛵 A domicilio · " : "🛍️ Para llevar · ") +
        esc(o.payment) +
      "</div>" +
      (o.order_type === "domicilio" && o.address ? '<div class="c-addr">📍 ' + esc(o.address) + "</div>" : "") +
      '<div class="o-items">' + items + "</div>" +
      notes +
      '<div class="c-total">Total <b>' + money(o.total) + "</b></div>" +
      '<div class="c-actions">' + flowBtns +
        '<button class="fbtn archive" data-id="' + o.id + '" data-s="archivado">🗂</button>' +
      "</div>" +
    "</div>";
  }

  function render() {
    const list = $("orders");
    const orders = state.orders
      .filter(o => state.onlyNew ? o.status === "nuevo" : true)
      .filter(o => state.showArch ? true : o.status !== "archivado");

    if (!orders.length) {
      list.innerHTML = '<div class="empty">📭 No hay pedidos.</div>';
    } else {
      list.innerHTML = orders.map(cardHtml).join("");
    }
  }

  function renderStats() {
    const today = new Date().toDateString();
    const todayOrders = state.orders.filter(o => {
      if (!o.created_at) return false;
      return new Date(o.created_at).toDateString() === today;
    });
    $("stNuevos").textContent = state.orders.filter(o => o.status === "nuevo").length;
    $("stHoy").textContent = todayOrders.length;
    $("stIngresos").textContent = money(todayOrders.reduce((a, o) => a + (o.total || 0), 0));
  }

  /* ---------- Ciclo ---------- */
  async function refresh() {
    try {
      const orders = await fetchOrders();
      const before = state.orders.length;
      state.orders = orders;
      const isFirst = state.seen.size === 0;
      orders.forEach(o => {
        if (!state.seen.has(o.id)) {
          state.seen.add(o.id);
          if (!isFirst && o.status === "nuevo") {
            if (state.soundOn) beep();
            notify("Nuevo pedido #" + o.folio, (o.name || "") + " · " + money(o.total));
          }
        }
      });
      $("refreshNote").textContent = "Actualizado " + new Date().toLocaleTimeString("es-MX");
      renderStats();
      render();
    } catch (e) {
      $("refreshNote").textContent = "Error de conexión";
      if (state.seen.size === 0) {
        $("orders").innerHTML = '<div class="empty">No se pudo conectar a Supabase.<br>Revisa la configuración en admin/admin.js.</div>';
      }
    }
  }

  function start() {
    clearInterval(state.pollTimer);
    state.pollTimer = setInterval(refresh, 4000);
  }

  /* ---------- CSV ---------- */
  function downloadCsv() {
    const escCsv = v => "\"" + String(v == null ? "" : v).replace(/"/g, "\"\"") + "\"";
    const rows = [["folio", "fecha", "estado", "nombre", "telefono", "tipo", "direccion", "pago", "items", "total"]];
    state.orders.forEach(o => rows.push([
      o.folio, o.created_at, o.status, o.name, o.phone, o.order_type, o.address, o.payment,
      (o.items || []).map(i => i.qty + " x " + i.name).join(" | "), o.total
    ]));
    const blob = new Blob(["\ufeff" + rows.map(r => r.map(escCsv).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mandala-pedidos.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  /* ---------- Eventos ---------- */
  function wire() {
    document.getElementById("orders").addEventListener("click", async e => {
      const btn = e.target.closest(".fbtn");
      if (!btn) return;
      const id = btn.dataset.id;
      const s = btn.dataset.s;
      try {
        await setStatus(id, s);
        refresh();
      } catch (err) {
        toast("Error al cambiar estado");
      }
    });

    $("soundToggle").addEventListener("change", e => { state.soundOn = e.target.checked; });
    $("onlyNew").addEventListener("change", e => { state.onlyNew = e.target.checked; render(); });
    $("showArch").addEventListener("change", e => { state.showArch = e.target.checked; render(); });
    $("csvBtn").addEventListener("click", downloadCsv);
    $("logoutBtn").addEventListener("click", () => {
      sessionStorage.removeItem("mandalaAdminAuth");
      location.reload();
    });

    $("pinBtn").addEventListener("click", doLogin);
    $("pinInput").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
  }

  function doLogin() {
    if ($("pinInput").value === PIN) {
      sessionStorage.setItem("mandalaAdminAuth", "1");
      $("pinScreen").classList.add("hidden");
      $("app").classList.remove("hidden");
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
      refresh();
      start();
    } else {
      $("pinErr").classList.remove("hidden");
      $("pinInput").value = "";
    }
  }

  function init() {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      $("pinScreen").classList.add("hidden");
      $("app").classList.remove("hidden");
      $("orders").innerHTML = '<div class="empty">Falta la configuración de Supabase.<br>Abre admin/admin.js y pega SUPABASE_URL y SUPABASE_KEY.</div>';
      return;
    }
    if (sessionStorage.getItem("mandalaAdminAuth") === "1") {
      $("pinScreen").classList.add("hidden");
      $("app").classList.remove("hidden");
      refresh();
      start();
    }
    wire();
  }

  init();
})();
