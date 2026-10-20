# TraLink — Vercel + Supabase

Dark neon link shortener for Vercel serverless functions and Supabase Postgres.

## Features
- Create short links and optional custom aliases.
- Redirect `https://your-project.vercel.app/slug` to the original URL.
- Count clicks.
- Admin-key-protected link list (last 100 links).
- Mobile responsive interface.

## Setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run all of `supabase.sql`.
3. In Supabase Project Settings → API, copy Project URL and **service_role** key. Keep the service role key secret.
4. Push this folder to GitHub, then import the repository into Vercel.
5. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase `service_role` secret key
   - `ADMIN_KEY` = a long private password, for example a unique random string
   - `PUBLIC_BASE_URL` = `https://YOUR-PROJECT.vercel.app` (no trailing slash)
6. Redeploy after adding environment variables.

## Android Termux deploy
Install Termux from a trusted source, then:
```sh
pkg update -y
pkg install git nodejs -y
termux-setup-storage
cd ~/storage/downloads
unzip tralink-vercel.zip
cd tralink-vercel
git init
git add .
git commit -m "Create TraLink shortener"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
Create the GitHub repository first. If Git asks for a password, use a GitHub personal access token, not your account password. Then import the repository in Vercel.

## Important security notes
- Never commit `.env` or publish `SUPABASE_SERVICE_ROLE_KEY`.
- Set the four environment variables in Vercel, not in `public/` or frontend JavaScript.
- `ADMIN_KEY` protects the list API; use a strong secret and do not share it.
- Public link creation can be abused. Before promoting publicly, consider adding rate limiting / CAPTCHA.
- This starter uses simple click counts and can undercount simultaneous clicks. It does not yet provide per-click analytics.
# Tralink
