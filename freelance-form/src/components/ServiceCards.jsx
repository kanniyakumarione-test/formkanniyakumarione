import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const services = [
  {
    title: "Website Development",
    category: "development",
    description: "Custom high-performance React & Vite web applications engineered for speed.",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    badge: "Popular",
    glowColor: "rgba(59, 130, 246, 0.15)"
  },
  {
    title: "App Development (Android & iOS)",
    category: "development",
    description: "Cross-platform high-ticket mobile applications built using Flutter or React Native.",
    icon: (
      <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Pro",
    glowColor: "rgba(139, 92, 246, 0.15)"
  },
  {
    title: "SEO Optimization",
    category: "marketing",
    description: "Rank #1 on Google and drive organic search traffic to your business.",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    glowColor: "rgba(16, 185, 129, 0.15)"
  },
  {
    title: "Google Business Profile",
    category: "marketing",
    description: "Optimize local search visibility and drive map navigation traffic.",
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    glowColor: "rgba(244, 63, 94, 0.15)"
  },
  {
    title: "Resume Services",
    category: "writing",
    description: "ATS-compliant professionally formatted resumes to land your dream role.",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    glowColor: "rgba(245, 158, 11, 0.15)"
  },
  {
    title: "Social Media Marketing",
    category: "marketing",
    description: "Grow your social presence and scale target customer engagement.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    glowColor: "rgba(168, 85, 247, 0.15)"
  },
  {
    title: "Logo & Branding Design",
    category: "design",
    description: "Distinct visual identities, beautiful logos, and complete brand guidelines.",
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    badge: "Creative",
    glowColor: "rgba(236, 72, 153, 0.15)"
  },
  {
    title: "UI/UX Prototype Design (Figma)",
    category: "design",
    description: "Interactive visual prototypes, layout mockups, and customer workflows.",
    icon: (
      <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" />
      </svg>
    ),
    glowColor: "rgba(217, 70, 239, 0.15)"
  },
  {
    title: "Video Editing & Reels Creation",
    category: "design",
    description: "High-retention Reels, TikToks, and YouTube promos with sound effects.",
    icon: (
      <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    badge: "Trending",
    glowColor: "rgba(244, 63, 94, 0.15)"
  },
  {
    title: "Content Writing",
    category: "writing",
    description: "Persuasive copy, optimized articles, and engaging product stories.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    glowColor: "rgba(20, 184, 166, 0.15)"
  },
  {
    title: "YouTube SEO",
    category: "marketing",
    description: "Maximize video reach with optimized metadata, thumbnails, and growth strategy.",
    icon: (
      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    glowColor: "rgba(239, 68, 68, 0.15)"
  },
  {
    title: "Instagram Growth",
    category: "marketing",
    description: "Organic account expansion, aesthetic planning, and reel strategies.",
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    glowColor: "rgba(249, 115, 22, 0.15)"
  },
  {
    title: "Domain & Business Email Setup",
    category: "development",
    description: "Configure Google Workspace, SPF/DKIM records, and custom email accounts.",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    glowColor: "rgba(16, 185, 129, 0.15)"
  },
  {
    title: "Custom Graphic & Flyer Design",
    category: "design",
    description: "Professional digital posters, brand flyers, and visual marketing assets.",
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    glowColor: "rgba(245, 158, 11, 0.15)"
  },
  {
    title: "E-commerce Store Setup",
    category: "development",
    description: "Launch high-converting stores with WooCommerce or Shopify integrations.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    glowColor: "rgba(6, 182, 212, 0.15)"
  },
  {
    title: "Landing Page Design",
    category: "development",
    description: "Beautiful, lightweight landing pages built to maximize leads and sales.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Hot",
    glowColor: "rgba(99, 102, 241, 0.15)"
  },
  {
    title: "Google Ads / PPC",
    category: "marketing",
    description: "Targeted search campaigns, maximized ROI, and comprehensive analytics reporting.",
    icon: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    glowColor: "rgba(234, 179, 8, 0.15)"
  },
];

const reviews = [
  {
    name: "Aravind K.",
    role: "Local Store Owner",
    text: "KanniyakumariOne built our local business profile and custom website. Our customer walk-ins increased by 40% in just two months!",
  },
  {
    name: "Meera Nair",
    role: "Creative Consultant",
    text: "The branding guidelines and logo identity designs they provided were outstanding. Clean, modern, and aligned perfectly.",
  },
  {
    name: "Sanjay Kumar",
    role: "E-commerce Founder",
    text: "Professional React developers. They completed our web project on-time and set up the entire products catalog database.",
  },
];

const faqs = [
  {
    question: "What is the typical project timeline?",
    answer: "Most custom design and landing page projects are completed in 5-7 business days, while complex web applications with database configuration can take 2-3 weeks.",
  },
  {
    question: "Can we sign a Non-Disclosure Agreement (NDA)?",
    answer: "Yes, absolutely! We prioritize protecting our clients' intellectual property and codebases. We can generate a professional NDA for our engagement.",
  },
  {
    question: "How does the revisions process work?",
    answer: "All our service packages include 3 standard revision rounds. This ensures the delivery aligns precisely with your expectations and branding parameters.",
  },
  {
    question: "What are your payment terms?",
    answer: "Typically, engagements require a 50% advance before project kickoff, and the remaining 50% is settled upon final delivery and code hand-over.",
  },
  {
    question: "Do you provide post-delivery support?",
    answer: "Yes, we provide 30 days of free post-launch support to resolve any technical issues or deploy small fixes as your product goes live.",
  },
];

const categories = [
  { id: "all", label: "All Services" },
  { id: "development", label: "Development" },
  { id: "design", label: "Design & Video" },
  { id: "marketing", label: "Marketing & SEO" },
  { id: "writing", label: "Writing & Business" },
];

export default function ServiceCards({ onSelect }) {
  const [currentReview, setCurrentReview] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Auto-play reviews slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Filter services by search query and category tab
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-6 py-16 sm:py-28 overflow-hidden font-sans">
      
      {/* 🌐 Background Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      {/* 🌌 Huge colorful background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] bg-blue-500/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[15%] w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* 🔥 HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20 animate-fade-in">
          
          {/* Logo container with pulsing orbits */}
          <div className="relative mb-8 group cursor-pointer">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-25 blur-lg group-hover:opacity-60 group-hover:blur-xl transition duration-700"></div>
            <img
              src={logo}
              alt="KanyakumariOne"
              className="relative w-32 h-32 object-contain rounded-full bg-black/60 border border-white/10 p-1.5 floating-effect"
            />
          </div>

          <span className="px-3.5 py-1.5 text-[10px] font-extrabold tracking-widest uppercase text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20 mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            🌟 Professional Development Hub
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter font-outfit text-white leading-none">
            Kanniyakumari<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">One</span>
          </h1>

          <p className="text-slate-400 mt-6 max-w-2xl text-base sm:text-lg leading-relaxed font-medium">
            High-fidelity applications, brand identities, and target campaigns. Choose a service config below to build a dynamic price quotation instantly.
          </p>

          {/* Quick status tracker navigation */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="/tracker"
              className="
                inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] 
                text-xs font-bold text-slate-200 hover:bg-white/[0.08] hover:border-indigo-500/30 hover:text-white
                transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)]
              "
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Track Active Request Status</span>
            </a>
          </div>
        </div>

        {/* 🎛️ SEARCH & CATEGORIES BAR */}
        <div className="mb-14 flex flex-col md:flex-row gap-4 items-center justify-between bg-[#09090b]/40 border border-white/[0.06] p-4 sm:p-5 rounded-[24px] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          
          {/* Categories Tab selector */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition duration-200
                  ${
                    selectedCategory === cat.id
                      ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                      : "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box Input */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="
                pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs w-full outline-none 
                focus:border-indigo-500/50 hover:border-white/10 transition duration-200 font-semibold
              "
            />
          </div>
        </div>

        {/* 🔥 SERVICES GRID */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#09090b]/20 border border-white/[0.05] rounded-[32px] backdrop-blur-xl">
            <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-white font-extrabold font-outfit text-base">No services match your search</h3>
            <p className="text-slate-500 text-xs mt-1">Try tweaking your search keywords or switching filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
            {filteredServices.map((service, index) => (
              <div
                key={index}
                onClick={() => onSelect(service.title)}
                className="
                  group relative p-8 rounded-[28px] cursor-pointer
                  bg-[#09090b]/40 border border-white/[0.06]
                  hover:bg-[#0c0c0e]/80 hover:border-indigo-500/40
                  transition-all duration-500 ease-out backdrop-blur-xl
                  hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(99,102,241,0.25)]
                  overflow-hidden
                "
              >
                {/* Dynamic color-specific radial highlights on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(120px at 50% 0px, ${service.glowColor || "rgba(99,102,241,0.08)"}, transparent)`
                  }}
                ></div>

                {/* Sweeping shimmer light beam on hover */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>

                {/* CARD CONTENT */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    
                    {/* ICON & BADGE */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="
                        p-3.5 bg-white/[0.02] rounded-2xl border border-white/[0.08] 
                        group-hover:scale-110 group-hover:border-indigo-500/30 
                        transition-all duration-300 relative
                      "
                        style={{
                          boxShadow: `0 0 15px ${service.glowColor || "rgba(255,255,255,0.02)"}`
                        }}
                      >
                        {service.icon}
                      </div>
                      {service.badge && (
                        <span className="px-3 py-0.5 text-[9px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {/* TITLE */}
                    <h3 className="text-lg font-black font-outfit text-white group-hover:text-indigo-300 transition-colors duration-300 tracking-tight">
                      {service.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="text-slate-400 text-xs mt-3.5 leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  {/* ACTION TRIGGER */}
                  <div className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-indigo-400 transition-colors duration-300">
                    <span>Build Requirements</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 CLIENT TESTIMONIALS SLIDER */}
        <div className="mt-36 max-w-3xl mx-auto border border-white/[0.06] bg-[#09090b]/40 rounded-[32px] p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
          
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Customer Feedback
            </span>
            <h2 className="text-3xl font-black font-outfit text-white mt-1">
              Client Success Stories
            </h2>
          </div>

          {/* Slide Container */}
          <div className="min-h-[120px] flex flex-col justify-center text-center max-w-xl mx-auto">
            <p className="text-slate-200 italic text-base sm:text-lg leading-relaxed font-medium transition-opacity duration-300">
              "{reviews[currentReview].text}"
            </p>
            <div className="mt-6">
              <p className="text-white font-extrabold font-outfit text-sm">
                {reviews[currentReview].name}
              </p>
              <p className="text-indigo-400 text-xs font-semibold mt-0.5">
                {reviews[currentReview].role}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, rIdx) => (
              <button
                key={rIdx}
                onClick={() => setCurrentReview(rIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  rIdx === currentReview ? "bg-indigo-500 w-6" : "bg-white/10 w-2"
                }`}
                aria-label={`Go to slide ${rIdx + 1}`}
              ></button>
            ))}
          </div>
        </div>

        {/* 🔥 FAQ ACCORDION SECTION */}
        <div className="mt-36 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Onboarding Help
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-outfit text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">
              Clear answers to common questions about our delivery workflow and project terms.
            </p>
          </div>

          <div className="space-y-4 animate-slide-up">
            {faqs.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;

              return (
                <div
                  key={fIdx}
                  className="
                    border border-white/[0.05] bg-[#09090b]/20 rounded-[22px]
                    overflow-hidden backdrop-blur-xl transition-all duration-300
                    hover:border-indigo-500/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                  "
                >
                  <button
                    onClick={() => toggleFaq(fIdx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-extrabold font-outfit text-white hover:text-indigo-400 transition-colors">
                      {faq.question}
                    </span>
                    <span className={`p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-white border-indigo-500/30" : ""}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  <div
                    className={`
                      transition-all duration-350 ease-in-out overflow-hidden
                      ${isOpen ? "max-h-[220px] opacity-100 border-t border-white/[0.03]" : "max-h-0 opacity-0"}
                    `}
                  >
                    <p className="p-6 text-slate-400 text-xs sm:text-sm leading-relaxed bg-[#09090b]/10 font-medium">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Footer info / Contact shortcut */}
        <div className="text-center mt-28 text-xs text-slate-600 font-bold tracking-wide">
          <p>© {new Date().getFullYear()} KanniyakumariOne. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}