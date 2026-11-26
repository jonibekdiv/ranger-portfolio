export const profile = {
  name: 'Jonibek',
  brand: 'Ranger',
  role: 'Frontend Developer',
  country: 'Uzbekistan',
  telegram: 'https://t.me/jonibekdev',
  telegramUser: 'jonibekdev',
  github: 'https://github.com/jonibekdiv',
  githubHandle: 'jonibekdiv',
  // Fill these in to show them in the Contact section. Empty values are hidden.
  instagram: '',
  email: '',
}

export type Project = {
  id: string
  index: string
  title: string
  short: string
  description: string
  features: string[]
  stack: string[]
  image?: string
  live?: string
  repo: string
  kind: 'web' | 'bot'
}

export const projects: Project[] = [
  {
    id: 'esports',
    index: '01',
    title: 'Epic Esports Tournament',
    short: 'Esports tournament platform',
    description:
      'An esports tournament platform with team management, tournament organization and live streaming, built for PUBG scrims and leagues.',
    features: ['Team creation & management', 'Tournament organization', 'Live match streaming', 'Stats & leaderboards'],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Framer Motion'],
    image: '/img/esport.webp',
    live: 'https://esportarena.vercel.app',
    repo: 'https://github.com/jonibekdiv/pubgsayt',
    kind: 'web',
  },
  {
    id: 'loftmir',
    index: '02',
    title: 'Loftmir Interer',
    short: 'Premium furniture store',
    description:
      'A premium furniture website with 3D product visualization and a modern shopping experience for a Tashkent loft furniture brand.',
    features: ['Interactive 3D product viewer', 'Smooth scroll animations', 'Product catalog & cart', 'Multi-language UI'],
    stack: ['Next.js', 'TypeScript', 'Three.js', 'GSAP', 'Zustand'],
    image: '/img/loftmir.webp',
    live: 'https://loftmir-interer.vercel.app',
    repo: 'https://github.com/jonibekdiv/LOFTMIR-INTERER',
    kind: 'web',
  },
  {
    id: 'menu',
    index: '03',
    title: 'Restaurant QR Menu',
    short: 'Digital restaurant menu',
    description:
      'A modern digital restaurant menu that guests open by scanning a QR code, with clear food presentation, categories, search and a cart.',
    features: ['QR code access', 'Categories & search', 'Cart and ordering', 'Light & dark theme'],
    stack: ['HTML5', 'CSS3', 'JavaScript'],
    image: '/img/menu.webp',
    live: 'https://menu-restarants.vercel.app',
    repo: 'https://github.com/jonibekdiv/menu-restarants',
    kind: 'web',
  },
  {
    id: 'kutubxona',
    index: '04',
    title: 'Kutubxona24 Bot',
    short: 'Telegram library bot',
    description:
      'A Telegram library bot for accessing and managing digital books: browse the catalog, search by title and receive books right inside Telegram.',
    features: ['Book catalog & search', 'Books delivered in chat', 'Admin book management', 'SQLite storage'],
    stack: ['JavaScript', 'Node.js', 'Telegraf', 'SQLite'],
    repo: 'https://github.com/jonibekdiv/labrery_bot',
    kind: 'bot',
  },
]

export const skills = [
  { id: 'html', name: 'HTML5' },
  { id: 'css', name: 'CSS3' },
  { id: 'js', name: 'JavaScript' },
  { id: 'react', name: 'React.js' },
  { id: 'next', name: 'Next.js' },
  { id: 'ts', name: 'TypeScript' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'node', name: 'Node.js' },
  { id: 'git', name: 'Git' },
  { id: 'github', name: 'GitHub' },
  { id: 'three', name: 'Three.js' },
  { id: 'gsap', name: 'GSAP' },
] as const

export type SkillId = (typeof skills)[number]['id']

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
