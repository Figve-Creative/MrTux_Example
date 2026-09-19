# Working on this repo

Small team, one production site, no dedicated staging environment yet — so the workflow
below is deliberately lightweight. It'll grow if/when the team does.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): a short type-prefixed
summary line, body only if it adds real context.

```
feat: add real inventory to Collection page
fix: correct broken link in footer
chore: update dependencies
docs: rewrite README
refactor: extract Header nav into its own component
```

Keep the summary line under ~70 characters. If you need to explain *why*, not just *what*,
add a blank line and a short paragraph — but most commits don't need one.

## Branching

- **`main` is production.** Every push to it auto-deploys via Vercel. Don't push broken
  code to `main`.
- For small, safe changes (copy edits, content updates, small bug fixes) — commit directly
  to `main`.
- For anything bigger or riskier (new features, the Supabase backend integration, anything
  that touches routing or the data model) — work on a branch and open a pull request on
  GitHub before merging, even if you're merging it yourself. It gives you a diff to review
  and a paper trail if something breaks.

```bash
git checkout -b feat/short-description
# ... make changes, commit ...
git push -u origin feat/short-description
# open a PR on GitHub, review the diff, merge into main
```

## Before pushing

```bash
npm run lint
npm run build   # catches anything that breaks the production build
```

## Secrets

Never commit real API keys, Supabase credentials, or `.env` files. `.gitignore` already
excludes `.env*` — if you add a new secret, put it in `.env.local` (not tracked) and
document the variable name (not the value) in `.env.example`.
