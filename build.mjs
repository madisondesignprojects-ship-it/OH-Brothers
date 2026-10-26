// OH! Brothers static build: node build.mjs (no dependencies)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const SITE_URL = process.env.SITE_URL || "https://oh-brothers.vercel.app";
const menu = JSON.parse(readFileSync("data/menu.json", "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ph = (s) => esc(s).replace(/\[PLACEHOLDER[^\]]*\]/g, (m) => `<mark class="ph">${m}</mark>`);
const price = (p) => (/PLACEHOLDER/.test(p) ? ph(p) : `<span class="sr">$</span>${esc(p)}`);
const DIM = { "03": [1800, 2400], "04": [1800, 2400], "06": [1800, 2400], "07": [2400, 1800] };
function img(token) {
  const [name, alt, sizes, eager] = token.split("|");
  const n = name.slice(0, 2), [w0, h0] = DIM[n] || [1800, 2400];
  const widths = [400, 800, 1200, 1600].filter((w) => existsSync(`assets/img/${name}-${w}w.webp`));
  const srcset = widths.map((w) => `/assets/img/${name}-${w}w.webp ${w}w`).join(", ");
  const src = `/assets/img/${name}-${widths.includes(800) ? 800 : widths[0]}w.webp`;
  const h = Math.round((800 * h0) / w0);
  return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" width="800" height="${h}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'}>`;
}
const item = (it) => `<div class="it"><div class="it__r"><span class="it__n">${esc(it.name)}${it.star ? ' <span class="star" aria-label="see advisory">*</span>' : ""}</span><span class="it__p">${price(it.price)}</span></div>${it.desc ? `<p class="it__d">${esc(it.desc)}${it.allergen ? ` <span class="it__a">(${esc(it.allergen)})</span>` : ""}</p>` : ""}</div>`;
const grp = (g) => `<div class="grp${g.style ? " grp--" + g.style : ""}"><h4 class="grp__t">${esc(g.title)}</h4>${g.note ? `<p class="grp__note">${esc(g.note)}</p>` : ""}${g.items.map(item).join("")}${g.footer ? `<p class="grp__foot">${esc(g.footer)}</p>` : ""}</div>`;
const secs = menu.sections;
const MENU = `<div class="tabs" role="tablist" aria-label="Menu sections" hidden>${secs.map((s, i) => `<button class="tab" role="tab" id="tab-${s.id}" aria-controls="m-${s.id}" aria-selected="${i === 0}" type="button">${esc(s.tab)}</button>`).join("")}</div>
${secs.map((s) => `<div class="menu-sec" id="m-${s.id}" role="tabpanel" aria-labelledby="tab-${s.id}"><h3 class="menu-sec__h">${esc(s.title)}</h3>${s.note ? `<p class="grp__note menu-sec__note" style="text-align:left">${esc(s.note)}</p>` : ""}${s.groups.map(grp).join("")}</div>`).join("\n")}
<p class="advisory">${esc(menu.advisory)}</p>`;
const espresso = secs.find((s) => s.id === "drinks").groups[0].items;
const DRINKS = `<ul class="drinks">${espresso.map((d) => `<li><span>${esc(d.name)}</span><span class="p">${esc(d.price)}</span></li>`).join("")}<li><span>Mimosa</span><span class="p">7.00</span></li></ul>`;
const BAKERY = menu.bakery.map((b) => `<li>${esc(b)}</li>`).join("");
const GMAPS = "https://www.google.com/maps/place/OH+Brothers!/@42.9165456,-89.2200791,17z";
const DIRECTIONS = "https://www.google.com/maps/dir/?api=1&amp;destination=OH+Brothers!+121+E+Main+St+Stoughton+WI+53589";
const jsonld = {
  "@context": "https://schema.org", "@type": "Restaurant", name: "OH! Brothers Restaurant", alternateName: ["OH Brothers!", "OH!Brother"],
  url: SITE_URL + "/", image: SITE_URL + "/assets/img/og-crepes.jpg",
  address: { "@type": "PostalAddress", streetAddress: "121 E Main St", addressLocality: "Stoughton", addressRegion: "WI", postalCode: "53589", addressCountry: "US" },
  geo: { "@type": "GeoCoordinates", latitude: 42.9165456, longitude: -89.2200791 },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "07:00", closes: "15:00" }],
  servesCuisine: ["Breakfast", "Brunch", "American", "Crepes", "Bakery"], priceRange: "$$", hasMenu: SITE_URL + "/#menu",
  sameAs: ["https://www.instagram.com/ohbrother.stoughton/"],
};
let html = readFileSync("src/index.template.html", "utf8")
  .replace(/\{\{img:([^}]+)\}\}/g, (_, t) => img(t))
  .replace("{{MENU}}", MENU).replace("{{DRINKS}}", DRINKS).replace("{{BAKERY}}", BAKERY)
  .replace("{{JSONLD}}", JSON.stringify(jsonld))
  .replaceAll("{{SITE_URL}}", SITE_URL).replaceAll("{{DIRECTIONS}}", DIRECTIONS).replaceAll("{{GMAPS}}", GMAPS)
  .replaceAll("{{YEAR}}", String(new Date().getFullYear())).replaceAll("{{VER}}", Date.now().toString(36));
if (/\{\{/.test(html)) throw new Error("Unfilled token: " + html.match(/\{\{[^}]*\}\}/)[0]);
writeFileSync("index.html", html);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc></url></urlset>\n`);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const n = (html.match(/PLACEHOLDER/g) || []).length;
console.log(`Built index.html (${(html.length / 1024).toFixed(1)} KB), ${secs.reduce((a, s) => a + s.groups.reduce((b, g) => b + g.items.length, 0), 0)} menu items, ${n} visible placeholders.`);
