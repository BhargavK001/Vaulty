# Bhargav Archive - Google Drive Setup Guide

This guide will help you set up the necessary Google Cloud credentials to enable document management and login features in your application.

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top left and select **"New Project"**.
3. Name it `Bhargav Archive` (or any name you prefer) and click **Create**.

## 2. Enable Required APIs
1. In the sidebar, go to **APIs & Services > Library**.
2. Search for and **Enable** the following two APIs:
   - **Google Drive API**
   - **Google Auth User Data API** (or simply "Google People API" for user info)

## 3. Configure OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Select **User Type: External** and click **Create**.
3. Fill in the **App Information**:
   - App Name: `Bhargav Archive`
   - User support email: (Your email)
   - Developer contact info: (Your email)
4. Click **Save and Continue**.
5. **Scopes section**: This is the most important part. Click **Add or Remove Scopes** and manually add these:
   - `.../auth/drive.readonly`: To see and download your documents.
   - `.../auth/drive.metadata.readonly`: To read file dates and names.
   - `.../auth/userinfo.email`: To identify your account.
6. Click **Save and Continue** until you are back at the dashboard.
7. Click **"Publish App"** to move it out of testing mode (optional but recommended for persistent access).

## 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > OAuth client ID**.
3. Select **Application type: Web application**.
4. Name: `Bhargav Archive Local`.
5. **Authorized JavaScript origins**:
   - `http://localhost:3000`
6. **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/google/callback`
7. Click **Create**.
8. Copy your **Client ID** and **Client Secret**.

## 5. Update Environment Variables
1. Open your [`.env.local`](file:///c:/Users/Lenovo/Downloads/Live%20Doc%20view/.env.local) file.
2. Paste your credentials:
   ```env
   GOOGLE_CLIENT_ID=your_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_secret_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```
3. **Restart your server** (`npm run dev`) for the changes to take effect.

## 6. Usage
Once set up, go to the **Settings** page in the app and click **"Connect Google Drive"**. You will be redirected to the familiar Google sign-in screen.
