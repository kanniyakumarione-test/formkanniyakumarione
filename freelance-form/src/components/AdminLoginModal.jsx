import { useState } from "react";

export default function AdminLoginModal({ onLogin }) {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center px-4">
      <div className="bg-[#111] p-6 rounded-xl w-full max-w-sm">

        <h2 className="text-center mb-4">Admin Login</h2>

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="input mb-4"
        />

        <button onClick={() => onLogin(password)} className="btn">
          Login
        </button>

      </div>
    </div>
  );
}
