// Content mirrors portoqiqi.vercel.app (source: RifqiFachruradzi/ProtofolioPribadi, src/data/profile.js).

export type Quest = {
  id: string;
  icon: string;
  status: "active" | "complete";
  title: string;
  company: string;
  period: string;
  project: string;
  points: string[];
  tags: string[];
};

export type Project = {
  icon: string;
  title: string;
  kind: string;
  period: string;
  description: string;
  highlights: string[];
  tags: string[];
  demo?: string;
  repo?: string;
  repo2?: string;
};

export type SkillGroup = { icon: string; title: string; items: string[] };
export type Contact = { icon: string; label: string; value: string; href: string };


export const profile = {
  name: 'Muhammad Rifqi Fachruradzi',
  shortName: 'Rifqi',
  role: 'Full Stack Developer',
  location: 'Jakarta, Indonesia',
  summary:
    "Full Stack Developer with production experience building enterprise systems for Indonesia's largest transportation and logistics group. Delivered 45+ REST API endpoints in Go for a yard management platform handling real-time vehicle operations, and currently builds internal business platforms end to end using React.js and TypeScript in a micro-frontend architecture with Bun and Hono services.",
  dialog: [
    "Hi! I'm Rifqi, a Full Stack Developer from Jakarta.",
    'I build APIs with Go, Python & Hono, and cozy UIs with React + TypeScript.',
    'Right now I ship enterprise apps for a big logistics group in Indonesia.',
    'Welcome to the neon city. Every store here is a part of my story ~',
  ],
  stats: [
    { value: '45+', label: 'REST endpoints shipped in Go' },
    { value: '3', label: 'dev roles in logistics tech' },
    { value: '55%', label: 'ROUGE-L on thesis model' },
    { value: '100%', label: 'usability validation (TAM/UEQ)' },
  ],
  attributes: [
    { key: 'Role', value: 'Full Stack Dev' },
    { key: 'Company', value: 'PT Adi Sarana Armada Tbk' },
    { key: 'Location', value: 'Jakarta, ID' },
    { key: 'Languages', value: 'Indonesian, English' },
  ],
};

export const quests: Quest[] = [
  {
    id: 'atlas',
    icon: 'chest',
    status: 'active',
    title: 'Full Stack Developer (Contract)',
    company: 'PT Adi Sarana Armada Tbk',
    period: 'Aug 2026 – Present',
    project: 'Project ATLAS — internal procurement & vendor management platform',
    points: [
      'Develop and maintain enterprise web apps end to end with a micro-frontend architecture: React.js + TypeScript on the frontend, Bun + Hono for backend services.',
      'Ship features across Vendor Management, Vendor Portal, and Acquisition modules, including vendor registration, legal document upload, and metadata validation that enforces compliance rules before submission.',
      'Build reusable components in a shared UI-Kit package, including data tables adopted across multiple micro-frontends to keep design consistent and cut duplicated work.',
      'Design and consume REST endpoints across internal microservices, with data validation, error handling, and PostgreSQL data access.',
      'Refactor complex validation logic to reduce cognitive complexity and pass lint, type checking, and unit-test gates enforced by pre-commit and pre-push hooks.',
      'Collaborate with backend and QA teams through Git branching, code review, and merge requests on GitLab and Bitbucket.',
    ],
    tags: ['React', 'TypeScript', 'Bun', 'Hono', 'PostgreSQL', 'Micro-Frontend'],
  },
  {
    id: 'yms',
    icon: 'truck',
    status: 'complete',
    title: 'Full Stack Developer, Internship',
    company: 'PT Tri Adi Bersama (Anteraja)',
    period: 'Apr 2026 – Jul 2026',
    project: 'Olympus YMS — Yard Management System for logistics hub operations',
    points: [
      'Delivered 45+ production REST API endpoints in Go across two microservices, following a layered controller, usecase, and repository architecture.',
      'Built the full vehicle lifecycle: gate registration, parking allocation, dock assignment, dock-in, dock-out, and check-out, replacing manual yard coordination with a tracked digital process.',
      'Eliminated dock double-booking with pre-execution validation, sequential checkpoint enforcement, and HTTP 409 conflict handling under concurrent operator access.',
      'Implemented real-time queue and zone-capacity updates over WebSocket, consumed by a Next.js dashboard so operators see live yard status without refreshing.',
      'Integrated a Kogito rule engine to orchestrate dock-freed events, automatically calling the next vehicle when a dock is released.',
      'Delivered cold-chain temperature QC with idempotent exception handling, and integrated WMS and CFS services for cross-system notifications and photo upload.',
      'Built an immutable audit trail, 12-month archive queries, and an offline-first sync endpoint that reconciles field operator data on reconnect.',
      'Instrumented services with Prometheus metrics and retry logic, and wrote integration tests for dock-in, dock listing, temperature reading, and FIFO queue ordering.',
      'Developed the Queue Management dashboard and Arrival Check-out panel in Next.js, including reusable WebSocket hooks for live queue position and zone capacity.',
    ],
    tags: ['Go', 'Microservices', 'WebSocket', 'Next.js', 'Kogito', 'Prometheus'],
  },
  {
    id: 'asa-backend',
    icon: 'server',
    status: 'complete',
    title: 'Backend Developer, Internship',
    company: 'PT Adi Sarana Armada Tbk',
    period: 'Feb 2024 – Sep 2024',
    project: 'Internal business applications',
    points: [
      'Developed and maintained RESTful APIs using Python with Flask and FastAPI to support internal business applications.',
      'Designed and implemented backend architecture for scalable API services based on business requirements.',
      'Optimized MySQL queries, improving data retrieval performance for internal reporting.',
      'Deployed backend services behind NGINX as a reverse proxy, improving reliability and security.',
      'Partnered with frontend developers on API integration and resolved production issues to keep systems stable.',
    ],
    tags: ['Python', 'Flask', 'FastAPI', 'MySQL', 'NGINX'],
  },
];

