export const siteConfig = {
  organization: 'Your Organization',
  mark: 'YO',
  eventName: 'Your next big thing',
  eyebrow: 'Registration is open',
  headline: 'Good things happen when we get together.',
  description:
    'A welcoming place to discover what we are building, find your people, and save your spot for the next experience.',
  date: 'Add your event date',
  location: 'Add your venue or online details',
  registrationNote: 'Registration is free. We will email you with the details.',
  email: 'hello@example.org',
  primaryColor: '#c6f36a',
  links: [
    { label: 'About', href: '#about' },
    { label: 'What to expect', href: '#experience' },
    { label: 'FAQ', href: '#faq' },
  ],
  highlights: [
    { number: '01', title: 'Meet your people', description: 'Connect with curious people who are excited to learn, make, and share.' },
    { number: '02', title: 'Try something new', description: 'Take part in hands-on sessions designed for beginners and experienced folks alike.' },
    { number: '03', title: 'Leave with momentum', description: 'Find your next idea, collaborator, or reason to come back.' },
  ],
  faqs: [
    { question: 'Who can register?', answer: 'Everyone is welcome. Update this answer with any age, membership, or experience requirements.' },
    { question: 'Do I need experience?', answer: 'No prior experience is needed unless the event details say otherwise. Bring your curiosity.' },
    { question: 'What happens after I register?', answer: 'We will send a confirmation and any important event details to the email address you provide.' },
  ],
  registrationFields: [
    { name: 'organization', label: 'School, company, or group', type: 'text', required: false },
    { name: 'note', label: 'Anything you would like us to know?', type: 'textarea', required: false },
  ],
} as const;

export type RegistrationField = (typeof siteConfig.registrationFields)[number];
