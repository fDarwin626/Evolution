// index.js
export const servicesData = [
  {
    title: "FullStack Development",
    description:
      "Your business deserves a fast, secure, and future-proof digital foundation. I develop custom web apps with clean architecture, optimized databases, and seamless integrations—ensuring reliability at every layer.",
    items: [
      {
        title: "Backend Engineering",
        description: "(REST/GraphQL APIs, Microservices, Auth Systems)",
      },
      {
        title: "Frontend Excellence",
        description: "(React, Vue, TypeScript, Interactive UI/UX)",
      },
      {
        title: "Database Design",
        description: "(SQL/NoSQL Optimization, Scalable Structures)",
      },
    ],
  },
  {
    title: "Security & Optimization",
    description:
      "Slow or hacked apps destroy trust. I harden security (XSS/SQLI protection, OAuth) and optimize bottlenecks so your app stays fast, safe, and scalable as you grow.",
    items: [
      {
        title: "Code Audits",
        description: "(Refactoring, Tech Debt Cleanup)",
      },
      {
        title: "Tech Stack",
        description: "(SSR, Metadata, Structured Data)",
      },
    ],
  },
  {
    title: "Web & Mobile Apps",
    description:
      "A clunky interface can sink even the best ideas. I craft responsive, pixel-perfect web and mobile apps (React Native/Flutter) that users love—bridging design and functionality seamlessly.",
    items: [
      {
        title: "Cross-Platform Apps",
        description: "(Single codebase for iOS/Android/Web)",
      },
      {
        title: "PWAs",
        description: "(Offline mode, Push Notifications)",
      },
      {
        title: "E-Commerce",
        description: "(Checkout flows, Payment Gateways, Inventory APIs)",
      },
    ],
  },
];

export const projects = [
  {
    id: 1,
    name: "MetaJoyStick",
    description:
      "A Zentry-inspired web experience built around fluid animation and intentional motion. Every transition serves the user journey — not just decoration. Demonstrates my fullstack range: tight frontend craft backed by solid engineering.",
    href: "https://metajoystick.onrender.com/",
    image: "/assets/projects/project2.png",
    bgImage: "/assets/backgrounds/poster.jpg",
    frameworks: [
      { id: 1, name: "Vite" },
      { id: 2, name: "React" },
      { id: 3, name: "GSAP" },
      { id: 4, name: "Tailwind CSS" },
    ],
  },
  {
    id: 2,
    name: "ShopAphere - E-commerce",
    description:
      "A full-featured Django e-commerce store with admin panel, Paystack payment integration, product variations, category slugs, and MongoDB for flexible data storage.",
    href: "",
    image: "/assets/projects/project3.png",
    bgImage: "/assets/backgrounds/blanket.jpg",
    frameworks: [
      { id: 1, name: "Python" },
      { id: 2, name: "Django" },
      { id: 3, name: "MongoDB" },
    ],
  },
  {
    id: 3,
    name: "LynqApp - Chat App",
    description:
      "Production-ready mobile chat app built on Flutter + Go. Features real-time messaging, group chats, status updates, voice & video calls via Agora, and smart data caching with Riverpod — engineered for scale, not just demos.",
    href: "",
    image: "/assets/projects/project4.png",
    bgImage: "/assets/backgrounds/table.jpg",
    frameworks: [
      { id: 1, name: "Flutter" },
      { id: 2, name: "Golang" },
      { id: 3, name: "Riverpod" },
    ],
  },
  {
    id: 4,
    name: "Lyvo - AI Voice Platform",
    description:
      "Enterprise-grade AI SaaS built security-first. Text-to-speech, voice cloning, speech-to-text (Whisper AI), audiobook generation, and GPT-4/Gemini agents — all under a multi-layer security architecture with SQL injection detection, device fingerprinting, shadow banning, and automated threat scoring.\n\nPayment processing via Flutterwave with fraud detection and idempotent transactions. A sophisticated agent-sharing system handles password-protected guest access, multi-tenant credit attribution, and usage analytics. Six months of real problem-solving — not a tutorial clone.",
    href: "https://lyvo-ai.vercel.app/",
    image: "/assets/projects/lyvo.png",
    bgImage: "/assets/backgrounds/interior.jpg",
    frameworks: [
      { id: 1, name: "Next.js" },
      { id: 2, name: "Python" },
      { id: 3, name: "FastAPI" },
      { id: 4, name: "PostgreSQL" },
      { id: 5, name: "TypeScript" },
      { id: 6, name: "XTTS" },
      { id: 7, name: "Whisper AI" },
      { id: 8, name: "GPT-4" },
      { id: 9, name: "SQLAlchemy" },
      { id: 10, name: "Supabase" },
      { id: 11, name: "Groq" },
    ],
  },
];

export const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/in/fuoseigha-darwin-b29168326/" },
  { name: "GitHub", href: "https://github.com/fDarwin626" },
  { name: "Twitter", href: "https://x.com/fuoseigha" },
];