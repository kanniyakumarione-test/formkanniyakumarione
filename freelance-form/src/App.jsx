import { useState, useEffect } from "react";
import ServiceCards from "./components/ServiceCards";
import ServiceForm from "./components/ServiceForm";
import AdminPanel from "./components/AdminPanel";
import AdminLoginModal from "./components/AdminLoginModal";
import Agreement from "./pages/Agreement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedService, setSelectedService] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const isAdminRoute = window.location.pathname === "/admin";

  if (window.location.pathname === "/agreement") {
  return <Agreement />;
}

  // 🔐 Persist login
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin === "true") {
      setIsAdmin(true);
    }
  }, []);

  // 🔐 Handle login
  const handleLogin = async (password) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("admin", "true"); // ✅ save login
        setIsAdmin(true);
      } else {
        toast.error("Wrong password ❌");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      {isAdminRoute ? (
        isAdmin ? (
          <AdminPanel />
        ) : (
          <AdminLoginModal onLogin={handleLogin} />
        )
      ) : (
        <div className="min-h-screen bg-black text-white">
          <ServiceCards onSelect={setSelectedService} />

          {selectedService && (
            <ServiceForm
              service={selectedService}
              onClose={() => setSelectedService("")}
            />
          )}
        </div>
      )}
    </>
  );
}

export default App;