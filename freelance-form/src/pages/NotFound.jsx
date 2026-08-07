import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 text-white text-center font-sans">
      <Helmet>
        <title>404 - Page Not Found | Kanniyakumari One</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      
      <h1 className="text-[120px] font-black font-outfit text-white/10 leading-none">
        404
      </h1>
      <h2 className="text-3xl font-bold font-outfit text-white mt-4">
        Lost in Space
      </h2>
      <p className="text-slate-400 mt-4 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 font-bold transition duration-200"
      >
        Return to Home
      </Link>
    </div>
  );
}
