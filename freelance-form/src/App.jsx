import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { ErrorBoundary } from "react-error-boundary";
import ServiceCards from "./components/ServiceCards";
import ServiceForm from "./components/ServiceForm";
import AdminPanel from "./components/AdminPanel";
import AdminLoginModal from "./components/AdminLoginModal";
import Quotation from "./pages/Quotation";
import RequestTracker from "./pages/RequestTracker";
import FreelancerDocuments, {
  routeToType,
} from "./pages/FreelancerDocuments";
import NotFound from "./pages/NotFound";
import ErrorFallback from "./components/ErrorFallback";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedService, setSelectedService] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Persist login
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
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

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        setIsAdmin(true);
      } else {
        toast.error("Wrong password");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <HelmetProvider>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BrowserRouter>
          <ToastContainer
            theme="dark"
            transition={Slide}
            limit={3}
            autoClose={2500}
          />
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-black text-white">
                  <Helmet>
                    <title>Kanniyakumari One | Interactive Service Portal</title>
                    <meta name="description" content="Build your next website, app, or brand with Kanniyakumari One." />
                  </Helmet>
                  <ServiceCards onSelect={setSelectedService} />
                  {selectedService && (
                    <ServiceForm
                      service={selectedService}
                      onClose={() => setSelectedService("")}
                    />
                  )}
                </div>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <>
                    <Helmet><title>Admin Panel | Kanniyakumari One</title></Helmet>
                    <AdminPanel />
                  </>
                ) : (
                  <>
                    <Helmet><title>Admin Login | Kanniyakumari One</title></Helmet>
                    <AdminLoginModal onLogin={handleLogin} />
                  </>
                )
              }
            />

            {/* Other Pages */}
            <Route path="/quotation" element={
              <>
                <Helmet><title>Project Quotation | Kanniyakumari One</title></Helmet>
                <Quotation />
              </>
            } />
            
            <Route path="/tracker" element={
              <>
                <Helmet><title>Live Project Tracker | Kanniyakumari One</title></Helmet>
                <RequestTracker />
              </>
            } />
            <Route path="/track" element={<Navigate to="/tracker" replace />} />
            
            {/* Document Routes mapped from routeToType */}
            {Object.keys(routeToType).map((path) => (
              <Route
                key={path}
                path={path}
                element={
                  <>
                    <Helmet><title>Client Documents | Kanniyakumari One</title></Helmet>
                    <FreelancerDocuments initialType={routeToType[path]} />
                  </>
                }
              />
            ))}
            <Route path="/documents" element={<Navigate to="/agreement" replace />} />
            
            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
