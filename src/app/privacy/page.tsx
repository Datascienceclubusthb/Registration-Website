import Link from 'next/link';
import {WorldBrand} from '@/components/world-ui';
export default function Privacy() {
  return (
    <main className="application-world">
      <header className="world-header world-container">
        <WorldBrand />
        <Link href="/register">Back to application ↗</Link>
      </header>
      <article className="privacy-notice world-container">
        <p className="world-kicker">APPLICATION DATA NOTICE / 23 OCTOBER 2026</p>
        <h1>
          YOUR INFORMATION.
          <br />
          YOUR APPLICATION.
        </h1>
        <p>
          Data Science Club at USTHB collects the details you submit to review your application,
          understand your interests, and contact you about the recruitment process.
        </p>
        <h2>What you share</h2>
        <p>
          Your identity and education details, optional contact information, department preferences,
          skills, experience, links, and motivation answers. Optional fields may be left blank. We
          record the time of submission and your agreement to this notice.
        </p>
        <h2>Who can access it</h2>
        <p>
          Submitted information is stored in the club’s MongoDB database. Authorized recruitment
          administrators can review, filter, export, and add internal review notes to applications.
          Your application is not published on the website.
        </p>
        <h2>Your browser draft</h2>
        <p>
          Your unfinished answers are stored locally in this browser on this device so you can
          return later. Use “Clear my draft” in the form to remove them, or clear this site’s
          browser storage. Avoid using a shared device for personal information. Clearing your draft
          does not delete an already submitted application.
        </p>
        <h2>Questions, corrections or deletion requests</h2>
        <p>
          Contact the DSC recruitment team through the club’s official channels or in person at
          USTHB. Include your application reference when available. Do not send passwords or
          sensitive identity documents with your application.
        </p>
        <h2>Your choice</h2>
        <p>
          Submission requires your explicit agreement to this use of your information. Department
          preferences are non-binding, and submitting an application does not mean acceptance into
          the club.
        </p>
        <Link className="world-button" href="/register">
          BACK TO APPLICATION ↗
        </Link>
      </article>
    </main>
  );
}
