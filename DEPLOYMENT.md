# FaithVerse — Production Deployment Guide

FaithVerse is built with **Next.js 16 (App Router)** and **Supabase PostgreSQL**.
In Next.js, the **Frontend (UI)** and **Backend (API routes)** are unified in the same project.

---

## Option 1: Deploy to Vercel (Recommended — 1-Click Frontend + Backend)

Vercel is the native hosting platform for Next.js. Deploying to Vercel automatically deploys both:
1. **Frontend**: Rendered on Vercel's global Edge Network (ultra-fast worldwide).
2. **Backend**: All 15+ API routes (`/api/auth/*`, `/api/posts`, `/api/stories`, etc.) deployed as scalable Serverless Node functions with zero CORS configuration.

### Steps to Deploy on Vercel:

1. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub account.
2. Click **"Add New Project"** &rarr; Select **"darshan5462-maker/FaithVerse-app"**.
3. Framework Preset: **Next.js** (detected automatically).
4. Root Directory: `./` (leave default).
5. Open the **"Environment Variables"** section and paste the following keys (copy actual values from your local `.env` file):

| Variable Name | Description | Value in `.env` |
|---|---|---|
| `DATABASE_URL` | Supabase Transaction Pooler URL (port 6543) | Copy from your local `.env` |
| `DIRECT_URL` | Supabase Session Connection (port 5432) | Copy from your local `.env` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | Copy from your local `.env` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Publishable Key | Copy from your local `.env` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secret Key | Copy from your local `.env` |
| `JWT_SECRET` | Secret key for auth tokens | Copy from your local `.env` |
| `NEXT_PUBLIC_APP_URL` | Your production URL | `https://faithverse.vercel.app` |

6. Click **"Deploy"**.
7. Vercel will install dependencies, generate the Prisma client (`prisma generate`), build the pages, and provide a live production URL!

---

## Option 2: Deploy to Render (Persistent Web Service)

If you prefer deploying a dedicated Node.js server container:

### Steps to Deploy on Render:

1. Go to **[dashboard.render.com](https://dashboard.render.com)**.
2. Click **"New +"** &rarr; **"Web Service"**.
3. Connect your GitHub repository: `darshan5462-maker/FaithVerse-app`.
4. Configure service settings:
   - **Name**: `faithverse-app`
   - **Region**: Singapore (`ap-southeast-1`) or Oregon
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free or Starter
5. Under **Environment Variables**, add the same variables from your `.env` (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`).
6. Click **"Create Web Service"**.
