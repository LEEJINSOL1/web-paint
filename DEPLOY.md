# Deploying Web Paint to Vercel

This project is a static website. On Vercel, use these settings:

- Framework Preset: Other
- Build Command: leave empty
- Output Directory: leave empty or `.`
- Install Command: leave empty

The site entry point is `index.html`.

For CLI deployment after logging in:

```bash
vercel
vercel --prod
```

If using a token:

```bash
vercel --prod --token YOUR_VERCEL_TOKEN
```

