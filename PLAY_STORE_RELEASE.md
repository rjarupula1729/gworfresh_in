# 🚀 GrowFresh — Play Store Release Guide

End-to-end checklist to get the app from your laptop into the hands of
real testers on Google Play **Internal Testing**, then to **Production**.

---

## 0. One-time accounts to create

| Account | URL | Cost | Why |
| --- | --- | --- | --- |
| Expo (EAS) | https://expo.dev/signup | Free tier OK | Cloud builds |
| Google Play Console | https://play.google.com/console | **$25 one-time** | Required to publish |
| Render.com (or Railway/Fly) | https://render.com | Free tier | Host the API + Postgres |

---

## 1. Repo layout (what you have now)

```
gworfresh_in/
├── App.js                  ← Expo entry
├── app.json                ← Expo config (icon, package id, version)
├── eas.json                ← Build / submit profiles
├── babel.config.js
├── package.json
├── assets/                 ← drop icon.png, splash.png etc. here
├── src/                    ← screens, components, services, navigation
├── backend/                ← Postgres-backed Node API
│   ├── Dockerfile
│   └── MIGRATION_TO_POSTGRES.md
└── render.yaml             ← one-click deploy for backend
```

---

## 2. Deploy the backend (do this FIRST – the app needs a public URL)

### Option A — Render.com (recommended, fully automated)

```bash
# 1. Push the repo to GitHub
git add -A && git commit -m "release: v1.0.0"
git push origin main

# 2. Go to https://dashboard.render.com → New → Blueprint
#    Select your repo. Render reads render.yaml and provisions:
#      - growfresh-db   (Postgres 16, free)
#      - growfresh-api  (Docker web service, free)
#    DATABASE_URL is auto-wired. JWT_SECRET is auto-generated.

# 3. Wait ~5 min. Visit https://growfresh-api.onrender.com/api/health
#    Should return {"ok":true,"ts":...}

# 4. Seed demo products (one-off shell on Render dashboard):
npm run db:seed
```

### Option B — Railway / Fly.io / your VPS

Just use the `backend/Dockerfile`. Required env vars:

| Var | Example |
| --- | --- |
| `DATABASE_URL` | `postgres://user:pw@host:5432/growfresh` |
| `JWT_SECRET` | 64-char random string |
| `JWT_EXPIRE` | `30d` |
| `CORS_ORIGIN` | `*` (or your admin web URL) |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

After deploy, run once:
```bash
npm run db:migrate && npm run db:seed
```

---

## 3. Point the mobile app at your live API

Edit **`app.json`**:

```jsonc
"extra": {
  "apiUrl": "https://YOUR-API.onrender.com/api",
  "eas": { "projectId": "<filled-in-by-eas-init>" }
},
"owner": "<your-expo-username>"
```

Also update the matching `EXPO_PUBLIC_API_URL` in **`eas.json`** for each
build profile (`preview` / `internal` / `production`).

---

## 4. Prepare Expo / EAS

```bash
cd /path/to/gworfresh_in

# 1. Install deps
npm install
npm install -g eas-cli expo-cli

# 2. Login
eas login

# 3. Link this folder to an EAS project (fills in projectId automatically)
eas init

# 4. Sanity check
npx expo-doctor
```

---

## 5. Add real assets

The `assets/` folder has a README explaining sizes. Minimum to ship:

- `assets/icon.png` — 1024×1024 (app icon)
- `assets/adaptive-icon.png` — 1024×1024 (Android adaptive foreground)
- `assets/splash.png` — 1284×2778 (launch screen)
- `assets/favicon.png` — 48×48

Tip: design one square logo, then run the snippet in `assets/README.md`.

---

## 6. First Play Console setup

