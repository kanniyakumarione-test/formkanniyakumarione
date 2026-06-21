import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

export default function RequestTracker() {
  const [phone, setPhone] = useState("");
  const [leads, setLeads] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const phoneParam = params.get("phone");
    if (phoneParam) {
      setPhone(phoneParam);
      const autoTrack = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/track?phone=${encodeURIComponent(
              phoneParam
            )}&t=${Date.now()}`
          );
          const result = await res.json();
          if (result.success) {
            setLeads(result.data || []);
            setSearched(true);
          }
        } catch {
          // ignore silent query failure
        } finally {
          setLoading(false);
        }
      };
      autoTrack();
    }
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/track?phone=${encodeURIComponent(
          phone
        )}&t=${Date.now()}`
      );
      const result = await res.json();

      if (result.success) {
        setLeads(result.data || []);
        setSearched(true);
        if ((result.data || []).length === 0) {
          toast.info("No matching requests found for this phone number.");
        } else {
          toast.success("Matching requests found!");
        }
      } else {
        toast.error("Failed to query status.");
      }
    } catch {
      toast.error("Error communicating with server.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "closed") return 4; // Completed
    if (s === "contacted") return 2; // In Discussion
    if (s === "in_progress" || s === "in progress") return 3; // In Progress
    return 1; // Received / Pending
  };

  const steps = [
    { label: "Received", desc: "Form successfully submitted" },
    { label: "Discussion", desc: "Connecting via WhatsApp/Call" },
    { label: "In Progress", desc: "Development or design stage" },
    { label: "Completed", desc: "Delivered and hand-over done" },
  ];

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-6 py-12 sm:py-20 overflow-hidden font-sans">
      
      {/* 🌐 Background Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>

      {/* 🌌 Background ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in">
        
        {/* 🧭 Top Navigation Row */}
        <div className="flex justify-between items-center mb-12 pb-5 border-b border-white/[0.06] shrink-0">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition duration-200 group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Portal Home</span>
          </a>
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">
            Client Portal
          </span>
        </div>

        {/* 🚀 Header */}
        <div className="text-center mb-16">
          <div className="relative w-20 h-20 mx-auto mb-6 group">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-md group-hover:opacity-40 transition"></div>
            <img
              src={logo}
              alt="KanyakumariOne"
              className="relative w-20 h-20 object-contain rounded-full bg-black/40 border border-white/10 p-1 floating-effect"
            />
          </div>
          <span className="px-3.5 py-1.5 text-[10px] font-extrabold tracking-widest uppercase text-indigo-300 bg-indigo-500/10 rounded-full border border-indigo-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            Status Tracking
          </span>
          <h1 className="text-4xl sm:text-5xl font-black font-outfit text-white mt-4 tracking-tight leading-none">
            Live Request Tracker
          </h1>
          <p className="text-slate-400 mt-4 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Monitor your ongoing development, designs, and campaigns in real-time.
          </p>
        </div>

        {/* 🔍 SEARCH CARD */}
        <div className="bg-[#09090b]/40 border border-white/[0.06] p-6 sm:p-8 rounded-[28px] backdrop-blur-xl mb-12 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-1">
                Registered Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-ultra flex-1 !py-3.5"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn sm:w-auto px-8 !py-3.5 whitespace-nowrap inline-flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Locating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Track Status</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 ml-1 font-medium">
                Provide the mobile number used when submitting your estimate request form.
              </p>
            </div>
          </form>
        </div>

        {/* 📊 RESULTS LIST */}
        {searched && (
          <div className="space-y-8 animate-slide-up">
            {leads.length === 0 ? (
              <div className="text-center py-14 bg-[#09090b]/40 border border-white/[0.06] rounded-[28px] backdrop-blur-xl">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-400 text-sm font-extrabold font-outfit">
                  No matching requests found
                </p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed font-medium">
                  Please verify your input or check with support via WhatsApp if you just registered.
                </p>
              </div>
            ) : (
              leads.map((lead, idx) => {
                const currentStep = getStatusStep(lead.status);

                return (
                  <div
                    key={idx}
                    className="
                      bg-[#09090b]/40 border border-white/[0.06] p-6 sm:p-8 rounded-[28px] backdrop-blur-xl relative overflow-hidden
                      shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-350 hover:border-indigo-500/20
                    "
                  >
                    {/* Glowing corner backdrop */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* TOP DETAILS ROW */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-5 border-b border-white/[0.06]">
                      <div>
                        <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400">
                          Request #{lead.rowIndex}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black font-outfit text-white mt-1 leading-tight">
                          {lead.service}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                          Client: <span className="text-slate-200">{lead.name}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end shrink-0">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Current Status</span>
                        <span className={`
                          mt-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                          ${
                            currentStep === 4
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : currentStep === 2
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : currentStep === 3
                              ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }
                        `}>
                          {lead.status}
                        </span>
                      </div>
                    </div>

                    {/* 🚦 STEPPER PROGRESS WIDGET */}
                    <div className="relative py-4 mb-6">
                      
                      {/* Desktop Stepper */}
                      <div className="hidden sm:flex justify-between relative">
                        {/* Connecting Progress Line */}
                        <div className="absolute top-4 left-6 right-6 h-[3px] bg-white/[0.06] -z-10 rounded-full">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                            style={{
                              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {steps.map((step, sIdx) => {
                          const isActive = sIdx + 1 <= currentStep;

                          return (
                            <div key={sIdx} className="flex flex-col items-center text-center w-1/4">
                              <div className={`
                                w-9 h-9 rounded-full flex items-center justify-center border text-xs font-black transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]"
                                    : "bg-[#09090b] border-white/[0.08] text-slate-600"
                                }
                              `}>
                                {isActive && (sIdx + 1 < currentStep || currentStep === 4) ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  sIdx + 1
                                )}
                              </div>
                              <span className={`mt-3.5 text-xs font-extrabold font-outfit ${isActive ? "text-white" : "text-slate-500"}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-500 mt-1 px-3 leading-relaxed font-semibold">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile Stepper (Vertical list) */}
                      <div className="sm:hidden space-y-6 relative pl-6 border-l border-white/[0.08]">
                        {/* Connecting Line highlight */}
                        <div
                          className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 transition-all duration-550"
                          style={{
                            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                          }}
                        ></div>

                        {steps.map((step, sIdx) => {
                          const isActive = sIdx + 1 <= currentStep;

                          return (
                            <div key={sIdx} className="relative flex gap-4">
                              <div className={`
                                absolute -left-[31px] w-4 h-4 rounded-full border transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-indigo-500 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                    : "bg-[#030303] border-white/[0.08]"
                                }
                              `}></div>

                              <div>
                                <h4 className={`text-xs font-black font-outfit ${isActive ? "text-white" : "text-slate-500"}`}>
                                  {step.label}
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 📝 ADMIN PROGRESS NOTES */}
                    {lead.notes && (
                      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-indigo-300">
                          Latest Progress Update
                        </h4>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
                          {lead.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
