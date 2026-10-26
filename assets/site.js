/* OH! Brothers: tiny progressive enhancement. Set the phone ONCE here. */
window.SITE = { phone: "" /* e.g. "+16085550123": [PLACEHOLDER - confirm with business] */ };
(function () {
  document.documentElement.classList.add("js");
  var S = window.SITE;
  // Tap-to-call
  var fmt = function (p) { var d = p.replace(/\D/g, "").slice(-10); return "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6); };
  document.querySelectorAll(".js-call").forEach(function (a) {
    if (S.phone) { a.href = "tel:" + S.phone; a.removeAttribute("aria-disabled"); }
    else { a.setAttribute("aria-disabled", "true"); a.title = "Phone number coming soon: [PLACEHOLDER - confirm with business]"; }
  });
  if (S.phone) document.querySelectorAll(".js-phone-text").forEach(function (e) { e.textContent = fmt(S.phone); });
  // Open-now chip (America/Chicago)
  var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var dow = days.indexOf(get("weekday")), mins = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
  var openDay = function (d) { return d !== 1; }, O = 7 * 60, C = 15 * 60;
  var chip = document.querySelector(".js-open");
  if (chip && dow > -1) {
    var txt, cls;
    if (openDay(dow) && mins >= O && mins < C) { txt = "Open now · until 3pm"; cls = "is-open"; }
    else if (openDay(dow) && mins < O) { txt = "Opens today at 7am"; cls = "is-closed"; }
    else { var n = (dow + 1) % 7; while (!openDay(n)) n = (n + 1) % 7; txt = "Closed now · opens " + (n === (dow + 1) % 7 ? "tomorrow" : names[n]) + " 7am"; cls = "is-closed"; }
    chip.textContent = txt; chip.classList.add(cls);
    var row = document.querySelector('.hours tr[data-day="' + dow + '"]'); if (row) row.classList.add("is-today");
  }
  // Header shadow
  var hdr = document.getElementById("hdr");
  addEventListener("scroll", function () { hdr.classList.toggle("is-scrolled", scrollY > 8); }, { passive: true });
  // Menu tabs
  var tabs = [].slice.call(document.querySelectorAll(".tab")), panels = [].slice.call(document.querySelectorAll(".menu-sec"));
  function sel(i, focus) {
    tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; panels[j].hidden = j !== i; });
    if (focus) tabs[i].focus();
  }
  if (tabs.length) {
    document.querySelector(".tabs").hidden = false;
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { sel(i); });
      t.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") sel((i + 1) % tabs.length, true);
        if (e.key === "ArrowLeft") sel((i - 1 + tabs.length) % tabs.length, true);
      });
    });
    sel(0);
  }
  // Reveal
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
    els.forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 60 + "ms"; io.observe(el); });
  } else els.forEach(function (el) { el.classList.add("is-in"); });
  // Click-to-load map
  var b = document.getElementById("loadmap");
  if (b) b.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.google.com/maps?q=OH+Brothers!+121+E+Main+St,+Stoughton,+WI+53589&output=embed";
    f.title = "Map: OH! Brothers, 121 E Main St, Stoughton"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
    var box = document.getElementById("mapbox"); box.replaceWith(f);
  });
})();