1. **Create app** → name `GrowFresh`, default language English (India).
2. **App content** → fill:
   - Privacy policy URL (host the markdown in this repo as a public page or
     use [TermsFeed](https://www.termsfeed.com) free generator).
   - Data safety: declares we collect *Phone number, Approximate location,
     Health info (optional), Purchase history*; **stored on our own server**;
     **encrypted in transit**; user can request deletion.
   - Target audience: 13+.
   - Ads: No.
3. **App access** → "All functionality available without restrictions" + tester
   login note: *"Demo OTP is `1234` for any mobile number."*
4. **Store listing** → short description, full description, 2+ phone
   screenshots (1080×1920+), 1 feature graphic (1024×500).
5. **Create the Internal Testing track**:
   `Testing → Internal testing → Create new release` and add an email list
   (your testers' Google accounts).

---

## 7. Build & upload the first AAB

```bash
# Cloud build (≈15 min), produces an .aab Google Play wants
npm run build:internal

# When build finishes, push it straight to the Internal track:
npm run submit:internal
```

The first `eas submit` will ask you for the **Play service-account JSON**:

1. Play Console → Settings → API access → Create service account → grant
   *Release manager*.
2. Download the JSON, save as `play-service-account.json` at the repo root
   (already git-ignored).

After upload, in Play Console click **Review release → Start rollout to
Internal testing**. Testers get the install link via email within ~10 min.

---

## 8. Tester onboarding email (template)

> Subject: **You're invited to test GrowFresh 🌱**
>
> 1. Open this link on your Android phone (signed into the same Google
>    account that received this email):
>    `https://play.google.com/apps/internaltest/<id>`
> 2. Accept the invite, then tap **Install**.
> 3. Open the app, enter **any 10-digit mobile**, OTP = `1234`.
> 4. Try: browse Shop → add to Cart → place an Order → check Profile.
> 5. Report bugs at <bugs@growfresh.app> with a screenshot + steps.

---

## 9. Day-2 release flow (after first launch)

```bash
# 1. Bump the marketing version
#    Edit app.json -> expo.version  "1.0.0" → "1.0.1"
#    versionCode/buildNumber are auto-incremented by EAS.

# 2. Build + submit
npm run build:internal
npm run submit:internal

# 3. Promote internal → closed → production in Play Console UI
#    OR build straight to production:
npm run build:production
npm run submit:production
```

OTA JS-only fixes (no native change):

```bash
eas update --branch internal -m "Fix cart total rounding"
```

Testers get the patch on next app open (controlled by `expo-updates`).

---

## 10. Pre-flight checklist (DO NOT skip)

- [ ] `app.json` → `version`, `android.versionCode`, `android.package`
- [ ] `app.json` → `extra.apiUrl` points to live HTTPS API
- [ ] `eas.json` → `EXPO_PUBLIC_API_URL` matches for each profile
- [ ] Backend `/api/health` returns 200 from your phone (not just laptop)
- [ ] Postgres has been migrated + seeded
- [ ] `JWT_SECRET` is **not** the example value
- [ ] `CORS_ORIGIN` is set (or "*" if only mobile clients)
- [ ] Real `assets/icon.png` + `assets/splash.png` committed
- [ ] Privacy policy URL is public and reachable
- [ ] Demo OTP `1234` mentioned in App Access notes
- [ ] `play-service-account.json` saved locally (NOT committed)
- [ ] `npx expo-doctor` exits 0

---

## 11. Troubleshooting

| Symptom | Fix |
| --- | --- |
| "Network request failed" in app | API URL still `10.0.2.2` – update `app.json` & rebuild |
| Build fails: *icon not found* | Add real PNGs to `assets/` |
| Play upload rejected: *versionCode already exists* | EAS auto-increment is on, but a previous build used same number; run `eas build` again |
| OTP screen never advances | Check `/api/auth/verify-otp` rate-limit (10 / 10 min) or backend logs |
| 401 on every call after login | `JWT_SECRET` mismatch between deploys; redeploy with consistent secret |

---

## 12. What's "good enough for a real-user pilot"

✅ Internal track (up to 100 testers) — what this guide gets you to.
🔜 Closed testing track (open beta link) — once 12 testers used the app for 14+ days, Google unlocks Production.
🔜 Production release — fill out the content rating questionnaire, pay $25 once if not already, click *Promote internal → Production*.

Welcome to shipping 🚀
