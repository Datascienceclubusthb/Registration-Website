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

Set `MONGODB_URI` in the hosting provider's environment settings, deploy the Next.js app, and use HTTPS. The database should be private and accessible only to the app. Existing Docker and standalone Next.js configuration can be used for container deployments.
