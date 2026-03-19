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
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl mb-6 text-center">Quotation</h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            placeholder="Client Name"
            onChange={(e) =>
              setClient({ ...client, name: e.target.value })
            }
            className="input"
            required
          />

          <input
            placeholder="Phone Number"
            onChange={(e) =>
              setClient({ ...client, phone: e.target.value })
            }
            className="input"
            required
          />

          {/* 🔥 FIXED GRID LAYOUT */}
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_120px_50px] gap-3"
            >
              {/* SERVICE (BIG) */}
              <input
                placeholder="Service"
                value={item.service}
                onChange={(e) =>
                  handleItemChange(index, "service", e.target.value)
                }
                className="input"
              />

              {/* AMOUNT (SMALL) */}
              <input
                placeholder="₹"
                type="number"
                value={item.amount}
                onChange={(e) =>
                  handleItemChange(index, "amount", e.target.value)
                }
                className="input text-center no-spinner"
              />

              {/* DELETE */}
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="bg-red-500 hover:bg-red-600 rounded"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addRow}
            className="bg-gray-800 px-4 py-2 rounded"
          >
            + Add Service
          </button>

          {/* DISCOUNT */}
          <input
            placeholder="Discount % (optional)"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="input no-spinner"
          />

          {/* TOTAL */}
          <div className="text-right font-bold space-y-1">
            <p>Subtotal: ₹{subtotal}</p>
            {discount && <p>Discount: -₹{discountValue}</p>}
            <p className="text-lg">Total: ₹{total}</p>
          </div>

          <button className="btn">Generate Quotation</button>

        </form>
      </div>

      {/* PREVIEW */}
      {pdfUrl && (
  <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50 p-4">

    <div className="bg-[#111] w-full max-w-5xl h-[90vh] flex flex-col rounded-xl shadow-2xl">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">

        <h2 className="text-lg font-semibold">
          Quotation Preview
        </h2>

        {/* ❌ CLOSE */}
        <button
          onClick={() => setPdfUrl(null)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>

      </div>

      {/* PDF */}
      <iframe
        src={pdfUrl}
        className="flex-1 w-full bg-white"
        title="Quotation Preview"
      />

      {/* 🔥 ACTIONS */}
      <div className="flex gap-3 p-4 border-t border-gray-700">

        <button
          onClick={() => {
            const iframe = document.querySelector("iframe");
            iframe.contentWindow.print();
          }}
          className="btn"
        >
          Print
        </button>

        <a
          href={pdfUrl}
          download="quotation.pdf"
          className="btn"
        >
          Download
        </a>

      </div>

    </div>
  </div>
     )}
    </div>
  );
}