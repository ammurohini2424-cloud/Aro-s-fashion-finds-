# Aro's Fashion Finds

A simple React + Vite site to share clothing buy links with a Pinterest-like aesthetic.

## Features
- Public viewer page showing cards with image, name, price, tags and buy link.
- Admin panel protected by a password to add / edit / delete items.
- Data stored in browser `localStorage`. Export / import JSON supported.
- Ready for deployment to Vercel.

## Admin login
- **Admin password:** Arofinds2424

## How to run locally
1. Unzip the project.
2. Install dependencies:
   ```
   npm install
   ```
3. Run dev server:
   ```
   npm run dev
   ```
4. Open the shown local URL in your browser.

## Deploy to Vercel
1. Create a GitHub repo and push this project, or upload the folder directly in Vercel.
2. In Vercel, set the framework to **Vite**, build command `npm run build`, output directory `dist`.
3. Deploy — Vercel will build and publish your site. You can set a custom name like `aros-fashion-finds` during deployment.

## Notes & Security
- This app uses a client-side password for admin access. It's simple and convenient but not suitable for highly sensitive needs.
- If you want server-side auth or multi-admin features, I can help connect a proper backend (Firebase/Auth, Supabase, or Google Sheets).

Enjoy — Aro's Fashion Finds!