export const projects: Project[] = [
  {
    icon: 'chest',
    title: 'Procura — Procurement System',
    kind: 'Web App',
    period: '2026',
    description:
      'End-to-end procurement flow: purchase request with 2-level approval, purchase order, vendor approval portal, goods receipt, invoice 3-way match, journal voucher, and payment, with a 10-step tracking timeline.',
    highlights: ['PR → PO → GR → invoice → payment', 'Vendor portal & printable PO'],
    tags: ['Next.js 16', 'TypeScript', 'Zustand', 'Tailwind 4'],
    demo: 'https://procurement-management-system-three.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/procurement-management-system',
  },
  {
    icon: 'coin',
    title: 'MiniMarket ERP',
    kind: 'Web App',
    period: '2026',
    description:
      'Minimarket management: POS with barcode scan, stock & inventory valuation, cash & bank, receivables/payables, and financial statements. Every transaction posts a double-entry journal automatically.',
    highlights: ['Auto double-entry journals', 'Balance sheet, P&L, cash flow'],
    tags: ['Next.js', 'TypeScript', 'Drizzle ORM', 'Turso / SQLite'],
    demo: 'https://mini-market-app-wheat.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/MIniMarket-APP',
  },
  {
    icon: 'box',
    title: 'Gudang Tanpa Kertas',
    kind: 'Web App · AI',
    period: '2026',
    description:
      'Paperless warehouse receiving: matches PO, delivery note, and physical goods, with photo inspection, digital signatures, real-time stock, supervisor approval, audit log, and the AI assistant "Gudi".',
    highlights: ['AI assistant (Gemini / Claude)', 'Atomic stock ops & audit log'],
    tags: ['Next.js 16', 'TypeScript', 'Upstash Redis', 'Gemini'],
    demo: 'https://gudang-document.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/Gudang-Document',
  },
  {
    icon: 'monitor',
    title: 'Visual Office',
    kind: 'Web App · AI',
    period: '2026',
    description:
      'Isometric 2.5D pixel office where the employees are AI agents. Build divisions and departments, hire agents, and give orders as the Boss; teams read live data from the warehouse and minimarket apps to write reports.',
    highlights: ['Multi-agent hierarchy', 'Integrations with my other apps'],
    tags: ['JavaScript', 'Three.js', 'Gemini', 'Upstash Redis'],
    demo: 'https://visual-office.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/visual-offine',
  },
  {
    icon: 'truck',
    title: 'Ekspedisi App',
    kind: 'Web App',
    period: '2026',
    description:
      'Logistics & expedition management: orders, work orders (SPK), travel letters (SPJ), units, drivers, distances, trip costs and revenue, settlement, and reports.',
    highlights: ['Trip cost & revenue tracking', 'Settlement & reports'],
    tags: ['Next.js', 'TypeScript', 'shadcn/ui', 'Recharts'],
    demo: 'https://ekspedisi-app.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/ekspedisi-app',
  },
  {
    icon: 'book',
    title: 'Accounting Management System',
    kind: 'Web App',
    period: '2026',
    description:
      'Accounting app with journals, general ledger, trial balance, receivable/payable aging, and financial statements. Login and per-user data protected by Supabase Row Level Security.',
    highlights: ['Supabase auth + RLS', 'Default chart of accounts'],
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    demo: 'https://laporan-keuangan-app-delta.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/laporan-keuangan-app',
  },
  {
    icon: 'heart',
    title: 'SimpananMu',
    kind: 'Web App · AI',
    period: '2026',
    description:
      'Personal finance tracker: dashboard, transactions, budgets, savings goals, and PDF reports, plus "AI Buddy" that reads your data to suggest savings plans. Syncs per account and queues changes while offline.',
    highlights: ['Gemini-powered AI Buddy', 'Offline queue & CSV import/export'],
    tags: ['React 19', 'Redux Toolkit', 'Recharts', 'Upstash Redis'],
    demo: 'https://simpanan-mu.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/SimpananMu',
  },
  {
    icon: 'star',
    title: 'COROS Running Dashboard',
    kind: 'Personal Project',
    period: '2026',
    description:
      'Running progress dashboard that pulls runs, fitness assessment, training load, and body metrics from COROS via OAuth 2.0, syncs on a Vercel Cron, and stores versioned JSON data in the repo.',
    highlights: ['OAuth 2.0 + Vercel Cron sync', 'Data versioned via GitHub'],
    tags: ['Next.js', 'TypeScript', 'Recharts', 'Vercel Cron'],
    demo: 'https://coros-running-dashboard.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/coros-running-dashboard',
  },
  {
    icon: 'cap',
    title: 'SinergiPro',
    kind: 'Company Profile',
    period: '2025',
    description:
      'Company landing page for PT Duta Mitra Sinergi: services, about, and a partner registration form with direct WhatsApp contact.',
    highlights: ['Responsive landing page', 'Partner sign-up form'],
    tags: ['React', 'Vite', 'TailwindCSS'],
    demo: 'https://sinergi-pro.vercel.app',
    repo: 'https://github.com/RifqiFachruradzi/SinergiPro',
  },
  {
    icon: 'barrel',
    title: 'Warehouse Stock (Tech Test)',
    kind: 'Tech Test',
    period: '2026',
    description:
      'Warehouse stock app with goods receiving, goods issue, and a stock overview: a React frontend talking to a FastAPI backend with Pydantic validation.',
    highlights: ['React + FastAPI', 'Receiving & issuing flows'],
    tags: ['React', 'FastAPI', 'Python', 'Axios'],
    repo: 'https://github.com/RifqiFachruradzi/Techtest-React',
    repo2: 'https://github.com/RifqiFachruradzi/Techtest-Fastapi',
  },
  {
    icon: 'scroll',
    title: 'Indonesian News Summarizer',
    kind: 'Thesis',
    period: 'Sep 2025 – Feb 2026',
    description:
      'Extractive summarization for Indonesian news using modified Sentence-BERT embeddings and semantic similarity to pick the most relevant sentences. Shipped with a web UI and evaluated with TAM & UEQ.',
    highlights: ['ROUGE-L 55%', '100% usability validation'],
    tags: ['Python', 'Sentence-BERT', 'NLP', 'Web UI'],
  },
];

