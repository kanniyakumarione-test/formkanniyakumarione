import { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Helper to trigger pure CSS/JS confetti
const triggerConfetti = () => {
  const container = document.createElement("div");
  container.className = "fixed inset-0 pointer-events-none z-[100] overflow-hidden";
  document.body.appendChild(container);

  const colors = ["#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b"];

  for (let i = 0; i < 90; i++) {
    const p = document.createElement("div");
    p.className = "absolute rounded-full";
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.left = `${Math.random() * 100}vw`;
    p.style.top = `-20px`;

    const size = Math.random() * 8 + 6;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.opacity = Math.random().toString();

    container.appendChild(p);

    const anim = p.animate([
      { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(105vh) translateX(${(Math.random() - 0.5) * 300}px) rotate(${Math.random() * 1080}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 2500 + 1500,
      easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
    });

    anim.onfinish = () => p.remove();
  }

  setTimeout(() => container.remove(), 5000);
};

export default function ServiceForm({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    budget: "",
    message: "",
    service: service,
  });

  // pricing estimator states
  const [options, setOptions] = useState({
    pages: 1,
    ecommerce: false,
    seo: false,
    concepts: 2,
    guidelines: false,
    competitors: false,
    monthly: false,
    appPlatform: "hybrid", // hybrid, ios, android
    pushNotifications: false,
    userAuth: false,
    screensCount: 5,
    interactiveProto: false,
    videosCount: 3,
    motionGraphics: false,
    emailsCount: 2,
    dnsMigration: false,
    designsCount: 2,
    sourceFiles: false,
    priority: false,
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [useManualBudget, setUseManualBudget] = useState(false);

  // Prevent background scrolling when modal is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Dynamic cost calculation based on selected options
  const getPricingEstimate = () => {
    let min = 5000;
    let max = 7000;
    let desc = "";

    const s = String(service || "").toLowerCase();
    
    if (s.includes("website") || s.includes("landing")) {
      min = 6000;
      max = 8000;
      min += (options.pages - 1) * 1500;
      max += (options.pages - 1) * 2000;
      desc = `${options.pages} Page${options.pages > 1 ? "s" : ""}`;
      
      if (options.ecommerce) {
        min += 7000;
        max += 10000;
        desc += " + E-commerce";
      }
      if (options.seo) {
        min += 2000;
        max += 3500;
        desc += " + SEO";
      }
    } 
    else if (s.includes("app")) {
      if (options.appPlatform === "ios" || options.appPlatform === "android") {
        min = 25000;
        max = 35000;
        desc = `${options.appPlatform.toUpperCase()} App`;
      } else {
        min = 40000;
        max = 55000;
        desc = "Hybrid App";
      }
      if (options.pushNotifications) {
        min += 4000;
        max += 6000;
        desc += " + Notifications";
      }
      if (options.userAuth) {
        min += 8000;
        max += 12000;
        desc += " + Users/DB";
      }
    } 
    else if (s.includes("logo") || s.includes("brand")) {
      min = 3000;
      max = 4500;
      min += (options.concepts - 2) * 1000;
      max += (options.concepts - 2) * 1500;
      desc = `${options.concepts} Logo Concepts`;

      if (options.guidelines) {
        min += 2000;
        max += 3000;
        desc += " + Brand Guide";
      }
    } 
    else if (s.includes("ui/ux") || s.includes("figma") || s.includes("prototype")) {
      min = 4000;
      max = 6000;
      min += (options.screensCount - 1) * 1000;
      max += (options.screensCount - 1) * 1500;
      desc = `${options.screensCount} Figma Screens`;
      if (options.interactiveProto) {
        min += 2000;
        max += 3000;
        desc += " + Prototype";
      }
    } 
    else if (s.includes("video") || s.includes("reel")) {
      min = options.videosCount * 1200;
      max = options.videosCount * 2000;
      desc = `${options.videosCount} Edited Videos`;
      if (options.motionGraphics) {
        min += 2000;
        max += 3500;
        desc += " + Motion FX";
      }
    } 
    else if (s.includes("email") || s.includes("workspace") || s.includes("domain")) {
      min = 1500;
      max = 2500;
      min += (options.emailsCount - 1) * 400;
      max += (options.emailsCount - 1) * 600;
      desc = `${options.emailsCount} Workspace Emails`;
      if (options.dnsMigration) {
        min += 1000;
        max += 1500;
        desc += " + DNS Configuration";
      }
    } 
    else if (s.includes("graphic") || s.includes("flyer") || s.includes("poster")) {
      min = options.designsCount * 800;
      max = options.designsCount * 1500;
      desc = `${options.designsCount} Graphic Layouts`;
      if (options.sourceFiles) {
        min += 1000;
        max += 1500;
        desc += " + Source Files";
      }
    } 
    else if (s.includes("seo") || s.includes("youtube")) {
      min = 4000;
      max = 6000;
      if (options.competitors) {
        min += 1500;
        max += 2500;
        desc = "Competitor Audit";
      }
      if (options.monthly) {
        min += 3000;
        max += 4500;
        desc += (desc ? " + " : "") + "Monthly Maintenance";
      }
    } 
    else {
      min = 4000;
      max = 5500;
      if (options.priority) {
        min += 2000;
        max += 3000;
        desc = "Priority Delivery";
      }
    }

    return { min, max, desc };
  };

  const estimate = getPricingEstimate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOptionChange = (field, value) => {
    setOptions((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location is not supported on this device");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((current) => ({
          ...current,
          location: `Lat ${latitude.toFixed(6)}, Lng ${longitude.toFixed(6)}`,
        }));
        toast.success("Location fetched successfully");
        setLocating(false);
      },
      () => {
        toast.error("Could not retrieve current location");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const configuredText = useManualBudget
      ? `[Manual Budget Choice]\nTarget Price: ${formData.budget || "Not Specified"}\nClient Note: ${formData.message || "None"}`
      : `[Estimator Choice]\nConfig: ${estimate.desc || "Standard Options"}\nPrice Bracket: ₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}\nClient Note: ${formData.message || "None"}`;

    const finalPayload = {
      ...formData,
      budget: useManualBudget ? formData.budget : `₹${estimate.min.toLocaleString()} - ₹${estimate.max.toLocaleString()}`,
      message: configuredText,
    };

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      triggerConfetti();
      setShowCelebration(true);
    } catch (err) {
      toast.error("Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const phone = formData.phone.replace(/\D/g, "").replace(/^91/, "");
    const message = `Hi, I just submitted a request for ${formData.service}. Let's discuss details!`;
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    onClose();
  };

  const s = String(service || "").toLowerCase();
  const isWebService = s.includes("website") || s.includes("landing");
  const isAppService = s.includes("app");
  const isLogoService = s.includes("logo") || s.includes("brand");
  const isUIUXService = s.includes("ui/ux") || s.includes("figma") || s.includes("prototype");
  const isVideoService = s.includes("video") || s.includes("reel");
  const isEmailService = s.includes("email") || s.includes("workspace") || s.includes("domain");
  const isGraphicService = s.includes("graphic") || s.includes("flyer") || s.includes("poster");
  const isSEOService = s.includes("seo");

  return (
    <div className="fixed inset-0 bg-[#030303]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 z-50 animate-fade-in overflow-hidden">
      
      {/* Backdrop trigger */}
      {!showCelebration && <div className="absolute inset-0" onClick={onClose}></div>}

      {/* MODAL WRAPPER */}
      <div className="
        w-full max-w-4xl bg-[#09090b]/98 border border-white/[0.08]
        rounded-[32px] text-white shadow-[0_0_80px_-15px_rgba(99,102,241,0.25)]
        relative z-10 backdrop-blur-2xl overflow-hidden animate-slide-up
        max-h-[92vh] flex flex-col
      ">
        {/* Decorative ambient spots */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/[0.06] shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Interactive Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-outfit text-white leading-tight">
              {service}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition duration-200"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE INNER BODY */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-none">
          {showCelebration ? (
            <div className="text-center py-12 animate-fade-in flex flex-col items-center max-w-md mx-auto">
              <div className="
                w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full
                flex items-center justify-center text-emerald-400 mb-6
                shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-up-effect
              ">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold font-outfit text-white">
                Request Registered!
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Your service requirements have been stored safely in our system. Let's start the onboarding chat on WhatsApp.
              </p>

              <div className="mt-8 space-y-3.5 w-full">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="
                    w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold 
                    text-sm transition duration-200 flex items-center justify-center gap-2
                    shadow-[0_4px_20px_rgba(16,185,129,0.3)]
                  "
                >
                  <span>Launch WhatsApp Onboarding</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <a
                  href={`/tracker?phone=${encodeURIComponent(formData.phone)}`}
                  className="
                    w-full py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] 
                    text-indigo-300 hover:text-indigo-200 text-xs font-bold transition duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Track Live Project Status</span>
                </a>

                <button
                  onClick={onClose}
                  className="
                    w-full py-2.5 text-slate-500 hover:text-slate-350 text-xs font-bold transition duration-200
                  "
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: ESTIMATOR PANEL (40% width) */}
              <div className="md:col-span-5 space-y-5">
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
                  <div className="flex justify-between items-center border-b border-white/[0.06] pb-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Estimator Configurations
                    </span>
                    <span className="text-[9px] uppercase font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Calculated
                    </span>
                  </div>

                  {isWebService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Number of Pages</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("pages", Math.max(1, options.pages - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.pages}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("pages", options.pages + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">E-commerce Features</label>
                        <input
                          type="checkbox"
                          checked={options.ecommerce}
                          onChange={(e) => handleOptionChange("ecommerce", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">SEO Package</label>
                        <input
                          type="checkbox"
                          checked={options.seo}
                          onChange={(e) => handleOptionChange("seo", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isAppService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Target Platform</label>
                        <select
                          value={options.appPlatform}
                          onChange={(e) => handleOptionChange("appPlatform", e.target.value)}
                          className="bg-[#111] border border-white/[0.08] p-1.5 rounded-lg text-xs outline-none text-white font-semibold"
                        >
                          <option value="hybrid">Both (iOS + Android)</option>
                          <option value="ios">iOS Only</option>
                          <option value="android">Android Only</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Push Notifications</label>
                        <input
                          type="checkbox"
                          checked={options.pushNotifications}
                          onChange={(e) => handleOptionChange("pushNotifications", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Users DB & Auth</label>
                        <input
                          type="checkbox"
                          checked={options.userAuth}
                          onChange={(e) => handleOptionChange("userAuth", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isLogoService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Logo Concepts</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("concepts", Math.max(1, options.concepts - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.concepts}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("concepts", options.concepts + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Brand Identity Guidelines</label>
                        <input
                          type="checkbox"
                          checked={options.guidelines}
                          onChange={(e) => handleOptionChange("guidelines", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isUIUXService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Number of Screens</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("screensCount", Math.max(1, options.screensCount - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.screensCount}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("screensCount", options.screensCount + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Interactive Prototype</label>
                        <input
                          type="checkbox"
                          checked={options.interactiveProto}
                          onChange={(e) => handleOptionChange("interactiveProto", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isVideoService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Number of Videos</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("videosCount", Math.max(1, options.videosCount - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.videosCount}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("videosCount", options.videosCount + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Motion Graphics / FX</label>
                        <input
                          type="checkbox"
                          checked={options.motionGraphics}
                          onChange={(e) => handleOptionChange("motionGraphics", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isEmailService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Email Accounts</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("emailsCount", Math.max(1, options.emailsCount - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.emailsCount}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("emailsCount", options.emailsCount + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">DNS MX setup</label>
                        <input
                          type="checkbox"
                          checked={options.dnsMigration}
                          onChange={(e) => handleOptionChange("dnsMigration", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isGraphicService && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-slate-300 font-semibold">Graphic Concepts</label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOptionChange("designsCount", Math.max(1, options.designsCount - 1))}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{options.designsCount}</span>
                          <button
                            type="button"
                            onClick={() => handleOptionChange("designsCount", options.designsCount + 1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Deliver PSD/Figma</label>
                        <input
                          type="checkbox"
                          checked={options.sourceFiles}
                          onChange={(e) => handleOptionChange("sourceFiles", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {isSEOService && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-slate-300 font-semibold">Competitor Audit</label>
                        <input
                          type="checkbox"
                          checked={options.competitors}
                          onChange={(e) => handleOptionChange("competitors", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <label className="text-xs text-slate-300 font-semibold">Monthly Maintenance</label>
                        <input
                          type="checkbox"
                          checked={options.monthly}
                          onChange={(e) => handleOptionChange("monthly", e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  )}

                  {!isWebService && !isAppService && !isLogoService && !isUIUXService && !isVideoService && !isEmailService && !isGraphicService && !isSEOService && (
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-semibold">Priority Delivery (48h)</label>
                      <input
                        type="checkbox"
                        checked={options.priority}
                        onChange={(e) => handleOptionChange("priority", e.target.checked)}
                        className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                      />
                    </div>
                  )}

                  {/* ESTIMATOR RESULTS WIDGET */}
                  <div className="pt-4 border-t border-white/[0.08] mt-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        {useManualBudget ? "Target Price" : "Estimated Cost"}
                      </span>
                      {!useManualBudget ? (
                        <span className="text-base font-black font-outfit text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse">
                          ₹{estimate.min.toLocaleString()} - ₹{estimate.max.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-black bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                          Manual Target
                        </span>
                      )}
                    </div>

                    {useManualBudget && (
                      <div className="space-y-1.5 pt-1.5 animate-fade-in">
                        <label className="text-[9px] font-bold text-slate-400 tracking-wider uppercase ml-1">Manual Budget Amount</label>
                        <input
                          name="budget"
                          placeholder="e.g. ₹10,000 or $150"
                          value={formData.budget}
                          onChange={handleChange}
                          className="input-ultra"
                          required={useManualBudget}
                        />
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setUseManualBudget(!useManualBudget);
                          if (!useManualBudget) {
                            setFormData(prev => ({ ...prev, budget: "" }));
                          }
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline transition duration-200"
                      >
                        {useManualBudget ? "← Use Auto-Estimate" : "Enter Manual Budget instead"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: FORM FIELDS (70% width) */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Full Name</label>
                    <input
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-ultra"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Phone Number</label>
                    <input
                      name="phone"
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-ultra"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Email (Optional)</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-ultra"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 ml-1">Location</label>
                    <div className="flex gap-2">
                      <input
                        name="location"
                        placeholder="City, State"
                        value={formData.location}
                        onChange={handleChange}
                        className="input-ultra flex-1"
                      />
                      <button
                        type="button"
                        onClick={fillCurrentLocation}
                        disabled={locating}
                        className="
                          px-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-slate-200 
                          hover:bg-white/[0.08] hover:border-indigo-500/20 transition duration-200 
                          disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap
                        "
                      >
                        <svg className={`w-3.5 h-3.5 ${locating ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{locating ? "GPS Sync" : "GPS"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 ml-1">Project Details / Message</label>
                  <textarea
                    name="message"
                    placeholder="Describe your design parameters, target launch dates, features..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="3.5"
                    className="input-ultra resize-none"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-full"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Registering Request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Lock Estimate & Submit</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>

              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
