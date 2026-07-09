<div align="center">
  <h1>🛡️ Finne OS</h1>
  <h3>Next-Generation AI Assistant Banking Console</h3>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://console.cloud.google.com/"><img src="https://img.shields.io/badge/Auth-Google_SSO-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Cloud" /></a>
  </p>

  <p>
    <a href="https://finne-os-banking-dashboard.vercel.app"><img src="https://img.shields.io/badge/Deploy_Live-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Deployment" /></a>
  </p>
</div>

---

## 📖 What is Finne OS?

Finne OS is a high-fidelity, secure retail and corporate banking dashboard. It features dynamic persona routing (Customer, Employee, and Manager views), live webcam biometric liveness checks, role-based cloud file storage uploads, and Google OAuth Single-Sign-On integrations.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Framer Motion, Zustand, Recharts, Tailwind CSS.
* **Database & Auth**: Supabase (PostgreSQL), Supabase Auth (Email & Google OAuth SSO).
* **Cloud Storage**: Supabase Storage Buckets (binary file uploads sorted by folder structures).
* **Hardware API**: HTML5 Web Camera Media Devices API (`getUserMedia`) and Canvas Frame Capture.

---

## 📂 Repository Structure

The workspace is a streamlined, standalone monorepo containing:
* **`apps/dashboard/`**: The core Next.js application containing all pages, styles, stores, and custom banking tabs.
* **`supabase/migrations/`**: Contains the consolidated PostgreSQL schema, RLS policies, and triggers (`01_finne_os_schema.sql`).

---

## 🚀 Setting Up the Project

### 1. Configure Local Environment Variables
Create a `apps/dashboard/.env.local` file and input your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANONYMOUS_KEY
```

### 2. Install Dependencies & Boot Local Server
From the repository root directory, run:
```bash
# Install packages
npm install

# Run the local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the cinematic boot splash and login console.

---

## 🔒 Hardening Supabase Storage & RLS

Finne OS uploads captured face snapshots directly into a folder structure based on user roles (`CUSTOMER/`, `EMPLOYEE/`, or `MANAGER/`). To set this up:

### Step 1: Create the Storage Bucket in Supabase
1. Go to your **Supabase Dashboard** -> **Storage** (bucket icon).
2. Click **Create bucket** or **+ New bucket**.
3. Set the name to exactly **`biometrics`**.
4. Toggle **Public bucket** to **ON** (so the application can load CDN public URLs for user avatars).
5. Click **Save**.

### Step 2: Apply SQL Migration Rules
Run the unified schema file **`supabase/migrations/01_finne_os_schema.sql`** in your Supabase SQL Editor. This sets up the base schemas and establishes secure Row Level Security (RLS) policies for storage uploads:
* **Upload Restraints**: Users can only upload or update files inside the `biometrics` bucket whose names match their user ID (`name LIKE '%' || auth.uid() || '.jpg'`), preventing security leaks.
* **No List Leakage**: The broad directory listing `SELECT` policy is omitted. User directory lists cannot be scanned or Swept from public clients.

---

## 🌐 Configuring Google OAuth SSO (Step-by-Step)

### Step 1: Create a Google Cloud Project
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project dropdown at the top and click **New Project**. Name it `Finne-OS-Banking` and click **Create**.
3. Select the project from your dashboard.

### Step 2: Configure the OAuth Consent Screen
1. Go to **APIs & Services** -> **OAuth consent screen**.
2. Select **External** and click **Create**.
3. Provide the App Information:
   * **App name**: `Finne_OS`
   * **User support email**: Choose your email from the dropdown list.
   * **Developer contact email**: Enter your email.
4. Click **Next** through *Audience* and *Contact* steps and click **Create**.

### Step 3: Generate Web OAuth Client ID
1. Go to **Credentials** -> Click **+ Create Credentials** -> Select **OAuth client ID**.
2. Set the Application type to **Web application**.
3. Set the Name to `Finne OS Web Client`.
4. Under **Authorized JavaScript origins**, add:
   * `http://localhost:3000`
   * `http://127.0.0.1:3000`
   * `https://finne-os-banking-dashboard.vercel.app`
5. Under **Authorized redirect URIs**, add your Supabase project callback link:
   * `https://<YOUR_SUPABASE_PROJECT_ID>.supabase.co/auth/v1/callback`
6. Click **Create** and copy your **Client ID** and **Client Secret**.

### Step 4: Link credentials in Supabase
1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
2. Enable the Google provider, paste the Client ID and Client Secret, and click **Save**.

---

## 🎥 Webcam Access on Insecure Local Networks
Modern browsers block camera access on plain HTTP networks (e.g. `http://<YOUR_LOCAL_IP>:3000`). If testing over local network IPs, follow these steps to override browser blocks:
1. Open **`chrome://flags/#unsafely-treat-insecure-origin-as-secure`** in your Chrome browser.
2. Toggle the flag to **Enabled**.
3. Enter your local server address (e.g., `http://<YOUR_LOCAL_IP>:3000`) in the text area.
4. Click **Relaunch** at the bottom. Your browser will now allow camera liveness captures on that IP!


