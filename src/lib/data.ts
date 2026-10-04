// Sources: supplied resume (October 2026), user additions, and supplied media.
// YouTube and the FBGL repository were retained from the original portfolio.
export const PROFILE = {
  name: 'Benayaram Rekha',
  firstName: 'Rekha',
  initials: 'BR',
  role: 'Software Developer',
  specialty: 'Flutter Developer',
  email: 'benayaramcreations@gmail.com',
  phone: '+91 7780549645',
  phoneHref: 'tel:+917780549645',
  location: 'Vijayawada, India',
  company: 'Sandspace Technologies Pvt. Ltd.',
  graduation: '2025',
  resumeSummary:
    'Software Developer specializing in Flutter and Dart application development with 1+ Years at Sandspace Technologies Pvt. Ltd. Experienced in developing production mobile applications, enterprise HRM and CRM solutions, REST API integration, role-based application flows, responsive user interfaces, and state management using GetX. Strong hands-on experience with Git, GitHub, JIRA, branching, pull requests, collaborative development, issue tracking, debugging, testing, and Agile software development workflows.',
  intro:
    'Flutter applications. Thoughtful interfaces. From mobile learning to enterprise platforms.',
  aboutLine:
    'Building reusable Flutter components and maintaining structured application code using GetX state management.',
  quote: 'Structured code, collaborative development, and practical problem-solving.',
  github: 'https://github.com/benayaram',
  linkedin: 'https://www.linkedin.com/in/rekha-benayaram/',
  youtube: 'https://www.youtube.com/@benayaram',
  resume: '/Benayaram-Rekha-Resume.pdf',
  resumePages: ['/resume/page-1.png', '/resume/page-2.png', '/resume/page-3.png'],
  portrait: '/portrait-bust.webp',
  heroPoster: '/hero/poster.webp',
};
export const NAV = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['achievements', 'Achievements'],
  ['contact', 'Contact'],
] as const;
export const SOCIALS = [
  { name: 'GitHub', href: PROFILE.github },
  { name: 'LinkedIn', href: PROFILE.linkedin },
  { name: 'YouTube', href: PROFILE.youtube },
];

export interface Skill {
  name: string;
  symbol: string;
  family: string;
  logo?: string;
}
const group = (family: string, entries: [string, string, string?][]): Skill[] =>
  entries.map(([name, symbol, logo]) => ({ name, symbol, family, logo }));
