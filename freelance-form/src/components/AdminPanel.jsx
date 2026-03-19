import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  // 🔄 Auto fetch every 5s
  useEffect(() => {
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API_URL}/leads?t=${Date.now()}`)
        .then((res) => res.json())
        .then((res) => setData(res.data || []))
        .catch(() => setData([]));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  // 🔄 Update status / notes
  const updateField = async (rowIndex, field, value) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rowIndex: Number(rowIndex),
          [field]: value,
        }),
      });
    } catch (err) {
      console.error("Update failed");
    }
  };

  // 🔍 Search
  const filtered = (data || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.service?.toLowerCase().includes(search.toLowerCase())
  );

  // 📱 WhatsApp
  const openWhatsApp = (row) => {
    const phone = row.phone?.replace(/\D/g, "").replace(/^91/, "");
    const url = `https://wa.me/91${phone}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">
          📊 Admin Dashboard
        </h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-sm w-full sm:w-auto"
          />

          <button
            onClick={() => {
              localStorage.removeItem("admin");
              window.location.reload();
            }}
            className="px-3 py-2 bg-red-500 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] p-4 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Total Leads</p>
          <h2 className="text-xl font-semibold">{data.length}</h2>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="grid gap-4 sm:hidden">
        {filtered.map((row, i) => (
          <div key={i} className="bg-[#111] p-4 rounded-xl border border-gray-800">

            <p className="font-semibold">{row.name}</p>
            <p className="text-sm text-gray-400">{row.phone}</p>
            <p className="text-sm">{row.service}</p>

            {/* STATUS */}
            <select
              value={row.status || "Pending"}
              onChange={(e) =>
                updateField(row.rowIndex, "status", e.target.value)
              }
              className="mt-2 w-full bg-[#1a1a1a] border border-gray-700 rounded p-2"
            >
              <option>Pending</option>
              <option>Contacted</option>
              <option>Closed</option>
            </select>

            {/* NOTES */}
            <input
              defaultValue={row.notes || ""}
              onBlur={(e) =>
                updateField(row.rowIndex, "notes", e.target.value)
              }
              placeholder="Add notes..."
              className="mt-2 w-full bg-[#1a1a1a] border border-gray-700 rounded p-2"
            />

            <button
              onClick={() => openWhatsApp(row)}
              className="mt-3 w-full bg-green-500 py-2 rounded-lg"
            >
              WhatsApp
            </button>

          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden sm:block bg-[#111] border border-gray-800 rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-t border-gray-800 hover:bg-[#1a1a1a]">

                <td className="p-3">{row.name}</td>
                <td className="p-3">{row.phone}</td>
                <td className="p-3">{row.service}</td>

                <td className="p-3">
                  <select
                    value={row.status || "Pending"}
                    onChange={(e) =>
                      updateField(row.rowIndex, "status", e.target.value)
                    }
                    className="bg-[#1a1a1a] border border-gray-700 p-1 rounded"
                  >
                    <option>Pending</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                </td>

                <td className="p-3">
                  <input
                    defaultValue={row.notes || ""}
                    onBlur={(e) =>
                      updateField(row.rowIndex, "notes", e.target.value)
                    }
                    className="bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                  />
                </td>

                <td className="p-3">
                  <button
                    onClick={() => openWhatsApp(row)}
                    className="bg-green-500 px-3 py-1 rounded"
                  >
                    Chat
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}