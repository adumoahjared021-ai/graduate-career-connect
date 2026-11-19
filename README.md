# Graduate Career Connect

A mobile-style app that helps university students and fresh graduates move from
school into work: find jobs and internships, build a CV, practise interviews,
learn skills, find a mentor, and show a portfolio.

Everything runs on your own computer. There is no backend, no database and no
API keys — your data is saved in the browser (localStorage).

## Use it online

The app is deployed at **https://graduate-career-connect.vercel.app**.

### Install on a phone

- **Android / Chrome:** open the link, tap the three-dot menu, choose
  **Add to Home screen** → **Install**.
- **iPhone / Safari:** open the link, tap **Share**, then **Add to Home Screen**.

It opens full screen with its own icon and keeps working offline.

### Install on a computer

- **Chrome or Edge:** open the link, then click the install icon at the right end
  of the address bar (or menu → **Install Graduate Career Connect**).

Each device keeps its own data in its own browser — nothing is shared or
uploaded.

## Run it

You need Node.js (already installed on this PC). In a terminal, in this folder:

```bash
export PATH="/c/Program Files/nodejs:$PATH"   # only needed once per terminal
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

To stop the server press `Ctrl + C` in the terminal.

If you see `npm: command not found`, you forgot the `export PATH=...` line above.

## First screen

The app opens on onboarding. Fill in the three steps, or press
**Fill with example details instead** to load a demo graduate (Akosua Mensah)
and see the app fully populated.

## What is inside

Bottom tabs:

| Tab | What it does |
| --- | --- |
| **Home** | Greeting, profile completion, recommended jobs, quick actions |
| **Jobs** | Browse / Saved / Applied, search, filter, apply |
| **Learn** | Skills courses with lessons; finishing a course issues a certificate |
| **Community** | Post and like updates with other graduates |
| **Me** | Your profile, strength checklist, career tools, reset button |

Career tools (from Home or Me): **CV builder** (edit + print/PDF),
**Interview practice** (questions, answer notes, self-rating),
**Mentors** (request a mentor), **Portfolio** (projects + employer view).

## Where to change the content

All demo content lives in one file: **`lib/seed.ts`**. Edit it to change:

- `JOBS` — the job and internship listings
- `COURSES` — skills courses and their lessons
- `MENTORS` — the mentor directory
- `INTERVIEW_QUESTIONS` — interview questions, structures and tips
- `SEED_POSTS` — the community feed
- `SAMPLE_PROFILE` — the demo graduate used by onboarding

Other useful files:

- `lib/types.ts` — the shape of every record
- `lib/logic.ts` — match score, profile completion, progress helpers
- `lib/store.tsx` — how state loads and saves to localStorage
- `app/globals.css` — colours, fonts and print styles

## Reset the demo

Go to **Me → Reset demo data**. This clears everything you entered and starts
fresh.

## Print the CV

Open **CV Builder**, then press the download icon (top right) or the
**Save as PDF** button. In the print dialog choose "Save as PDF". Page headers,
the tab bar and buttons are hidden automatically.

## Build for production

```bash
npm run build
npm start
```
