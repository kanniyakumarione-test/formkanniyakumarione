import { useState } from "react";
import { toast } from "react-toastify";

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

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // 🔄 Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        toast.success("Current location detected");
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

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Send to backend
      await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // 📱 WhatsApp redirection
      const phone = formData.phone
        .replace(/\D/g, "")
        .replace(/^91/, "");

      const message = `Hi, I just submitted a request for ${formData.service}. Please contact me.`;
      const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");
      toast.success("Submitted successfully! Redirecting to WhatsApp...");

      // Reset
      setFormData({
        name: "",
        phone: "",
        email: "",
        location: "",
        budget: "",
        message: "",
        service: service,
      });

      onClose();
    } catch (err) {
      toast.error("Error submitting request");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#030303]/80 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 sm:p-6 z-50 animate-fade-in">
      
      {/* Back click close zone */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* MODAL WRAPPER */}
      <div className="
        w-full max-w-lg my-auto
        bg-[#09090b]/95 border border-white/[0.08]
        rounded-[28px] p-6 sm:p-8
        text-white shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)]
        relative z-10
        backdrop-blur-xl
        overflow-hidden
        animate-slide-up
      ">
        {/* Decorative inner gradient background blur */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                Service Request Form
              </span>
              <h2 className="text-2xl font-bold font-outfit text-white mt-1">
                {service}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide your requirements below and we'll reach out shortly.
              </p>
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

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                <label className="text-xs font-semibold text-slate-400 ml-1">Budget (₹ / Optional)</label>
                <input
                  name="budget"
                  placeholder="e.g. 15,000"
                  value={formData.budget}
                  onChange={handleChange}
                  className="input-ultra"
                />
              </div>
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
                    px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-slate-200 
                    hover:bg-white/[0.08] hover:border-slate-600 transition duration-200 
                    disabled:opacity-50 flex items-center justify-center gap-1.5 whitespace-nowrap
                  "
                >
                  <svg className={`w-4 h-4 ${locating ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{locating ? "Locating..." : "GPS"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400 ml-1">Project Details</label>
              <textarea
                name="message"
                placeholder="Describe your design, feature requirements, timelines, etc..."
                value={formData.message}
                onChange={handleChange}
                rows="3"
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
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting Request...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Submit & Continue to WhatsApp</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
