/* ============================================================
   Vista principal: coordina menú, drawer, checkout y sheets.
   Expone las funciones globales que usan los onclick del HTML.
   ============================================================ */
(function (global) {
  "use strict";

  class AppView {
    constructor(deps) {
      this.menu = deps.menuView;
      this.drawer = deps.drawerView;
      this.checkout = deps.checkoutView;
      this.sheets = deps.sheetView;
      this.cart = deps.cartVM;
      this.currency = deps.currency;
      this.orders = deps.orderService;
      this.orderRepo = deps.orderRepository;
      this.hours = deps.hours;
      this.el = {};
    }

    init() {
      this.el = {
        menu: document.getElementById("menu"),
        cats: document.getElementById("cats"),
        searchWrap: document.getElementById("searchWrap"),
        search: document.getElementById("search"),
        floatCart: document.getElementById("floatCart"),
        badge: document.getElementById("badge"),
        fcTotal: document.getElementById("fcTotal"),
        overlay: document.getElementById("overlay"),
        drawer: document.getElementById("drawer"),
        clearBtn: document.getElementById("clearBtn"),
        drawerBody: document.getElementById("drawerBody"),
        drawerFoot: document.getElementById("drawerFoot"),
        drawerTotal: document.getElementById("drawerTotal"),
        checkout: document.getElementById("checkout"),
        report: document.getElementById("report"),
        reportBody: document.getElementById("reportBody")
      };

      this.checkout.cache();
      this.sheets.cache();

      const sb = document.getElementById("statusBar");
      if (sb && this.hours) {
        sb.textContent = this.hours.statusText();
        sb.classList.toggle("closed", !this.hours.isOpen());
      }

      this.menu.hooks.onQty = (key, delta) => this.cart.changeQty(key, delta);
      this.menu.hooks.onVariant = (ci, ii, item) => this.sheets.openVariant(ci, ii, item);
      this.menu.hooks.onPkg = (ci, ii, item) => this.sheets.openPkg(ci, ii, item);
      this.menu.hooks.onRemovePkg = (ci, ii) => this.cart.removeOnePackage(ci, ii);

      this.drawer.hooks.onQty = (key, delta) => this.cart.changeQty(key, delta);
      this.drawer.hooks.onRemove = key => this.cart.remove(key);
      this.drawer.hooks.onClear = () => this.cart.clear();
      this.drawer.hooks.onRepeat = () => this.cart.repeatLast();

      this.sheets.hooks.onVariantConfirm = (ci, ii, item, variant) =>
        this.cart.changeQty(this.menu.catalog.key(ci, ii, variant), 1);
      this.sheets.hooks.onPkgConfirm = (ci, ii, item, selected) =>
        this.cart.addPackage(ci, ii, item, selected);

      this.checkout.onSent = () => this.refreshAll();

      this.cart.onChange = () => this.refreshAll();

      this.menu.attach(this.el.cats, this.el.menu, this.el.search);
      this.menu.renderChips();
      this.menu.renderMenu();
      this.refreshFloat();
    }

    openDrawer() {
      this.drawer.renderDrawer(this.el.drawerBody, this.el.drawerTotal, this.el.drawerFoot, this.el.clearBtn);
      this.el.drawer.classList.add("show");
      this.el.overlay.classList.add("show");
    }

    closeDrawer() {
      this.el.drawer.classList.remove("show");
      this.el.overlay.classList.remove("show");
    }

    clearCart() {
      this.cart.clear();
    }

    goCheckout() {
      this.closeDrawer();
      if (!this.cart.items.length) return;
      this.el.menu.classList.add("hidden");
      this.el.cats.classList.add("hidden");
      this.el.searchWrap.classList.add("hidden");
      this.el.checkout.classList.remove("hidden");
      this.el.floatCart.classList.add("hidden");
      window.scrollTo(0, 0);
      this.checkout.render();
    }

    goBack() {
      this.el.checkout.classList.add("hidden");
      this.el.menu.classList.remove("hidden");
      this.el.cats.classList.remove("hidden");
      this.el.searchWrap.classList.remove("hidden");
      this.refreshFloat();
      window.scrollTo(0, 0);
    }

    openReport() {
      this.renderReport();
      this.el.report.classList.remove("hidden");
      requestAnimationFrame(() => this.el.report.classList.add("show"));
    }

    closeReport() {
      this.el.report.classList.remove("show");
      setTimeout(() => this.el.report.classList.add("hidden"), 280);
    }

    renderReport() {
      const body = this.el.reportBody;
      const orders = this.orderRepo.orders();
      body.innerHTML = "";
      if (!orders.length) {
        const empty = document.createElement("div");
        empty.className = "empty-cart";
        empty.innerHTML = '<div class="big">📊</div>Aún no hay pedidos registrados en este dispositivo.<br>Se guardan al enviar un pedido por WhatsApp.';
        body.appendChild(empty);
        return;
      }
      const total = orders.reduce((a, o) => a + (o.total || 0), 0);
      const today = orders.filter(o => o.date && new Date(o.date).toDateString() === new Date().toDateString()).length;

      const stats = document.createElement("div");
      stats.className = "rep-stats";
      const stat = (n, label) => {
        const d = document.createElement("div");
        d.className = "rep-stat";
        const b = document.createElement("b");
        b.textContent = n;
        const s = document.createElement("span");
        s.textContent = label;
        d.appendChild(b); d.appendChild(s);
        return d;
      };
      stats.appendChild(stat(orders.length, "pedidos"));
      stats.appendChild(stat(today, "hoy"));
      stats.appendChild(stat(this.currency.format(total), "ingresos"));
      body.appendChild(stats);

      const dl = document.createElement("button");
      dl.type = "button";
      dl.className = "btn btn-primary";
      dl.textContent = "⬇ Descargar CSV";
      dl.onclick = () => this._downloadCsv(orders);
      body.appendChild(dl);

      const list = document.createElement("div");
      list.className = "rep-list";
      orders.slice().reverse().forEach(o => {
        const row = document.createElement("div");
        row.className = "rep-row";
        const f = document.createElement("span");
        f.className = "rep-folio";
        f.textContent = "#" + o.folio;
        const name = document.createElement("div");
        name.className = "rep-name";
        name.textContent = (o.name || "") + " · " + (o.orderType === "domicilio" ? "a domicilio" : "para llevar");
        const price = document.createElement("b");
        price.textContent = this.currency.format(o.total);
        row.appendChild(f);
        row.appendChild(name);
        row.appendChild(price);
        list.appendChild(row);
      });
      body.appendChild(list);
    }

    _downloadCsv(orders) {
      const csv = this.orders.csv(orders);
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mandala-pedidos.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }

    editOrder() {
      this.goBack();
      setTimeout(() => this.openDrawer(), 60);
    }

    refreshAll() {
      this.menu.renderMenu();
      this.drawer.renderDrawer(this.el.drawerBody, this.el.drawerTotal, this.el.drawerFoot, this.el.clearBtn);
      this.refreshFloat();
    }

    refreshFloat() {
      this.drawer.refreshFloat(this.el.floatCart, this.el.badge, this.el.fcTotal);
    }
  }

  global.PosApp = global.PosApp || {};
  global.PosApp.AppView = AppView;
})(window);
