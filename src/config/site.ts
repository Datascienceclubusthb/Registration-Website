export const departments = [
  {
    id: 'data-science-ai',
    name: 'Data Science & AI',
    landmark: 'Redstone Lab',
    icon: '▦',
    biome: 'The Redstone Lab',
    description:
      'Train models, run experiments, and turn raw data into dashboards and discoveries.',
    skills: ['Python', 'Machine Learning', 'Statistics'],
  },
  {
    id: 'software-development',
    name: 'Software Development',
    landmark: 'Command Station',
    icon: '⌘',
    biome: 'Command Station',
    description: 'Build web platforms, useful tools, and bots that bring ideas to life.',
    skills: ['JavaScript', 'React', 'Git & GitHub'],
  },
  {
    id: 'marketing-communication',
    name: 'Marketing & Communication',
    landmark: 'Beacon Tower',
    icon: '◉',
    biome: 'Beacon Tower',
    description: 'Tell the club story through campaigns, social media, and partnerships.',
    skills: ['Social Media', 'Copywriting', 'Content Strategy'],
  },
  {
    id: 'design-multimedia',
    name: 'Design & Multimedia',
    landmark: 'Pixel Studio',
    icon: '▧',
    biome: 'Pixel Studio',
    description: 'Shape our visual identity, posters, motion pieces, and digital interfaces.',
    skills: ['Figma', 'Graphic Design', 'Motion'],
  },
  {
    id: 'human-resources',
    name: 'Human Resources',
    landmark: 'Village Hall',
    icon: '♙',
    biome: 'Village Hall',
    description: 'Welcome new members, support the community, and help people find their place.',
    skills: ['Communication', 'Empathy', 'Organisation'],
  },
  {
    id: 'event-management',
    name: 'Event Management',
    landmark: 'The Arena',
    icon: '⚑',
    biome: 'The Arena',
    description: 'Plan workshops, hackathons, talks, and all the details that make them work.',
    skills: ['Project Management', 'Logistics', 'Negotiation'],
  },
  {
    id: 'partnerships-external-relations',
    name: 'Partnerships & External Relations',
    landmark: 'Portal Gate',
    icon: '◇',
    biome: 'Portal Gate',
    description: 'Connect DSC with companies, universities, and communities beyond the world.',
    skills: ['Networking', 'Negotiation', 'Public Speaking'],
  },
] as const;

export const siteConfig = {
  organization: 'Data Science Club',
  instagram: 'https://www.instagram.com/datascienceclub_usthb',
  mark: 'DSC',
  eventName: 'DSC Recruitment',
  eyebrow: 'Recruitment Open',
  headline: 'Your next adventure starts here.',
  description:
    'One community. Different talents. Infinite possibilities. Choose your path and join the Data Science Club at USTHB.',
  date: 'Applications are open',
  location: 'USTHB · Bab Ezzouar, Algeria',
  registrationNote:
    'Pick your path, pack your inventory, and tell us what you want to build with the club.',
  primaryColor: '#66d9e8',
  links: [
    {label: 'Select a world', href: '#worlds'},
    {label: 'How to join', href: '#how-to-join'},
  ],
  departments,
} as const;

export type DepartmentId = (typeof departments)[number]['id'];
