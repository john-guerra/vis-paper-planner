# Deploying to Vercel + hosted Supabase

The instructor does these steps once; students copy the same pattern for their own project.
Never paste a key into a file, an issue, a PR or a chat. Keys go only into your shell session
or into Vercel's environment-variable settings.

## What the docs say (fetched 2026-10-22)

**Vercel preview deployments**
([Environments](https://vercel.com/docs/deployments/environments)):

> By default, Vercel creates a preview deployment when you:
>
> - Push a commit to a branch that is **not** your production branch (commonly `main`)
> - Create a pull request (PR) on GitHub, GitLab, Bitbucket, or Origin
> - Deploy using the CLI without the `--prod` flag, for example just `vercel`

**Vercel environment variables**
([Environment variables](https://vercel.com/docs/environment-variables)):

> Any change you make to environment variables are not applied to previous deployments, they only apply to new deployments.

> **Production**: When selected, the Environment Variable will be applied to your next Production Deployment. [...]
> **Preview**: The Environment Variable is applied to your next Preview Deployment.

So after setting variables you must redeploy; an old deployment never sees them.

**Supabase free-plan pausing.** The Supabase pricing page
([supabase.com/pricing](https://supabase.com/pricing)) says: "Free projects are paused after 1 week of inactivity."
I could not find that sentence on the docs pages I checked
([billing](https://supabase.com/docs/guides/platform/billing-on-supabase),
[free plan](https://supabase.com/docs/guides/platform/free-plan),
[upgrading](https://supabase.com/docs/guides/platform/upgrading)), which only say that
"Paused projects do not count towards your free project limit" and that "users have a 1-year window to restore the project on the platform from within Supabase Studio."
The pricing page text was read through an automated fetch, so verify the current policy at
https://supabase.com/pricing before relying on it. If the project is paused, the site returns the
"Search is unavailable" error until you restore it in the Supabase dashboard.

## One-time setup (instructor)

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard). Note the project ref
   (the id in the dashboard URL) and set a database password you store in a password manager.
2. Link and push the migrations from this repo:

   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```

3. Seed production. Copy the project URL and the service-role key from the dashboard
   (Project Settings, API) and set them **only in your shell**, then unset them:

   ```bash
   export SUPABASE_URL="https://<ref>.supabase.co"
   export SUPABASE_SERVICE_ROLE_KEY="<service role key>"
   npm run db:seed
   unset SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY
   ```

   The service-role key bypasses row-level security. Never put it in Vercel, `.env.local` of a
   deployed app, or the repo.

4. In Vercel (Project Settings, Environment Variables) add these for **both Production and Preview**:
   - `SUPABASE_URL` = the project URL
   - `SUPABASE_ANON_KEY` = the project's `anon` public key

5. Redeploy (push a commit, or Redeploy from the Vercel dashboard) so the new variables apply.

### Preview deploys share the production database

Production and Preview use the same two variables above, so every PR's preview deployment reads
the **production** database. That is fine here because the app only reads and the anon key is
limited by row-level security, but a preview of a migration or a write feature would touch
production data. To isolate previews, create a second Supabase project and give Preview its own
`SUPABASE_URL` and `SUPABASE_ANON_KEY` values.

## Verify

Replace `<url>` with the deployment URL (the PR's Vercel preview, then production after merge).

```bash
curl -i "<url>/api/health"             # 200 {"status":"ok"}; 503 {"status":"unavailable"} if Supabase is unreachable or paused
curl -i "<url>/api/papers?q=treemap"   # 200 with JSON {"results":[...]}
```

Then open `<url>/?q=treemap` in a browser: matching papers are listed.

`/api/health` runs a trivial query (`select id from papers limit 1`) with the anon key and returns
no stack, URL or key on failure. Point an uptime monitor at it.
