/* ============================================================
   Servicio de horarios: calcula si el negocio está abierto.
   La configuración (hora de apertura/cierre) vive en brand-config.
   ============================================================ */
(function (global) {
  "use strict";

  class HoursService {
    constructor(brandConfig) {
      this._hours = brandConfig.hours || {};
    }

    isOpen(now) {
      if (!this._hours.open || !this._hours.close) return true;
      now = now || new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const open = this._toMinutes(this._hours.open);
      const close = this._toMinutes(this._hours.close);
      if (open === null || close === null) return true;
      if (open <= close) return minutes >= open && minutes < close;
      return minutes >= open || minutes < close;
    }

    statusText(now) {
      if (!this._hours.open || !this._hours.close) return "Atención continua";
      if (this.isOpen(now)) return "Abierto · " + this._hours.open + " – " + this._hours.close;
      return "Cerrado · Abrimos a las " + this._hours.open;
    }

    _toMinutes(hhmm) {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
      if (!m) return null;
      return +m[1] * 60 + +m[2];
    }
  }

  global.PosApp = global.PosApp || {};
  global.PosApp.HoursService = HoursService;
})(window);
