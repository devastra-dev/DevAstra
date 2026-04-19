export interface Product {
  id: string;
  title: string;
  description: string;
  tagline: string;
  stackLabel: string;

  priceInINR: number;
  originalPrice?: number; // 🔥 discount support
  discountPercent?: number;

  isFree?: boolean; // 🔥 FREE vs PAID system

  downloadUrl: string;

  highlights: string[];

  // 🔥 MEDIA
  images: string[];
  demoVideo?: string;

  // 🔥 DETAILS
  features: string[];

  // 🔥 OPTIONAL
  badge?: string;
  isFeatured?: boolean;

  // 🔥 FUTURE (no break)
  offerEndsAt?: string;
}

export const products: Product[] = [
  // =========================
  // 🧲 FREE PRODUCT (FUNNEL)
  // =========================
  {
    id: "free-ui-kit",
    title: "Free 3d-flip-card-animation Starter Kit",
    description:
      "A high-performance 3D UI component with smooth animations and scalable structure, designed for modern web applications.",

    tagline: "Where Design Meets Interaction.",
    stackLabel: "Si-Fi UI Core",

    priceInINR: 0,
    isFree: true, // 🔥 IMPORTANT

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1pwjAMtzktonnxqMVMomO9s8t0kSZk5_N",

    highlights: ["Free", "Starter UI", "Reusable"],

    images: [
      "/products/free-1.png",
      "/products/free-2.png"
    ],

    features: [
      "Cinematic 3D Flip Interactions",
      "Fluid Micro-Animations",
      "Ultra-Modern Glass UI Design",
      "Seamless Cross-Device Experience",
      "Optimized for High Performance"
    ],

    badge: "FREE"
  },

// ========================= NO : 2 =========================

  {
    id: "free-ui-kit-2",
    title: "Free 3d-flip-card-animation Starter Kit",
    description:
      "Clean and modern UI starter kit to kickstart your projects.",

    tagline: "Start building instantly",
    stackLabel: "Next.js • Tailwind",

    priceInINR: 0,
    isFree: true, // 🔥 IMPORTANT

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1pwjAMtzktonnxqMVMomO9s8t0kSZk5_N",

    highlights: ["Free", "Starter UI", "Reusable"],

    images: [
      "/products/free-1.png",
      "/products/free-2.png"
    ],

    features: [
      "Clean UI components",
      "Responsive design",
      "Easy to customize"
    ],

    badge: "FREE"
  }, 

  // =============================================================================================================================
  // 💰 PREMIUM
  // ==============================================================================================================================
  {
    id: "futuristic-ai-voice-interface-ui-kit",
    title: "Futuristic AI Voice Interface UI Kit",
    description:
      "Production-ready UI kit for creating futuristic AI voice interfaces. Includes modern design elements and seamless integration.",

    tagline: "Beyond Intelligence. Beyond Reality.",
    stackLabel: "Quantum Stack",

    priceInINR: 19, // 🔥 FIX (24 was unrealistic)
    originalPrice: 299,
    discountPercent: 94, // 🔥 AUTO CALCULATED

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1hK9Kt6RF32YzaZ1PdPGjhv9SGVhEpYTQ",

    highlights: [
      "Auth + billing",
      "Modern UI",
      "Email templates"
    ],

    images: [
      "/products/voice-1.png",
      "/products/voice-2.png",
      "/products/voice-3.png"
    ],

    demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    features: [
      "Ultra-Fast AI Powered Interface",
      "Advanced Secure Authentication",
      "Instant Smart Payment System",
      "Intelligent Admin Dashboard",
      "Future-Proof Scalable System"
    ],  

    badge: "Best Seller",
    isFeatured: true,

    offerEndsAt: "2026-06-01"
  },
// ========================= NO : 2 =========================
  {
    id: "interactive-periodic-table-ui-kit",
    title: "Interactive Periodic Table UI",
    description:
      "A futuristic interactive periodic table with fluid animations and rich data visualization, designed for next-gen learning experiences.",

    tagline: "Chemistry Meets Innovation",
    stackLabel: "Interactive Science UI",

    priceInINR: 9,
    originalPrice: 99,
    discountPercent: 91,

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1RY0Gd3UAah0yJjBPnHOzh93UULs6t7mU",

    highlights: [
      "Real-time element interaction",
      "Fluid hover & transition effects",
      "Visually rich modern interface"
    ],

    images: [
      "/products/periodic1.png",
      "/products/periodic2.png",
      "/products/periodic3.png"
    ],

    demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    features: [
      "Dynamic element interaction system",
      "Cinematic micro-animations",
      "Rich data-driven element display",
      "Seamless cross-device experience",
      "High-performance rendering engine"
    ],

    badge: "Popular",
    isFeatured: true
  },
// ========================= NO : 3 =========================
  {
    id: "luxury-ai-marketplace-build",
    title: "Luxury AI Landing Bundle",
    description:
      "An elite set of conversion-optimized landing page templates engineered for AI products, SaaS platforms, and high-growth startups.",


    tagline: "Design to Convert. Built to Scale.",
    stackLabel: "Conversion System • Premium UI",

    priceInINR: 499,
    originalPrice: 999,
    discountPercent: 50,

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1UyYSR302bLoZZEhyMdLUcMxeb-LBsbhX",

    highlights: [
      "Conversion-driven UI layouts",
      "Premium modern design language",
      "Performance & SEO optimized"
    ],

    images: [
      "/products/landing-1.png",
      "/products/landing-2.png",
      "/products/landing-3.png"
    ],

    demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    features: [
      "High-conversion landing page designs",
      "SEO-optimized structure",
      "Fully responsive across devices",
      "Blazing fast performance",
      "Easy customization & scalability"
    ],

    badge: "New"
  },
// ========================= NO : 3 =========================
  {
    id: "premium-ai-marketplace-ui",
    title: "AI Marketplace System",
    description:
      "A next-generation marketplace UI crafted for AI products, digital assets, and smart services, built to deliver a seamless and high-converting user experience.",

    tagline: "Powering the Next Era of Digital Commerce.",
    stackLabel: "Autonomous Commerce Engine",

    priceInINR: 699,
    originalPrice: 1199,
    discountPercent: 42,

    downloadUrl:
      "https://drive.google.com/uc?export=download&id=1lIOKnHx1es5QqvEiQ84VZ9BsubPeR2pZ",

    highlights: [
      "Next-gen AI marketplace design",
      "Seamless product discovery experience",
      "Conversion-driven UI system"
    ],

    images: [
      "/products/Nexus-1.png",
      "/products/Nexus-2.png",
      "/products/Nexus-3.png"
    ],

    demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

    features: [
      "Advanced AI product marketplace layout",
      "Smart product showcase & browsing",
      "Fully responsive & mobile optimized",
      "Fast and optimized performance",
      "Flexible and scalable architecture"
    ],

    badge: "New"
  },

// ========================= NO : 4 =========================

  {
  id: "freelancer-os-pro",

  title: "Freelancer OS — Premium Client, Project & Invoice System",

  description:
    "A production-ready freelancer operating system designed to manage clients, projects, and invoicing workflows in a single, high-performance environment. Built for serious freelancers and agencies who want a scalable, modern system instead of fragmented tools.",

  tagline: "Run Your Freelance Business Like a System, Not Chaos.",

  stackLabel: "Full-Stack Freelancer SaaS System",

  priceInINR: 2499,
  originalPrice: 5999,
  discountPercent: 58,

  downloadUrl:
    "https://drive.google.com/uc?export=download&id=1EjC8xm9WylCtDEK6BCoBc0sN-qxp4GxU",

  highlights: [
    "Complete freelancer operating system (not just UI)",
    "Client, project & invoice workflow automation",
    "Real SaaS architecture with Supabase backend",
    "High-end futuristic UI with premium UX",
    "Built for scalability and real-world usage"
  ],

  images: [
    "/products/Invoice-1.png",
    "/products/Invoice-2.png",
    "/products/Invoice-3.png"
  ],

  demoVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ",

  features: [
    "Advanced client management with persistent database (Supabase)",
    "Project tracking system with real-time status updates",
    "Invoice generation with item-based billing logic",
    "User authentication with isolated data per account",
    "Dashboard analytics for earnings, payments & performance",
    "Fully responsive layout optimized for all devices",
    "Modern glassmorphism + neon UI design system",
    "Scalable architecture suitable for SaaS expansion",
    "Clean modular code structure (Next.js + hooks system)",
    "Ready-to-deploy production-grade frontend + backend integration",
    "Everything you need to run a real freelance business, not just a UI kit",
    "Every process is mentioned in the product documentation, making it easy to understand and customize for your specific needs"
  ],

  badge: "Pro"
  }

];