export const skills: SkillGroup[] = [
  {
    icon: 'book',
    title: 'Languages',
    items: ['Go', 'TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    icon: 'server',
    title: 'Backend',
    items: [
      'REST API Design',
      'Microservices',
      'Bun',
      'Hono',
      'FastAPI',
      'Flask',
      'WebSocket',
      'Kogito Rule Engine',
      'NGINX',
      'Prometheus',
    ],
  },
  {
    icon: 'monitor',
    title: 'Frontend',
    items: ['React.js', 'Next.js', 'TailwindCSS', 'Micro-Frontend', 'Responsive Design', 'UI/UX'],
  },
  {
    icon: 'barrel',
    title: 'Database',
    items: ['PostgreSQL', 'MySQL'],
  },
  {
    icon: 'wrench',
    title: 'Practices & Tools',
    items: [
      'Git',
      'GitLab',
      'Bitbucket',
      'Monorepo',
      'Integration Testing',
      'Code Review',
      'Agile',
      'System Integration',
    ],
  },
];

export const education = {
  degree: 'Bachelor of Computer Science and Mathematics',
  school: 'Universitas Bina Nusantara',
  period: 'Sep 2020 – Jan 2026',
  note: 'Thesis: extractive summarization for Indonesian news with modified Sentence-BERT embeddings.',
};

export const contacts: Contact[] = [
  { icon: 'mail', label: 'Email', value: 'rfachruradzi@gmail.com', href: 'mailto:rfachruradzi@gmail.com' },
  { icon: 'linkedin', label: 'LinkedIn', value: 'in/fachruradzi', href: 'https://www.linkedin.com/in/fachruradzi/' },
  { icon: 'github', label: 'GitHub', value: 'RifqiFachruradzi', href: 'https://github.com/RifqiFachruradzi' },
  { icon: 'camera', label: 'Instagram', value: '@anas3ra', href: 'https://www.instagram.com/anas3ra' },
];
