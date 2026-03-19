import { useState } from "react";
import { toast } from "react-toastify";

export default function ServiceForm({ service, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    message: "",
    service: service,
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

      // 📱 WhatsApp
      const phone = formData.phone
        .replace(/\D/g, "")
        .replace(/^91/, "");

      const message = `Hi, I just submitted a request for ${formData.service}. Please contact me.`;

      const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;

      window.open(url, "_blank");

      toast.success("✅ Submitted! Redirecting to WhatsApp...");

      // Reset
      setFormData({
        name: "",
        phone: "",
        email: "",
        budget: "",
        message: "",
        service: service,
      });

      onClose();
    } catch (err) {
      toast.error("❌ Error submitting form");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center px-4 z-50">

      {/* MODAL */}
      <div className="
        w-full max-w-md
        bg-gradient-to-br from-[#0f172a] to-[#020617]
        border border-white/10
        rounded-2xl p-6
        text-white shadow-2xl
        relative
      ">

        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>

        <div className="relative z-10">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">{service}</h2>
              <p className="text-xs text-gray-400">
                Fill details — we’ll contact you fast
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="input-ultra"
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="input-ultra"
              required
            />

            <input
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className="input-ultra"
            />

            <input
              name="budget"
              placeholder="Budget (₹)"
              value={formData.budget}
              onChange={handleChange}
              className="input-ultra"
            />

            <textarea
              name="message"
              placeholder="Project Details"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="input-ultra resize-none"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-lg font-semibold
                bg-gradient-to-r from-blue-500 to-purple-500
                hover:scale-[1.02] transition
                shadow-lg shadow-blue-500/20
                disabled:opacity-50
              "
            >
              {loading ? "Submitting..." : "Submit Request 🚀"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}