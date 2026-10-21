# Event and Club Registration Starter

A reusable registration website for a club, meetup, workshop, conference, or community event. Edit the shared config, connect MongoDB, and run the site.

## Quick start

1. Install Node.js 20 or newer.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env.local` and set `MONGODB_URI` to a MongoDB database you control.
4. Start the site with `npm run dev` and open `http://localhost:3000`.

Registrations are saved in MongoDB in the `submissions` collection. The `/api/register` endpoint returns a setup message until `MONGODB_URI` is configured.

## Customize for your organization

Edit [`src/config/site.ts`](src/config/site.ts). This is the single source for the organization name and short mark, event title and intro, date and location, contact email, accent color, navigation, highlight cards, FAQs, and extra registration questions. The registration form always asks for a name and email; phone and any configured extra questions are optional unless marked required.

Extra registration fields support `text` and `textarea` types. Use a unique `name` made of letters, numbers, or underscores, and set a clear label. Their answers are stored with each submission.

Replace the starter copy and contact email before publishing. The sample date and venue are intentionally labeled as placeholders.

## Production

### Deploy on Vercel

1. In Vercel, choose **Add New → Project** and import `datascienceclubusthb-club/Registration-Website`.
2. Leave the detected Next.js framework, root directory, install command, and build command at their defaults. The build command is `npm run build`.
3. Add `MONGODB_URI` in the project's Environment Variables settings. Add it to every environment where registrations should be accepted (Production, Preview, and/or Development).
4. Deploy the project. Redeploy after changing environment variables.

Vercel can build and serve the site without `MONGODB_URI`, but registration submissions will return an unavailable message until the variable points to a reachable MongoDB database. Keep the database private and allow its network access from your deployment environment.

Vercel detects the Next.js app automatically, so this repository does not need a `vercel.json` file or custom output directory. The Docker setup is available for self-hosting.
