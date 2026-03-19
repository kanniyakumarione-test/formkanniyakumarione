import React from "react";
import logo from "../assets/logo.png";

const services = [
  { title: "Website Development", icon: "🌐" },
  { title: "SEO Optimization", icon: "📈" },
  { title: "Google Business Profile", icon: "📍" },
  { title: "Resume Services", icon: "📄" },
  { title: "Social Media Marketing", icon: "📱" },
  { title: "Logo & Branding Design", icon: "🎨" },
  { title: "Content Writing", icon: "✍️" },
  { title: "YouTube SEO", icon: "🎥" },
  { title: "Instagram Growth", icon: "📸" },
  { title: "E-commerce Store Setup", icon: "🛒" },
  { title: "Landing Page Design", icon: "💻" },
  { title: "Google Ads / PPC", icon: "💰" },
];

export default function ServiceCards({ onSelect }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-12">

      {/* 🔥 HERO SECTION */}
      <div className="relative flex flex-col items-center text-center mb-16">

        {/* Glow Background */}
        <div className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-3xl rounded-full top-0"></div>

        <img
          src={logo}
          alt="KanyakumariOne"
          className="w-24 h-24 mb-4 z-10"
        />

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight z-10">
          Kanniyakumari<span className="text-blue-500">One</span>
        </h1>

        <p className="text-gray-400 mt-4 max-w-lg z-10">
          Fill This Form For Any Service You Need.
          No hassle. Just results.
        </p>

      </div>

      {/* 🔥 SERVICES */}
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => onSelect(service.title)}
            className="
              group relative p-6 rounded-2xl cursor-pointer
              bg-[#0f0f0f]
              border border-gray-800
              hover:border-blue-500/30
              transition-all duration-300
              hover:-translate-y-1
            "
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-blue-500/5 blur-xl transition"></div>

            <div className="relative z-10">

              {/* ICON */}
              <div className="text-3xl mb-3">
                {service.icon}
              </div>

              {/* TITLE */}
              <h2 className="text-lg font-medium">
                {service.title}
              </h2>

              {/* SUBTEXT */}
              <p className="text-gray-500 text-sm mt-2">
                Quick request → fast delivery
              </p>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}