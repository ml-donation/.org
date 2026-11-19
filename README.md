# ML Donation — GitHub Pages demo

This package is configured for **GitHub Pages + JSONBin only**. No Cloudflare Worker, Supabase, Firebase, or other database is included.

## Files
- `index.html` — public landing page (the original uploaded homepage), reads branding/content settings from JSONBin.
- `member.html` — member dashboard connected to the shared JSONBin document.
- `admin/index.html` — admin dashboard at the clean `/admin/` route.
- `admin.html` — backward-compatible redirect to `/admin/`.
- `jsonbin-config.js` — JSONBin Bin ID, browser access key, and demo admin password.
- `jsonbin-seed.json` — starting JSON document matching the provided seed schema.

## Deploy on GitHub Pages
1. Create a GitHub repository.
2. Upload all files in this folder to the repository root.
3. In GitHub, open **Settings → Pages** and publish from the `main` branch, `/ (root)`.
4. Open the published site. Visitors see only the public homepage and Member Login shortcut; the admin link is deliberately hidden from the public homepage. Use `/member.html` for member login/signup and access the admin dashboard directly at `/admin/`. On a custom domain such as `https://hhhh.com`, the admin URL is `https://hhhh.com/admin/` (most browsers also accept `/admin`).

## JSONBin setup
The supplied Bin ID and access key are already placed in `jsonbin-config.js`. The app expects that bin to contain the supplied seed JSON. If the bin is empty, import `jsonbin-seed.json` into the existing bin first. Do not create a second database.

## Admin login
Password: `65273610`

## Important demo-only security warning
You explicitly requested a GitHub-only static deployment. Therefore the JSONBin access key and admin password are sent to every visitor's browser and can be read from the page source/devtools. Anyone who obtains the access key may read or modify the shared bin. The admin password is a client-side gate, not real authentication. This build is suitable only for testing with dummy accounts and non-sensitive sample data. **Do not use it for real donations, bank details, gift-card codes, identity documents, or personal/sensitive information.** Rotate the JSONBin keys before any public deployment if the credentials shared in chat were real.

## Image handling
Member profile photos and payment-proof photos are resized/compressed in the browser to JPEG before being stored as data URLs inside JSONBin. Large images increase the JSONBin document size quickly; keep uploads small and monitor your bin's size/plan limits.

## Data model
The same JSONBin record stores `settings`, `members`, `donationRequests`, `paymentProofs`, `suggestions`, `messages`, and `auditLog`. Admin settings and member submissions are written back to this shared record. Simultaneous writes from different browsers can overwrite each other because a static GitHub site has no server-side transaction/locking layer.


## Installable app (PWA)
This package includes a web-app manifest, service worker, app icons, and an install suggestion on the homepage and both dashboards. On supported Android/desktop browsers, the Install button opens the browser's native installation prompt. iPhone/iPad browsers do not expose a website-controlled automatic install prompt; visitors must use Safari Share → Add to Home Screen. The install dialog explains this. The site must be served over HTTPS (GitHub Pages does this).

The service worker caches the app shell for faster repeat visits and limited offline page loading. JSONBin-backed sign-in and live data still require an internet connection. The layout also includes viewport/safe-area handling and responsive media constraints; exact fit still depends on the original page components and device browser.


## Admin route and GitHub Pages paths
The admin dashboard is deployed from the `admin/` directory and is available at `/admin/`. All of its JSONBin config, PWA manifest, icons, and install script references point back to the repository root, so the route also works when GitHub Pages publishes a project site under `https://username.github.io/repository/`. Keep the `admin` folder name lowercase and upload the folder itself.


## Public homepage navigation update
The public homepage does not display an Admin button or admin link. Administrators access the dashboard directly at `/admin/`. The floating Member Login shortcut is positioned at the bottom-right (respecting mobile safe-area spacing) so it does not cover the top announcement/hero banner.
