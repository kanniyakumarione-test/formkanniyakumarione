import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

const services = [
  {
    title: "Website Development",
    description: "Custom high-performance React & Vite web applications engineered for speed.",
    icon: (
      <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    badge: "Popular"
  },
  {
    title: "SEO Optimization",
    description: "Rank #1 on Google and drive organic search traffic to your business.",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Google Business Profile",
    description: "Optimize local search visibility and drive map navigation traffic.",
    icon: (
      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Resume Services",
    description: "ATS-compliant professionally formatted resumes to land your dream role.",
    icon: (
      <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: "Social Media Marketing",
    description: "Grow your social presence and scale target customer engagement.",
    icon: (
      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Logo & Branding Design",
    description: "Distinct visual identities, beautiful logos, and complete brand guidelines.",
    icon: (
      <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    badge: "Creative"
  },
  {
    title: "Content Writing",
    description: "Persuasive copy, optimized articles, and engaging product stories.",
    icon: (
      <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    )
  },
  {
    title: "YouTube SEO",
    description: "Maximize video reach with optimized metadata, thumbnails, and growth strategy.",
    icon: (
      <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Instagram Growth",
    description: "Organic account expansion, aesthetic planning, and reel strategies.",
    icon: (
      <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "E-commerce Store Setup",
    description: "Launch high-converting stores with WooCommerce or Shopify integrations.",
    icon: (
      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    )
  },
  {
    title: "Landing Page Design",
    description: "Beautiful, lightweight landing pages built to maximize leads and sales.",
    icon: (
      <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    badge: "Hot"
  },
  {
    title: "Google Ads / PPC",
    description: "Targeted search campaigns, maximized ROI, and comprehensive analytics reporting.",
    icon: (
      <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
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

export default function ServiceCards({ onSelect }) {
  const [currentReview, setCurrentReview] = useState(0);

  // Auto-play reviews slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-6 py-16 sm:py-24 overflow-hidden font-sans">
      
      {/* 🌌 Background ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* 🔥 HERO SECTION */}
        <div className="flex flex-col items-center text-center mb-20 animate-fade-in">
          
          {/* Logo container with pulse/glow */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-md group-hover:opacity-40 transition duration-1000"></div>
            <img
              src={logo}
              alt="KanyakumariOne"
              className="relative w-28 h-28 object-contain rounded-full bg-black/40 border border-white/10 p-1 floating-effect"
            />
          </div>

          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20 mb-4">
            Digital Transformation
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-outfit text-white leading-tight">
            Kanniyakumari<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">One</span>
          </h1>

          <p className="text-slate-400 mt-6 max-w-xl text-base sm:text-lg leading-relaxed">
            Select a service below to request a tailored quote. We handle the technical heavy lifting while you focus on scaling your business.
          </p>

          {/* Client Portal Status Tracker Link */}
          <div className="mt-8 flex gap-4">
            <a
              href="/tracker"
              className="
                inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] 
                text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:border-slate-600 transition duration-200
              "
            >
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Track Request Status</span>
            </a>
          </div>
        </div>

        {/* 🔥 SERVICES GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => onSelect(service.title)}
              className="
                group relative p-8 rounded-3xl cursor-pointer
                bg-white/[0.01] border border-white/[0.05]
                hover:bg-white/[0.03] hover:border-indigo-500/30
                transition-all duration-300 ease-out
                hover:-translate-y-1.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]
              "
            >
              {/* Radial gradient hover highlight */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 transition-opacity duration-300 pointer-events-none"></div>

              {/* CARD CONTENT */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  
                  {/* ICON & BADGE */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.08] group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-300">
                      {service.icon}
                    </div>
                    {service.badge && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-bold font-outfit text-white group-hover:text-blue-400 transition-colors duration-250">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* ACTION TRIGGER */}
                <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-indigo-400 transition-colors duration-250">
                  <span>Request Service</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🔥 CLIENT TESTIMONIALS SLIDER */}
        <div className="mt-32 max-w-2xl mx-auto border border-white/[0.05] bg-white/[0.01] rounded-3xl p-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
          
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Testimonials
            </span>
            <h2 className="text-2xl font-bold font-outfit text-white mt-1">
              Client Success Stories
            </h2>
          </div>

          {/* Slide Container */}
          <div className="min-h-[120px] flex flex-col justify-center text-center">
            <p className="text-slate-300 italic text-base leading-relaxed transition-opacity duration-300">
              "{reviews[currentReview].text}"
            </p>
            <div className="mt-6">
              <p className="text-white font-bold font-outfit text-sm">
                {reviews[currentReview].name}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                {reviews[currentReview].role}
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-6">
            {reviews.map((_, rIdx) => (
              <button
                key={rIdx}
                onClick={() => setCurrentReview(rIdx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  rIdx === currentReview ? "bg-indigo-500 w-5" : "bg-white/10"
                }`}
                aria-label={`Go to slide ${rIdx + 1}`}
              ></button>
            ))}
          </div>
        </div>
        
        {/* Footer info / Contact shortcut */}
        <div className="text-center mt-20 text-xs text-slate-600 font-medium">
          <p>© {new Date().getFullYear()} KanniyakumariOne. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}