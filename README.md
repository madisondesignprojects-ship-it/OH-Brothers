# OH! Brothers Restaurant: sample website

This is a static, mobile-first sample site for **OH! Brothers** (breakfast & lunch), 121 E Main St, Stoughton, WI 53589.
It follows the build script at `/workspace/oh-brothers/build-script.md` (lean sample build, 4 photos).

- **Build:** `node build.mjs`. This renders `data/menu.json` into `index.html`. Node 18+, no dependencies.
- **Preview:** `python3 -m http.server 8765` and open http://127.0.0.1:8765
- **Phone:** set `SITE.phone` in `assets/site.js` once it's confirmed. That turns on every Call button.
- **Placeholders:** each one shows as a yellow `[PLACEHOLDER - confirm with business]` tag. Search for `PLACEHOLDER` to find them.
- **Photos:** these are customer uploads from the Google Maps listing (Aug–Oct 2026), for the pitch/preview only. Get permission or replace them before a public launch.
- **Menu:** transcribed from photos of the paper menu (Aug–Oct 2026). Confirm all prices.
