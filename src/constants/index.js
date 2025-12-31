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
      "A clunky interface can sink even the best ideas. I craft responsive, pixel perfect web and mobile apps (React Native/Flutter) that users love—bridging design and functionality seamlessly.",
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
      "Inspired by Zentry MetaJoyStick is a modern web App that is build with optimization and fluidity in mind every animation is not just a distraction but there to aid the user in a journey onlike any other blends seemelessly with users interaction and scroll focused on my keen knowledge on not just as a backend developer but as a frontend developer also hence fullstack.",
    href: "https://metajoystick.onrender.com/",
    image: "/assets/projects/project2.png",
    bgImage: "/assets/backgrounds/poster.jpg",
    frameworks: [
      { id: 1, name: "Vite" },
      { id: 2, name: "React" },
      { id: 3, name: "Gsap" },
      { id: 4, name: "Tailwind Css" },
    ],
  },

  {
    id: 2,
    name: "ShopAphere - E-commerce",
    description:
      "An online e-commerce store, built with python and Django, mongoDb features admin panel, payment integration using paystack product variation category slugs",
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
    name: "LynqApp - Chat app",
    description:
      "Inspired by whatsapp and facebook Lynq_app is a mobile chat built with flutter and Dart  Golang as backend/ApI server faster and more performance efficient then python on task like this, is a compiler language and compiles to a navive binary code, Firebase for storage, authentication and cloudinary for storing photos, video and voice notes this app isnt just another project its a full production ready app that heightlights complex state management with riverpod good understanding of database query and storage to fetch and store data in a clean and orderly manner, understanding real world production ready requirement like caching of data when users loads up the app so they dont call the backend server all the time. features include seemless message recieve and reply, group creation, status updates and delete, voice and video call integeration with agora and Many  more.",
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
    "A production-grade SaaS platform that demonstrates enterprise level  architecture and security implementation. Lyvo is a comprehensive AI voice ecosystem featuring Text-to-Speech, Speech-to-Text with Whisper AI, real time voice cloning, audiobook generation, and intelligent AI agents powered by GPT-4/Gemini. What sets this apart is the thought process behind every decision: I implemented multi-layer security not as an afterthought, but as the foundation—including SQL injection detection, path traversal blocking, shadow banning, device fingerprinting, and automated threat scoring systems that rival enterprise solutions. The platform handles real payment processing via Flutterwave with idempotent transaction handling, dynamic pricing models, and fraud detection. I built a sophisticated agent-sharing system with two authentication modes (password-protected guest access and account-required sharing), complete with usage analytics, ban management, and credit deduction on owners rather than shared users—solving the complex problem of resource attribution in multi-tenant environments. The architecture showcases full-stack mastery: FastAPI/Python with background task processing, SQLAlchemy with cascade relationships, JWT authentication with token invalidation, APScheduler for automated cleanup, and a TypeScript frontend with device fingerprinting. I chose security first architecture, not just CRUD applications. This project represents 6 months of problem solving, from implementing smart audiobook chunking to prevent database timeouts, to creating a unified chat room authentication system that handles three access types seamlessly. Every feature from the bug tracking system to the AI-powered support chatbot was built with scalability, security, and user experience in mind.",
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
    {id: 10, name: "Superbase"},
    {id: 11, name: "Groq"}
  ],
}
];
export const socials = [
{ name: "LinkedIn", href: "https://www.linkedin.com/in/fuoseigha-darwin-b29168326/" },
  { name: "GitHub", href: "https://github.com/fDarwin626" },
  {name: 'Twitter', href: "https://x.com/fuoseigha"},
];
