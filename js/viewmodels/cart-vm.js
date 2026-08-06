/* ============================================================
   ViewModel del carrito: estado del carrito + acciones.
   ============================================================ */
(function (global) {
  "use strict";

  class CartViewModel {
    constructor(cartService, cartRepository, brandConfig, orderRepository) {
      this._service = cartService;
      this._repository = cartRepository;
      this._brand = brandConfig;
      this._orders = orderRepository;
      this.cart = this._service.sanitize(this._repository.load());
    }

    get brand() {
      return this._brand;
    }

    get count() {
      return this._service.count(this.cart);
    }

    get items() {
      return this.cart;
    }

    get total() {
      return this._service.total(this.cart);
    }

    qtyOf(key) {
      return this._service.qtyOf(this.cart, key);
    }

    changeQty(key, delta) {
      this.cart = this._service.changeQty(this.cart, key, delta);
      this._persist();
      this._emit();
    }

    add(key) {
      this.changeQty(key, 1);
    }

    remove(key) {
      this.cart = this._service.removeEntry(this.cart, key);
      this._persist();
      this._emit();
    }

    addPackage(ci, ii, item, selected) {
      this.cart = this._service.addPackage(this.cart, { ci, ii, item }, selected);
      this._persist();
      this._emit();
    }

    qtyOfPkg(ci, ii) {
      return this._service.qtyOfPkg(this.cart, ci, ii);
    }

    removeOnePackage(ci, ii) {
      this.cart = this._service.removeOnePackage(this.cart, ci, ii);
      this._persist();
      this._emit();
    }

    clear() {
      this.cart = this._service.clear();
      this._persist();
      this._emit();
    }

    get hasLast() {
      const last = this._orders.lastOrder();
      return !!(last && last.items && last.items.length);
    }

    get lastOrder() {
      return this._orders.lastOrder();
    }

    repeatLast() {
      const last = this._orders.lastOrder();
      if (!last || !last.items || !last.items.length) return;
      let cart = this.cart;
      last.items.forEach(it => {
        if (!it || typeof it.key !== "string" || !it.qty) return;
        const existing = cart.find(c => c.key === it.key);
        if (existing) {
          cart = cart.map(c => c.key === it.key
            ? global.PosApp.CartItem.create(it.key, it.name, it.price, c.qty + it.qty)
            : c);
        } else {
          cart.push(global.PosApp.CartItem.create(it.key, it.name, it.price, it.qty));
        }
      });
      this.cart = this._service.sanitize(cart);
      this._persist();
      this._emit();
    }

    _persist() {
      this._repository.save(this.cart);
    }

    _emit() {
      this.onChange && this.onChange();
    }
  }

  global.PosApp = global.PosApp || {};
  global.PosApp.CartViewModel = CartViewModel;
})(window);