export const SKILL_GROUPS = [
  ...group('Mobile', [
    ['Flutter', 'Fl', 'flutter'],
    ['Dart', 'Da', 'dart'],
    ['Android', 'An', 'android'],
  ]),
  ...group('Frontend', [
    ['React', 'Re', 'react'],
    ['HTML', 'Ht', 'html5'],
    ['CSS', 'Cs', 'css3'],
  ]),
  ...group('Backend', [
    ['Firebase', 'Fb', 'firebase'],
    ['REST APIs', 'Ap'],
    ['Flask', 'Fk', 'flask'],
  ]),
  ...group('Data & AI', [
    ['PostgreSQL', 'Pg', 'postgresql'],
    ['MySQL', 'My', 'mysql'],
    ['SQLite', 'Sq', 'sqlite'],
    ['Python', 'Py', 'python'],
  ]),
  ...group('Tools', [
    ['Git', 'Gi', 'git'],
    ['GitHub', 'Gh', 'github'],
    ['JIRA', 'Ji', 'jira'],
    ['Android Studio', 'As', 'androidstudio'],
    ['VS Code', 'Vs', 'vscode'],
    ['Postman', 'Po', 'postman'],
  ]),
];
export interface Project {
  id: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  image: string;
  live?: string;
  github?: string;
  status: string;
}
export const PROJECTS: Project[] = [
  {
    id: 'tega',
    title: 'TEGA',
    kicker: 'E-learning · Mobile application',
    description:
      'A production e-learning application bringing video lessons, quizzes, and role-based learning together in one mobile experience.',
    features: [
      'Video lessons & quizzes',
      'Role-based learning',
      'Push notifications',
      'REST API & Firebase integration',
    ],
    tech: ['Flutter', 'Dart', 'REST APIs', 'Firebase', 'Git', 'GitHub'],
    image: '/projects/tega.webp',
    live: 'https://play.google.com/store/apps/details?id=com.sandspace.tega',
    status: 'Published on Google Play',
  },
  {
    id: 'hrm',
    title: 'Empiqo HRM',
    kicker: 'People & operations · Mobile application',
    description:
      'An internal Human Resource Management application for Sandspace Technologies, supporting employees and administrators through everyday workflows.',
    features: [
      'Employee information',
      'Attendance tracking',
      'Leave management',
      'Role-based administration',
    ],
    tech: ['Flutter', 'Dart', 'REST APIs', 'Git', 'GitHub'],
    image: '/projects/hrm.webp',
    status: 'Not published yet',
  },
  {
    id: 'ao-crm',
    title: 'AO CRM',
    kicker: 'Overseas education · Web platform',
    description:
      'An enterprise CRM platform for overseas education consultancy operations, connecting every stage of a student’s journey.',
    features: [
      'Student lifecycle management',
      'University applications',
      'Role-specific dashboards',
      'Follow-ups & reminders',
    ],
    tech: ['React', 'PostgreSQL', 'Git', 'GitHub', 'JIRA'],
    image: '/projects/ao-crm.webp',
    status: 'Not published yet',
  },
  {
    id: 'fbgl',
    title: 'FBGL Ministries',
    kicker: 'Community · Android application',
    description:
      'An Android application supporting live video streaming, event management, notifications, and community communication.',
    features: [
      'Live video streaming',
      'Event management',
      'Real-time notifications',
      'Community communication',
    ],
    tech: ['Android', 'Firebase', 'AdMob'],
    image: '/projects/fbgl.webp',
    live: 'https://play.google.com/store/apps/details?id=com.benayaram.fbglministriesapp&hl=en',
    github: 'https://github.com/benayaram/FBGL-MINISTRIES-APP',
    status: 'Published on Google Play',
  },
];
export interface TimelineEntry {
  sort: string;
  date: string;
  title: string;
  place: string;
  detail: string;
  type: 'Education' | 'Experience';
}
export const EDUCATION: TimelineEntry[] = [
  {
    sort: '2018-04',
    date: 'Apr 2018 — Apr 2019',
    title: 'Class 10',
    place: 'Government School (E.M), Mallisala',
    detail: 'Completed class 10 education. Grade: 72%.',
    type: 'Education',
  },
  {
    sort: '2019-04',
    date: 'Apr 2019 — Apr 2021',
    title: 'Intermediate · MPC',
    place: 'Akshara Junior & Degree Collage, Jaggempeta',
    detail: 'Completed class 12, studying Mathematics, Physics and Chemistry. Grade: 57%.',
    type: 'Education',
  },
  {
    sort: '2021-01',
    date: '2021 — 2025',
    title: 'B.Tech · Computer Science & Engineering',
    place: 'Kakinada Institute of Engineering and Technology (KIET)',
    detail: 'Specialization in Artificial Intelligence & Data Science. Kakinada, India.',
    type: 'Education',
  },
];
export const EXPERIENCE: TimelineEntry[] = [
  {
    sort: '2023-06',
    date: 'Jun — Dec 2023',
    title: 'Android & Frontend Trainer',
    place: 'Tech Leads · Kakinada, India',
    detail:
      'Trained students in Android development with Kotlin and Firebase. Worked with ReactJS, Material UI, HTML, CSS, JavaScript, Node.js and XML for frontend and practical application development.',
    type: 'Experience',
  },
  {
    sort: '2024-08',
    date: 'Aug — Dec 2024 · Feb — Apr 2025',
    title: 'Senior Developer Intern',
    place: 'K-Hub & RCTS · IIIT Hyderabad',
    detail:
      'Collaborated on organization and client projects, using version control, debugging, implementation, testing, and team-based project delivery.',
    type: 'Experience',
  },
  {
    sort: '2025-07',
    date: '14 Jul 2025 — Present',
    title: 'Software Developer · Flutter',
    place: 'Sandspace Technologies Pvt. Ltd.',
    detail:
      'Developing Flutter and Dart applications across UI, business logic, REST APIs, GetX state management, testing, and releases. Contributed to TEGA, HRM and AO CRM using GitHub collaboration and JIRA in an Agile environment.',
    type: 'Experience',
  },
];
export const CERTIFICATIONS = [
  {
    title: 'Senior Developer Intern Certificate',
    issuer: 'RCTS @ IIIT Hyderabad',
    detail: 'Aug–Dec 2024 · Feb–Apr 2025',
    href: '/certificates/senior-developer-intern.jpg',
  },
  {
    title: 'Foundations of Modern Machine Learning',
    issuer: 'I-HUB @ IIIT Hyderabad',
    detail: 'Jun 2022 — Jun 2023',
    href: undefined,
  },
  { title: 'Dart', issuer: 'iNeuron', detail: '', href: undefined },
  { title: 'Python', issuer: 'iNeuron', detail: '', href: undefined },
  { title: 'Machine Learning with Go', issuer: 'Infosys', detail: '', href: undefined },
  { title: 'Summer Internship', issuer: 'IIIT Hyderabad', detail: '', href: undefined },
];
export const ACHIEVEMENTS = [
  {
    title: 'Hackathon winner',
    label: 'Ideas into working software',
    detail:
      'Three hackathon wins, building solutions under competitive, time-constrained conditions.',
    number: 3,
    suffix: '×',
    icon: 'trophy',
  },
  {
    title: 'Published production application',
    label: 'TEGA · Google Play',
    detail: 'Developed and contributed to the TEGA Flutter application at Sandspace Technologies.',
    number: undefined,
    suffix: '',
    icon: 'flutter',
  },
  {
    title: 'React Bootcamp',
    label: 'KIET · 25–26 Apr 2024',
    detail:
      'Developed a React web application fetching data from an API. ReactJS, Node.js, Material UI, HTML, CSS and JavaScript.',
    number: undefined,
    suffix: '',
    icon: 'react',
  },
  {
    title: 'NLP AI-Thon',
    label: 'KIET · 09–10 Feb 2023',
    detail:
      'Frontend developer for a Q&A community project. NLP, React, Material UI, HTML, CSS, JavaScript and Bootstrap.',
    number: undefined,
    suffix: '',
    icon: 'code',
  },
  {
    title: 'AI-Thon',
    label: 'KIET · 08–09 Oct 2023',
    detail:
      'Built a cartoon movie rating prediction website with Machine Learning, Flask, HTML, CSS and JavaScript.',
    number: undefined,
    suffix: '',
    icon: 'code',
  },
];
