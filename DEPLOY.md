# adjudicationai.co.uk — Deployment Guide

## What You Have

A complete Next.js application with:
- **Frontend**: Professional React UI (navy + gold branding)
- **Stripe**: Real £500 payment checkout
- **Claude API**: AI-powered document generation using Anthropic's Claude
- **10 submission types** + adjudicator draft decision mode

## Quick Start (Local Development)

```bash
cd adjudication-ai
npm install
cp .env.example .env.local
# Fill in your API keys in .env.local (see "Get Your API Keys" below)
npm run dev
# Open http://localhost:3000
```

## Get Your API Keys

### 1. Stripe (Payments)

1. Go to https://dashboard.stripe.com/register — create a free account
2. Go to **Developers → API Keys**
3. Copy your **Secret key** (`sk_test_...`) → put in `STRIPE_SECRET_KEY`
4. Copy your **Publishable key** (`pk_test_...`) → put in `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. These are TEST keys — they work with test card number `4242 4242 4242 4242`

**When you're ready to go live:**
- Toggle "Test mode" off in Stripe Dashboard
- Replace test keys with live keys (`sk_live_...` and `pk_live_...`)
- Complete Stripe identity verification

### 2. Anthropic / Claude API (AI Generation)

1. Go to https://console.anthropic.com — create an account
2. Go to **Settings → API Keys**
3. Create a new key → copy it (`sk-ant-...`) → put in `ANTHROPIC_API_KEY`
4. Add credit to your account (each generation costs roughly £0.10–£0.50)

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
cd adjudication-ai
git init
git add .
git commit -m "Initial commit — adjudicationai.co.uk"
```

Then create a repo on GitHub (https://github.com/new) and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/adjudication-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com — sign up with your GitHub account
2. Click **"Add New Project"**
3. Import your `adjudication-ai` repository
4. Vercel auto-detects it's a Next.js project
5. **Add Environment Variables** before deploying:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
   - `ANTHROPIC_API_KEY` = your Anthropic API key
   - `NEXT_PUBLIC_APP_URL` = `https://adjudicationai.co.uk` (or your Vercel URL initially)
6. Click **Deploy**

Your site will be live at `https://adjudication-ai.vercel.app` within ~60 seconds.

### Step 3: Connect Your Domain (adjudicationai.co.uk)

1. Buy `adjudicationai.co.uk` from a domain registrar (Namecheap, GoDaddy, Cloudflare, etc.)
2. In Vercel Dashboard → your project → **Settings → Domains**
3. Add `adjudicationai.co.uk`
4. Vercel will give you DNS records to add at your registrar:
   - Usually an **A record** pointing to `76.76.21.21`
   - And a **CNAME** for `www` pointing to `cname.vercel-dns.com`
5. Add those records at your domain registrar
6. Wait for DNS propagation (usually 5–30 minutes)
7. Vercel automatically provisions SSL (HTTPS)

### Step 4: Go Live with Stripe

1. In Stripe Dashboard, complete identity verification
2. Switch from test mode to live mode
3. Update your Vercel environment variables with live Stripe keys
4. Redeploy (Vercel → Deployments → Redeploy)

## File Structure

```
adjudication-ai/
├── package.json              # Dependencies
├── next.config.js            # Next.js config
├── .env.example              # Template for API keys
├── .gitignore
├── DEPLOY.md                 # This file
├── app/
│   ├── layout.js             # HTML layout + metadata
│   ├── page.js               # Main React application (all screens)
│   ├── globals.css            # Global styles
│   └── api/
│       ├── create-checkout/
│       │   └── route.js      # Stripe checkout session creation
│       ├── verify-payment/
│       │   └── route.js      # Stripe payment verification
│       └── generate/
│           └── route.js      # Claude API document generation
└── public/                   # Static assets (add logo here)
```

## How It Works (End to End)

1. **User lands on adjudicationai.co.uk** → sees landing page
2. **Chooses role** → Party or Adjudicator
3. **Pays £500** → redirected to Stripe Checkout → pays → redirected back
4. **Fills in wizard** → 6 steps: submission type, parties, contract, dispute, arguments, documents
5. **Clicks Generate** → frontend calls `/api/generate` → server sends everything to Claude API
6. **Claude drafts the submission** → intelligent, tailored, with case law citations
7. **User sees the draft** → can copy to clipboard or forward to a solicitor
8. **Solicitor connection** → directory of construction law professionals

## Costs

| Item | Cost |
|------|------|
| Vercel hosting | Free (hobby plan) or $20/mo (pro) |
| Domain (adjudicationai.co.uk) | ~£10–50/year |
| Stripe fees | 1.4% + 20p per UK card = ~£7.20 per £500 transaction |
| Claude API per generation | ~£0.05–£0.30 (depending on length) |
| **Your revenue per submission** | **~£492** |

## Future Enhancements

- User accounts with login (NextAuth.js or Clerk)
- Document storage (upload to S3/Cloudflare R2)
- PDF export of generated submissions
- Real solicitor/consultant marketplace with booking
- Webhook for Stripe (more robust payment verification)
- Rate limiting and abuse prevention
- Analytics dashboard
