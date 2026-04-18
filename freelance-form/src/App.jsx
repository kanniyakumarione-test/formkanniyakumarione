import { useState, useEffect } from "react";
import ServiceCards from "./components/ServiceCards";
import ServiceForm from "./components/ServiceForm";
import AdminPanel from "./components/AdminPanel";
import AdminLoginModal from "./components/AdminLoginModal";
import Quotation from "./pages/Quotation";
import FreelancerDocuments, {
  routeToType,
} from "./pages/FreelancerDocuments";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedService, setSelectedService] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const currentPath = window.location.pathname;

  const isAdminRoute = currentPath === "/admin";

  if (routeToType[currentPath] || currentPath === "/documents") {
    return (
      <FreelancerDocuments initialType={routeToType[currentPath] || "agreement"} />
    );
  }

  if (currentPath === "/quotation") {
    return <Quotation />;
  }

  // Persist login
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (admin === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Handle login
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
        localStorage.setItem("admin", "true");
        setIsAdmin(true);
      } else {
        toast.error("Wrong password");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
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
