import { useState } from "react";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

export default function RequestTracker() {
  const [phone, setPhone] = useState("");
  const [leads, setLeads] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-6 py-16 sm:py-24 overflow-hidden font-sans">
      {/* 🌌 Background ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
        
        {/* Navigation Link back */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition duration-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Portal Home</span>
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative w-16 h-16 mx-auto mb-4 group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-md group-hover:opacity-40 transition"></div>
            <img
              src={logo}
              alt="KanyakumariOne"
              className="relative w-16 h-16 object-contain rounded-full bg-black/40 border border-white/10 p-0.5"
            />
          </div>
          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-400 bg-indigo-400/10 rounded-full border border-indigo-400/20">
            Client Portal
          </span>
          <h1 className="text-4xl font-extrabold font-outfit text-white mt-4">
            Live Request Tracker
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
            Track your ongoing development, design, and SEO requests in real-time.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="bg-white/[0.01] border border-white/[0.05] p-8 rounded-3xl backdrop-blur-md mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1">
                Enter Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-ultra flex-1"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn sm:w-auto px-8 py-3.5 whitespace-nowrap"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Searching...</span>
                    </span>
                  ) : (
                    <span>Track Status</span>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 ml-1">
                Provide the mobile number used when submitting the service request form.
              </p>
            </div>
          </form>
        </div>

        {/* RESULTS */}
        {searched && (
          <div className="space-y-6">
            {leads.length === 0 ? (
              <div className="text-center py-10 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-md">
                <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-400 text-sm font-medium">
                  No requests found matching this phone number.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Please verify your input or check with support via WhatsApp.
                </p>
              </div>
            ) : (
              leads.map((lead, idx) => {
                const currentStep = getStatusStep(lead.status);

                return (
                  <div
                    key={idx}
                    className="
                      bg-white/[0.01] border border-white/[0.05] p-6 sm:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden
                      shadow-[0_4px_30px_rgba(0,0,0,0.4)]
                    "
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>

                    {/* TOP DETAILS */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 pb-4 border-b border-white/[0.05]">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                          Request #{lead.rowIndex}
                        </span>
                        <h3 className="text-xl font-bold font-outfit text-white mt-1">
                          {lead.service}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Client: <span className="text-slate-200 font-semibold">{lead.name}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-start sm:items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Status Badge</span>
                        <span className={`
                          mt-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                          ${
                            currentStep === 4
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : currentStep === 2
                              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                              : currentStep === 3
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }
                        `}>
                          {lead.status}
                        </span>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="relative py-4 mb-6">
                      
                      {/* Desktop layout */}
                      <div className="hidden sm:flex justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/[0.08] -z-10">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                            style={{
                              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                            }}
                          ></div>
                        </div>

                        {steps.map((step, sIdx) => {
                          const isActive = sIdx + 1 <= currentStep;
                          const isCurrent = sIdx + 1 === currentStep;

                          return (
                            <div key={sIdx} className="flex flex-col items-center text-center w-1/4">
                              <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                                    : "bg-[#09090b] border-white/[0.08] text-slate-500"
                                }
                              `}>
                                {isActive && (sIdx + 1 < currentStep || currentStep === 4) ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  sIdx + 1
                                )}
                              </div>
                              <span className={`mt-3 text-xs font-bold font-outfit ${isActive ? "text-white" : "text-slate-500"}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-500 mt-1 px-2 leading-relaxed">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Mobile layout (vertical list) */}
                      <div className="sm:hidden space-y-6 relative pl-6 border-l border-white/[0.08]">
                        
                        {/* Connecting highlight line */}
                        <div
                          className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-indigo-500 transition-all duration-500"
                          style={{
                            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                          }}
                        ></div>

                        {steps.map((step, sIdx) => {
                          const isActive = sIdx + 1 <= currentStep;

                          return (
                            <div key={sIdx} className="relative flex gap-4">
                              
                              {/* Indicator circle */}
                              <div className={`
                                absolute -left-[31px] w-4 h-4 rounded-full border transition-all duration-300
                                ${
                                  isActive
                                    ? "bg-indigo-500 border-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                    : "bg-[#030303] border-white/[0.08]"
                                }
                              `}></div>

                              <div>
                                <h4 className={`text-xs font-bold font-outfit ${isActive ? "text-white" : "text-slate-500"}`}>
                                  {step.label}
                                </h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ADMIN UPDATE NOTES */}
                    {lead.notes && (
                      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <h4 className="text-xs font-bold font-outfit text-indigo-300">
                          Latest Progress Update
                        </h4>
                        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
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
