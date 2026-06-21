import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [deletingRowIndex, setDeletingRowIndex] = useState(null);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [draftRow, setDraftRow] = useState(null);
  const [savingRowIndex, setSavingRowIndex] = useState(null);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    budget: "",
    message: "",
    service: "",
  });
  const [isAddingLead, setIsAddingLead] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/leads?t=${Date.now()}`
      );
      const result = await res.json();
      setData(result.data || []);
    } catch {
      setData([]);
    }
  };

  const saveField = async (rowIndex, field, value) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rowIndex: Number(rowIndex),
        [field]: value,
      }),
    });

    if (!res.ok) {
      throw new Error("Update failed");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const deleteLead = async (rowIndex, name) => {
    const confirmed = window.confirm(
      `Delete ${name || "this lead"}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingRowIndex(rowIndex);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rowIndex: Number(rowIndex),
        }),
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setData((current) =>
        current.filter((row) => Number(row.rowIndex) !== Number(rowIndex))
      );
      await fetchData();
    } catch (err) {
      console.error("Delete failed");
      window.alert("Delete failed. Please try again.");
    } finally {
      setDeletingRowIndex(null);
    }
  };

  const handleNewLeadChange = (e) => {
    setNewLead((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const addLead = async (e) => {
    e.preventDefault();
    setIsAddingLead(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      });

      if (!res.ok) {
        throw new Error("Add lead failed");
      }

      setNewLead({
        name: "",
        phone: "",
        email: "",
        location: "",
        budget: "",
        message: "",
        service: "",
      });
      await fetchData();
    } catch (err) {
      console.error("Add lead failed");
      window.alert("Could not add lead. Please try again.");
    } finally {
      setIsAddingLead(false);
    }
  };

  const filtered = (data || []).filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.service?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    if (!filtered || filtered.length === 0) {
      window.alert("No leads data to export.");
      return;
    }

    const headers = ["Row Index", "Name", "Phone", "Email", "Service", "Location", "Budget", "Status", "Notes", "Message"];
    const rows = filtered.map((row) => [
      row.rowIndex || "",
      `"${(row.name || "").replace(/"/g, '""')}"`,
      `"${(row.phone || "").replace(/"/g, '""')}"`,
      `"${(row.email || "").replace(/"/g, '""')}"`,
      `"${(row.service || "").replace(/"/g, '""')}"`,
      `"${(row.location || "").replace(/"/g, '""')}"`,
      `"${(row.budget || "").replace(/"/g, '""')}"`,
      `"${(row.status || "").replace(/"/g, '""')}"`,
      `"${(row.notes || "").replace(/"/g, '""')}"`,
      `"${(row.message || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openWhatsAppByPhone = (value) => {
    const digits = String(value || "").replace(/\D/g, "");

    if (!digits) {
      window.alert("Enter a phone number first.");
      return;
    }

    const phone =
      digits.length === 10 ? `91${digits}` : digits.startsWith("91") ? digits : digits;
    const url = `https://wa.me/${phone}`;
    window.open(url, "_blank");
  };

  const openWhatsApp = (row) => {
    openWhatsAppByPhone(row.phone);
  };

  const startEditing = (row) => {
    setEditingRowIndex(row.rowIndex);
    setDraftRow({ ...row });
  };

  const cancelEditing = () => {
    setEditingRowIndex(null);
    setDraftRow(null);
  };

  const handleDraftChange = (field, value) => {
    setDraftRow((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveRow = async (row) => {
    if (!draftRow) {
      return;
    }

    const fieldsToSave = [
      "name",
      "phone",
      "service",
      "email",
      "location",
      "budget",
      "message",
      "status",
      "notes",
    ];

    const changedFields = fieldsToSave.filter(
      (field) => (row[field] || "") !== (draftRow[field] || "")
    );

    if (changedFields.length === 0) {
      cancelEditing();
      return;
    }

    setSavingRowIndex(row.rowIndex);

    try {
      await Promise.all(
        changedFields.map((field) =>
          saveField(row.rowIndex, field, draftRow[field] || "")
        )
      );

      setData((current) =>
        current.map((item) =>
          Number(item.rowIndex) === Number(row.rowIndex)
            ? { ...item, ...draftRow }
            : item
        )
      );
      cancelEditing();
    } catch (err) {
      console.error("Save failed");
      await fetchData();
      window.alert("Could not save changes. Please try again.");
    } finally {
      setSavingRowIndex(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "closed") {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (s === "in progress" || s === "in_progress") {
      return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    }
    if (s === "contacted") {
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  };

  const renderInput = (
    row,
    field,
    placeholder,
    isEditing,
    className = "bg-white/[0.03] border border-white/[0.08] rounded-lg p-2 w-full text-sm outline-none focus:border-blue-500"
  ) =>
    isEditing ? (
      <input
        value={draftRow?.[field] || ""}
        onChange={(e) => handleDraftChange(field, e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    ) : (
      <p className="break-words text-sm text-slate-200">{row[field] || "-"}</p>
    );

  const renderTextarea = (row, field, placeholder, isEditing, className) =>
    isEditing ? (
      <textarea
        value={draftRow?.[field] || ""}
        onChange={(e) => handleDraftChange(field, e.target.value)}
        placeholder={placeholder}
        rows="2"
        className={className}
      />
    ) : (
      <p className="break-words whitespace-pre-wrap text-sm text-slate-300">
        {row[field] || "-"}
      </p>
    );

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-4 py-8 sm:px-8 font-sans overflow-hidden">
      {/* 🌌 Ambient Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 pb-6 border-b border-white/[0.05]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
              Control Panel
            </span>
            <h1 className="text-3xl font-extrabold font-outfit text-white mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                placeholder="Filter leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm w-full outline-none focus:border-indigo-500/50 transition duration-200"
              />
            </div>

            <button
              onClick={exportToCSV}
              className="
                px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 
                text-indigo-300 font-semibold text-sm transition duration-200 flex items-center justify-center gap-2 w-full sm:w-auto
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("admin");
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition w-full sm:w-auto"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* STATS COUNT */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Leads</p>
            <h2 className="text-3xl font-extrabold font-outfit text-white mt-1.5">{data.length}</h2>
          </div>
          <div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending</p>
            <h2 className="text-3xl font-extrabold font-outfit text-amber-400 mt-1.5">
              {data.filter(d => !d.status || d.status.toLowerCase() === "pending").length}
            </h2>
          </div>
          <div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Contacted</p>
            <h2 className="text-3xl font-extrabold font-outfit text-indigo-400 mt-1.5">
              {data.filter(d => d.status?.toLowerCase() === "contacted").length}
            </h2>
          </div>
          <div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">In Progress</p>
            <h2 className="text-3xl font-extrabold font-outfit text-sky-400 mt-1.5">
              {data.filter(d => d.status?.toLowerCase() === "in progress" || d.status?.toLowerCase() === "in_progress").length}
            </h2>
          </div>
          <div className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Closed</p>
            <h2 className="text-3xl font-extrabold font-outfit text-emerald-400 mt-1.5">
              {data.filter(d => d.status?.toLowerCase() === "closed").length}
            </h2>
          </div>
        </div>

        {/* DOCK QUICK LINKS */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-md">
          <h2 className="text-lg font-bold font-outfit text-white">Freelancer Document Suite</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Quickly launch client-facing document generators in a separate workspace.
          </p>

          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "Agreement Form", href: "/agreement" },
              { label: "Welcome Letter", href: "/welcome-letter" },
              { label: "Onboarding Document", href: "/onboarding-doc" },
              { label: "Non-Disclosure (NDA)", href: "/nda" },
              { label: "Client Invoice", href: "/invoice" },
              { label: "Payment Receipt", href: "/payment-receipt" },
              { label: "Project Offboarding", href: "/offboarding-doc" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:text-blue-400 transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* ADD LEAD COLLAPSIBLE/CARD */}
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 sm:p-8 mb-8 backdrop-blur-md">
          <h2 className="text-lg font-bold font-outfit text-white">Add New Business Lead</h2>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Log prospects directly in your tracking panel manually.
          </p>

          <form
            onSubmit={addLead}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              name="name"
              value={newLead.name}
              onChange={handleNewLeadChange}
              placeholder="Lead Name"
              className="input-ultra text-sm"
              required
            />

            <input
              name="phone"
              value={newLead.phone}
              onChange={handleNewLeadChange}
              placeholder="Phone Number"
              className="input-ultra text-sm"
              required
            />

            <input
              name="service"
              value={newLead.service}
              onChange={handleNewLeadChange}
              placeholder="Service Type"
              className="input-ultra text-sm"
              required
            />

            <input
              name="email"
              value={newLead.email}
              onChange={handleNewLeadChange}
              placeholder="Email Address"
              className="input-ultra text-sm"
            />

            <input
              name="location"
              value={newLead.location}
              onChange={handleNewLeadChange}
              placeholder="Location"
              className="input-ultra text-sm"
            />

            <input
              name="budget"
              value={newLead.budget}
              onChange={handleNewLeadChange}
              placeholder="Budget Request (₹)"
              className="input-ultra text-sm"
            />

            <textarea
              name="message"
              value={newLead.message}
              onChange={handleNewLeadChange}
              placeholder="Notes, requirements, or client instructions..."
              rows="2"
              className="input-ultra text-sm sm:col-span-2 lg:col-span-3 resize-none"
            />

            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => openWhatsAppByPhone(newLead.phone)}
                className="px-5 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition duration-200"
              >
                Launch WhatsApp
              </button>

              <button
                type="submit"
                disabled={isAddingLead}
                className="btn w-auto px-6"
              >
                {isAddingLead ? "Adding Prospect..." : "Save Lead Details"}
              </button>
            </div>
          </form>
        </div>

        {/* LEADS LIST - MOBILE TILES */}
        <div className="grid gap-4 sm:hidden">
          {filtered.map((row, i) => {
            const isEditing = Number(editingRowIndex) === Number(row.rowIndex);

            return (
              <div key={i} className="bg-white/[0.01] p-5 rounded-2xl border border-white/[0.05] backdrop-blur-md">
                <div className="flex items-center justify-between mb-4 border-b border-white/[0.05] pb-3">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider">LEAD #{row.rowIndex}</span>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveRow(row)}
                          disabled={savingRowIndex === row.rowIndex}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold disabled:opacity-50 text-white"
                        >
                          {savingRowIndex === row.rowIndex ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-semibold text-slate-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditing(row)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Name</label>
                    {renderInput(
                      row,
                      "name",
                      "Name",
                      isEditing,
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 font-semibold text-sm outline-none"
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Phone</label>
                    {renderInput(
                      row,
                      "phone",
                      "Phone",
                      isEditing,
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-sm outline-none"
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Service</label>
                    {renderInput(
                      row,
                      "service",
                      "Service",
                      isEditing,
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-sm outline-none"
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Email</label>
                    {renderInput(row, "email", "Email", isEditing)}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Location</label>
                    {renderInput(row, "location", "Location", isEditing)}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Budget</label>
                    {renderInput(row, "budget", "Budget", isEditing)}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Message</label>
                    {renderTextarea(
                      row,
                      "message",
                      "Message",
                      isEditing,
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2.5 text-sm outline-none resize-none"
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-white/[0.05] pt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5 block mb-1">Status</label>
                    {isEditing ? (
                      <select
                        value={draftRow?.status || "Pending"}
                        onChange={(e) => handleDraftChange("status", e.target.value)}
                        className="w-full bg-[#111] border border-white/[0.08] rounded-xl p-2 text-sm outline-none"
                      >
                        <option>Pending</option>
                        <option>Contacted</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusBadge(row.status)}`}>
                        {row.status || "Pending"}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-0.5 block mb-1">Notes</label>
                    {renderInput(
                      row,
                      "notes",
                      "Add notes...",
                      isEditing,
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-2 text-sm outline-none"
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.05] flex gap-2">
                  <button
                    type="button"
                    onClick={() => openWhatsApp(row)}
                    className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition"
                  >
                    WhatsApp
                  </button>

                  <button
                    onClick={() => deleteLead(row.rowIndex, row.name)}
                    disabled={deletingRowIndex === row.rowIndex}
                    className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {deletingRowIndex === row.rowIndex ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* LEADS LIST - DESKTOP TABLE */}
        <div className="hidden sm:block bg-white/[0.01] border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/[0.02] border-b border-white/[0.05] text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Budget</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((row, i) => {
                  const isEditing = Number(editingRowIndex) === Number(row.rowIndex);

                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition duration-150">
                      <td className="p-4 min-w-[160px] font-semibold text-white">
                        {renderInput(
                          row,
                          "name",
                          "Name",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[130px]">
                        {renderInput(
                          row,
                          "phone",
                          "Phone",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[150px]">
                        {renderInput(
                          row,
                          "service",
                          "Service",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[180px]">
                        {renderInput(
                          row,
                          "email",
                          "Email",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[180px]">
                        {renderInput(
                          row,
                          "location",
                          "Location",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[110px]">
                        {renderInput(
                          row,
                          "budget",
                          "Budget",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4 min-w-[200px] max-w-[300px]">
                        {renderTextarea(
                          row,
                          "message",
                          "Message",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm resize-none"
                        )}
                      </td>
                      <td className="p-4 min-w-[125px]">
                        {isEditing ? (
                          <select
                            value={draftRow?.status || "Pending"}
                            onChange={(e) => handleDraftChange("status", e.target.value)}
                            className="bg-[#111] border border-white/[0.08] p-1.5 rounded-lg w-full text-sm outline-none"
                          >
                            <option>Pending</option>
                            <option>Contacted</option>
                            <option>In Progress</option>
                            <option>Closed</option>
                          </select>
                        ) : (
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${getStatusBadge(row.status)}`}>
                            {row.status || "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="p-4 min-w-[160px]">
                        {renderInput(
                          row,
                          "notes",
                          "Notes",
                          isEditing,
                          "bg-white/[0.04] border border-white/[0.08] p-1.5 rounded-lg w-full outline-none focus:border-blue-500 text-sm"
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveRow(row)}
                                disabled={savingRowIndex === row.rowIndex}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditing}
                                className="bg-white/[0.05] border border-white/[0.08] text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditing(row)}
                              className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                            >
                              Edit
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => openWhatsApp(row)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                          >
                            Chat
                          </button>

                          <button
                            onClick={() => deleteLead(row.rowIndex, row.name)}
                            disabled={deletingRowIndex === row.rowIndex}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
