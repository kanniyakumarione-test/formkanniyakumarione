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
    email: "",    location: "",
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

  const updateField = async (rowIndex, field, value) => {
    setData((current) =>
      current.map((row) =>
        Number(row.rowIndex) === Number(rowIndex)
          ? { ...row, [field]: value }
          : row
      )
    );

    try {
      await saveField(rowIndex, field, value);
    } catch (err) {
      console.error("Update failed");
      await fetchData();
      window.alert(`Could not update ${field}. Please try again.`);
    }
  };

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

  const renderInput = (
    row,
    field,
    placeholder,
    isEditing,
    className = "bg-[#1a1a1a] border border-gray-700 rounded p-2 w-full"
  ) =>
    isEditing ? (
      <input
        value={draftRow?.[field] || ""}
        onChange={(e) => handleDraftChange(field, e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    ) : (
      <p className="break-words text-sm text-white">{row[field] || "-"}</p>
    );

  const renderTextarea = (row, field, placeholder, isEditing, className) =>
    isEditing ? (
      <textarea
        value={draftRow?.[field] || ""}
        onChange={(e) => handleDraftChange(field, e.target.value)}
        placeholder={placeholder}
        rows="3"
        className={className}
      />
    ) : (
      <p className="break-words whitespace-pre-wrap text-sm text-white">
        {row[field] || "-"}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold tracking-wide">
          Admin Dashboard
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

      <div className="bg-[#111] border border-gray-800 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-lg font-semibold">Add Lead</h2>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Create a lead directly from the admin page.
        </p>

        <form
          onSubmit={addLead}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          <input
            name="name"
            value={newLead.name}
            onChange={handleNewLeadChange}
            placeholder="Name"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
            required
          />

          <input
            name="phone"
            value={newLead.phone}
            onChange={handleNewLeadChange}
            placeholder="Phone"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
            required
          />

          <input
            name="service"
            value={newLead.service}
            onChange={handleNewLeadChange}
            placeholder="Service"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
            required
          />

          <input
            name="email"
            value={newLead.email}
            onChange={handleNewLeadChange}
            placeholder="Email"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
          />

          <input
            name="location"
            value={newLead.location}
            onChange={handleNewLeadChange}
            placeholder="Location"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
          />

          <input
            name="budget"
            value={newLead.budget}
            onChange={handleNewLeadChange}
            placeholder="Budget"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            disabled={isAddingLead}
            className="bg-blue-600 hover:bg-blue-500 rounded-lg px-4 py-2 font-medium disabled:opacity-50"
          >
            {isAddingLead ? "Adding..." : "Add Lead"}
          </button>

          <button
            type="button"
            onClick={() => openWhatsAppByPhone(newLead.phone)}
            className="bg-green-600 hover:bg-green-500 rounded-lg px-4 py-2 font-medium"
          >
            Chat on WhatsApp
          </button>

          <textarea
            name="message"
            value={newLead.message}
            onChange={handleNewLeadChange}
            placeholder="Notes / Message"
            rows="3"
            className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-3 py-2 sm:col-span-2 lg:col-span-3"
          />
        </form>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111] p-4 rounded-xl border border-gray-800 shadow">
          <p className="text-gray-400 text-sm">Total Leads</p>
          <h2 className="text-xl font-semibold">{data.length}</h2>
        </div>
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-4 sm:p-5 mb-6">
        <h2 className="text-lg font-semibold">Freelancer Documents</h2>
        <p className="text-sm text-gray-400 mt-1 mb-4">
          Open ready-to-generate client forms in a new tab.
        </p>

        <div className="flex flex-wrap gap-3">
          {[
            { label: "Agreement", href: "/agreement" },
            { label: "Welcome Letter", href: "/welcome-letter" },
            { label: "Onboarding Doc", href: "/onboarding-doc" },
            { label: "NDA", href: "/nda" },
            { label: "Invoice", href: "/invoice" },
            { label: "Payment Receipt", href: "/payment-receipt" },
            { label: "Offboarding Doc", href: "/offboarding-doc" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg bg-[#1a1a1a] border border-gray-700 text-sm hover:border-blue-500 hover:text-blue-300 transition"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:hidden">
        {filtered.map((row, i) => {
          const isEditing = Number(editingRowIndex) === Number(row.rowIndex);

          return (
            <div key={i} className="bg-[#111] p-4 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-400">Lead #{row.rowIndex}</p>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveRow(row)}
                        disabled={savingRowIndex === row.rowIndex}
                        className="px-3 py-1 rounded bg-blue-600 text-sm disabled:opacity-50"
                      >
                        {savingRowIndex === row.rowIndex ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 rounded bg-gray-700 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditing(row)}
                      className="px-3 py-1 rounded bg-[#1a1a1a] border border-gray-700 text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Name</p>
                  {renderInput(
                    row,
                    "name",
                    "Name",
                    isEditing,
                    "w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 font-semibold"
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  {renderInput(
                    row,
                    "phone",
                    "Phone",
                    isEditing,
                    "w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-sm text-gray-200"
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Service</p>
                  {renderInput(
                    row,
                    "service",
                    "Service",
                    isEditing,
                    "w-full bg-[#1a1a1a] border border-gray-700 rounded p-2 text-sm"
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  {renderInput(row, "email", "Email", isEditing)}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Location</p>
                  {renderInput(row, "location", "Location", isEditing)}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Budget</p>
                  {renderInput(row, "budget", "Budget", isEditing)}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Message</p>
                  {renderTextarea(
                    row,
                    "message",
                    "Message",
                    isEditing,
                    "w-full bg-[#1a1a1a] border border-gray-700 rounded p-2"
                  )}
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                {isEditing ? (
                  <select
                    value={draftRow?.status || "Pending"}
                    onChange={(e) => handleDraftChange("status", e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded p-2"
                  >
                    <option>Pending</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                ) : (
                  <p className="text-sm text-white">{row.status || "Pending"}</p>
                )}
              </div>

              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                {renderInput(
                  row,
                  "notes",
                  "Add notes...",
                  isEditing,
                  "w-full bg-[#1a1a1a] border border-gray-700 rounded p-2"
                )}
              </div>

              <button
                type="button"
                onClick={() => openWhatsApp(row)}
                className="mt-3 w-full bg-green-500 py-2 rounded-lg"
              >
                WhatsApp
              </button>

              <button
                onClick={() => deleteLead(row.rowIndex, row.name)}
                disabled={deletingRowIndex === row.rowIndex}
                className="mt-2 w-full bg-red-500 py-2 rounded-lg disabled:opacity-50"
              >
                {deletingRowIndex === row.rowIndex ? "Deleting..." : "Delete"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="hidden sm:block bg-[#111] border border-gray-800 rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a1a] text-gray-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Budget</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Notes</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => {
              const isEditing = Number(editingRowIndex) === Number(row.rowIndex);

              return (
                <tr key={i} className="border-t border-gray-800 hover:bg-[#1a1a1a]">
                  <td className="p-3 min-w-[180px]">
                    {renderInput(
                      row,
                      "name",
                      "Name",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[150px]">
                    {renderInput(
                      row,
                      "phone",
                      "Phone",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[160px]">
                    {renderInput(
                      row,
                      "service",
                      "Service",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[220px]">
                    {renderInput(
                      row,
                      "email",
                      "Email",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[220px]">
                    {renderInput(
                      row,
                      "location",
                      "Location",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[140px]">
                    {renderInput(
                      row,
                      "budget",
                      "Budget",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[240px]">
                    {renderTextarea(
                      row,
                      "message",
                      "Message",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3 min-w-[120px]">
                    {isEditing ? (
                      <select
                        value={draftRow?.status || "Pending"}
                        onChange={(e) => handleDraftChange("status", e.target.value)}
                        className="bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                      >
                        <option>Pending</option>
                        <option>Contacted</option>
                        <option>Closed</option>
                      </select>
                    ) : (
                      <p>{row.status || "Pending"}</p>
                    )}
                  </td>
                  <td className="p-3 min-w-[180px]">
                    {renderInput(
                      row,
                      "notes",
                      "Add notes...",
                      isEditing,
                      "bg-[#1a1a1a] border border-gray-700 p-1 rounded w-full"
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveRow(row)}
                            disabled={savingRowIndex === row.rowIndex}
                            className="bg-blue-600 px-3 py-1 rounded disabled:opacity-50"
                          >
                            {savingRowIndex === row.rowIndex ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="bg-gray-700 px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(row)}
                          className="bg-[#1a1a1a] border border-gray-700 px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openWhatsApp(row)}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        Chat
                      </button>

                      <button
                        onClick={() => deleteLead(row.rowIndex, row.name)}
                        disabled={deletingRowIndex === row.rowIndex}
                        className="bg-red-500 px-3 py-1 rounded disabled:opacity-50"
                      >
                        {deletingRowIndex === row.rowIndex ? "Deleting..." : "Delete"}
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
  );
}
