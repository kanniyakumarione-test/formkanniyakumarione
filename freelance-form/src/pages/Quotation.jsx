import { useState } from "react";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";

export default function Quotation() {
  const [client, setClient] = useState({
    name: "",
    phone: "",
  });

  const [items, setItems] = useState([
    { service: "", amount: "" },
  ]);

  const [discount, setDiscount] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => {
    setItems([...items, { service: "", amount: "" }]);
  };

  const removeRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const discountValue = discount
    ? (subtotal * Number(discount)) / 100
    : 0;

  const total = subtotal - discountValue;

  const formatCurrency = (num) =>
    "Rs. " + Number(num).toLocaleString("en-IN");

  // 🔥 PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // HEADER
    doc.addImage(logo, "PNG", 20, 10, 30, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("KanniyakumariOne", 55, 18);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Freelance Digital Services", 55, 25);
    doc.setTextColor(0);

    // TITLE
    doc.setFontSize(14);
    doc.text("QUOTATION", 105, 40, { align: "center" });
    doc.line(20, 45, 190, 45);

    // CLIENT
    doc.setFontSize(11);
    doc.text(`Client: ${client.name}`, 20, 60);
    doc.text(`Phone: ${client.phone}`, 20, 70);

    // TABLE
    let y = 90;

    doc.setFont("helvetica", "bold");
    doc.text("Service", 20, y);
    doc.text("Amount", 190, y, { align: "right" });

    y += 5;
    doc.line(20, y, 190, y);

    doc.setFont("helvetica", "normal");

    y += 10;

    items.forEach((item) => {
      doc.text(item.service || "-", 20, y);
      doc.text(formatCurrency(item.amount || 0), 190, y, {
        align: "right",
      });
      y += 10;
    });

    y += 5;
    doc.line(20, y, 190, y);

    y += 10;
    doc.text("Subtotal", 20, y);
    doc.text(formatCurrency(subtotal), 190, y, { align: "right" });

    if (discount) {
      y += 10;
      doc.text(`Discount (${discount}%)`, 20, y);
      doc.text(`- ${formatCurrency(discountValue)}`, 190, y, {
        align: "right",
      });
    }

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Total", 20, y);
    doc.text(formatCurrency(total), 190, y, { align: "right" });

    const blob = doc.output("blob");
    setPdfUrl(URL.createObjectURL(blob));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePDF();
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-[#f8fafc] px-6 py-16 sm:py-24 overflow-hidden font-sans">
      {/* 🌌 Background ambient gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
            Billing Tools
          </span>
          <h1 className="text-4xl font-extrabold font-outfit text-white mt-4">
            Quotation Generator
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Quickly estimate project costs and export a clean PDF quote for your prospects.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.01] border border-white/[0.05] p-8 rounded-3xl backdrop-blur-md">
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1">Client Name</label>
              <input
                placeholder="Client or company name"
                onChange={(e) =>
                  setClient({ ...client, name: e.target.value })
                }
                className="input-ultra"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1">Phone Number</label>
              <input
                placeholder="Client contact number"
                onChange={(e) =>
                  setClient({ ...client, phone: e.target.value })
                }
                className="input-ultra"
                required
              />
            </div>
          </div>

          {/* 🔥 SERVICES ITEMS TABLE */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-slate-400 ml-1 block">Line Items (Services & Cost)</label>
            
            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_130px_48px] gap-3 items-center"
                >
                  <input
                    placeholder="Service description"
                    value={item.service}
                    onChange={(e) =>
                      handleItemChange(index, "service", e.target.value)
                    }
                    className="input-ultra"
                    required
                  />

                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-slate-500 text-sm">₹</span>
                    <input
                      placeholder="Cost"
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      className="input-ultra pl-8 text-right no-spinner"
                      required
                    />
                  </div>

                  {/* DELETE */}
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    disabled={items.length === 1}
                    className="
                      h-[48px] w-12 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 
                      text-red-400 hover:bg-red-500/20 hover:text-red-300 transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed
                    "
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addRow}
              className="
                inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] 
                text-xs font-semibold text-slate-300 hover:bg-white/[0.06] hover:border-slate-600 transition duration-200
              "
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Line Item</span>
            </button>
          </div>

          {/* DISCOUNT */}
          <div className="grid gap-6 sm:grid-cols-2 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 ml-1">Discount % (Optional)</label>
              <div className="relative flex items-center">
                <input
                  placeholder="e.g. 10"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="input-ultra pr-8 no-spinner"
                />
                <span className="absolute right-4 text-slate-500 text-sm">%</span>
              </div>
            </div>

            {/* TOTALS SUMMARY */}
            <div className="flex flex-col justify-end text-right font-semibold space-y-1.5 pr-2">
              <div className="text-sm text-slate-400">
                Subtotal: <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount && (
                <div className="text-sm text-red-400/80">
                  Discount ({discount}%): -₹{discountValue.toLocaleString("en-IN")}
                </div>
              )}
              <div className="text-lg font-bold font-outfit text-white">
                Total Estimate: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <button className="btn w-full mt-4">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Quotation PDF
          </button>

        </form>
      </div>

      {/* PREVIEW MODAL */}
      {pdfUrl && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#09090b] border border-white/[0.08] w-full max-w-4xl h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

            <div className="flex justify-between items-center px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-bold font-outfit text-white">Quotation Preview</h2>
              <button
                onClick={() => setPdfUrl(null)}
                className="p-1.5 rounded-full hover:bg-white/[0.05] transition text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <iframe
              src={pdfUrl}
              className="flex-1 w-full bg-neutral-900 border-none"
              title="Quotation PDF Preview"
            />

            <div className="flex justify-end gap-3 p-4 border-t border-white/[0.08] bg-[#050507]">
              <button
                onClick={() => {
                  const iframe = document.querySelector("iframe");
                  iframe.contentWindow.print();
                }}
                className="px-5 py-2.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-sm font-semibold transition"
              >
                Print
              </button>

              <a
                href={pdfUrl}
                download="quotation.pdf"
                className="btn w-auto px-6"
              >
                Download PDF
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}