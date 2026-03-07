# Fix HTTP 431 after sign-in (or "This page isn't working")

431 = request too large. Your **Supabase session cookie** is huge because your user in Supabase still has a large value (e.g. old profile picture as data URL) in **User Metadata**. After sign-in, that gets put in the cookie and every request fails with 431.

Do these steps **in order**:

---

## Step 1: Remove the large data in Supabase (required)

1. Go to **[Supabase Dashboard](https://supabase.com/dashboard)** → your project.
2. Open **Authentication** in the left sidebar → **Users**.
3. Find your user (by email) and **click the row** to open it.
4. Find **User Metadata** (or **raw_user_meta_data**).
5. If you see **`avatar_url`** with a very long value (e.g. starting with `data:image...`):
   - Edit the metadata and **delete** the `avatar_url` field, or set it to `""`.
6. If there are other very long fields, remove or shorten them.
7. **Save** the user.

---

## Step 2: Clear your browser data for the site

So the old huge cookie is gone:

1. Open **Developer Tools** (F12).
2. Go to the **Application** tab (Chrome/Edge) or **Storage** (Firefox).
3. Under **Storage** / **Cookies**, select **http://localhost:3000** (or your app URL).
4. **Clear all** cookies for that origin (or use **Clear site data** to clear cookies + local storage).
5. Close the tab and open a **new** tab.

---

## Step 3: Sign in again

1. Go to your app (e.g. **http://localhost:3000**).
2. Sign in with your email and password.

The new session will be small and 431 should stop. Profile pictures now use Supabase Storage (short URLs only), so this should not happen again.
