# KSF Supabase + Vercel setup

The website displays “Supabase belum dikonfigurasi” when the two public environment variables are missing from the **Vercel deployment build**. Running schema.sql only creates database tables; it does not connect the deployed frontend.

In Vercel: Project → Settings → Environment Variables, add these for Production (and Preview if needed):

- `NEXT_PUBLIC_SUPABASE_URL` = Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase publishable/anon key
- `NEXT_PUBLIC_SUPABASE_BUCKET` = `media`

Then redeploy the latest deployment so Next.js rebuilds with those variables. Do not add `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_` variable or expose it in browser code.

## Database
Run the complete `schema.sql` in Supabase SQL Editor. It adds missing columns (including `created_at`) to an older registrations table before creating indexes, enables RLS, and preserves existing registration rows.

## Admin
The admin bootstrap script sets `app_metadata.role = admin`, which is checked by the database policies. Create/update the admin with the server-only service role key using `npm run admin:create`, then sign in again so the session token contains the updated role. Never expose the service role key to the frontend.
