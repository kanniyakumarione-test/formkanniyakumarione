import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";

const servicesList = [
  "Website Development",
  "SEO Optimization",
  "Google Business Profile",
  "Resume Services",
  "Social Media Marketing",
  "Logo & Branding Design",
  "Content Writing",
  "YouTube SEO",
  "Instagram Growth",
  "E-commerce Store Setup",
  "Landing Page Design",
  "Google Ads / PPC",
];

const documentTypes = [
  {
    key: "agreement",
    route: "/agreement",
    label: "Agreement",
    pdfTitle: "SERVICE AGREEMENT",
    description: "Define the client engagement, scope, payment expectations, and service terms.",
    instructionsTitle: "Terms & Conditions",
    instructionsLead:
      "This Service Agreement outlines the professional terms governing the engagement between the client and KanniyakumariOne.",
    instructionPoints: [
      "The client is expected to provide accurate project requirements, complete content, and timely approvals required for delivery.",
      "Payments must be completed in accordance with the agreed advance, milestone, or final-delivery schedule. Work beyond the approved scope may result in additional charges.",
      "Revisions are provided according to the selected service and approved scope. Refunds are generally not applicable once production has commenced.",
      "KanniyakumariOne is not responsible for delays arising from incomplete content, delayed communication, or third-party platform dependencies.",
    ],
    acknowledgement:
      "By generating this agreement, the client acknowledges and accepts these service terms.",
  },
  {
    key: "welcomeLetter",
    route: "/welcome-letter",
    label: "Welcome Letter",
    pdfTitle: "WELCOME LETTER",
    description: "Share a polished welcome note and next steps after the client says yes.",
    instructionsTitle: "Welcome Note",
    instructionsLead:
      "Use this document to formally welcome a client and communicate the project commencement details in a professional format.",
    instructionPoints: [
      "Confirm the project title, start date, and the principal services included in the engagement.",
      "Outline the initial items required from the client, such as content, brand assets, credentials, or approvals.",
      "Maintain a welcoming tone while clearly setting expectations for communication, file sharing, and next steps.",
      "This document is best shared immediately after the client confirms the project.",
    ],
    acknowledgement:
      "By generating this welcome letter, you confirm that the engagement is ready to proceed to onboarding.",
  },
  {
    key: "onboarding",
    route: "/onboarding-doc",
    label: "Onboarding Doc",
    pdfTitle: "CLIENT ONBOARDING DOCUMENT",
    description: "Collect kickoff details, communication rules, timelines, and deliverables.",
    instructionsTitle: "Onboarding Checklist",
    instructionsLead:
      "This onboarding document establishes the project setup, working process, and delivery expectations before production begins.",
    instructionPoints: [
      "Define the approved service scope clearly so both parties understand what is included in the engagement.",
      "List the required deliverables, source materials, credentials, and approvals that must be provided by the client.",
      "Use the notes section to document communication channels, turnaround expectations, and the revision process.",
      "This document is most effective when shared immediately after agreement approval.",
    ],
    acknowledgement:
      "By generating this onboarding document, the client acknowledges the project setup requirements and workflow expectations.",
  },
  {
    key: "nda",
    route: "/nda",
    label: "NDA",
    pdfTitle: "NON-DISCLOSURE AGREEMENT",
    description: "Protect confidential business, product, and project information.",
    instructionsTitle: "Confidentiality Terms",
    instructionsLead:
      "This Non-Disclosure Agreement is intended for engagements involving confidential business, project, technical, or commercial information.",
    instructionPoints: [
      "Use this document before sharing strategy materials, credentials, pricing, source files, or internal business information.",
      "Specify the project title and effective dates so the confidentiality period is clearly defined.",
      "The receiving party is expected to safeguard all non-public information and not disclose it without prior written consent.",
      "This document is appropriate for discovery, planning, design, development, implementation, and handover stages.",
    ],
    acknowledgement:
      "By generating this NDA, both parties acknowledge the confidential nature of the engagement and the obligation to protect shared information.",
  },
  {
    key: "invoice",
    route: "/invoice",
    label: "Invoice",
    pdfTitle: "FREELANCER INVOICE",
    description: "Generate a branded invoice with amount, dates, and service details.",
    instructionsTitle: "Invoice Notes",
    instructionsLead:
      "This invoice formally requests payment for approved freelance services delivered or scheduled by KanniyakumariOne.",
    instructionPoints: [
      "Include the invoice number, issue date, due date, billed services, and the final amount payable.",
      "Use the notes section to mention payment instructions, banking details, installment terms, or tax remarks.",
      "Ensure the invoice aligns with the approved quotation, project scope, or milestone previously agreed with the client.",
      "Late fees, expedited requests, or additional revisions may be invoiced separately where applicable.",
    ],
    acknowledgement:
      "By generating this invoice, you confirm that the billing details are complete and ready to be shared with the client.",
  },
  {
    key: "offboarding",
    route: "/offboarding-doc",
    label: "Offboarding Doc",
    pdfTitle: "PROJECT OFFBOARDING DOCUMENT",
    description: "Wrap up a completed project with handover notes and closure terms.",
    instructionsTitle: "Offboarding Instructions",
    instructionsLead:
      "Use this document to formally close the project and record the final handover details in a professional manner.",
    instructionPoints: [
      "Record the closure date and list all deliverables, accounts, credentials, or files transferred to the client.",
      "Use the notes section to mention support periods, future maintenance options, or final recommendations.",
      "This document confirms that the primary delivery phase has been completed and the agreed materials have been handed over.",
      "Any post-handover services may be treated as a separate scope unless otherwise agreed in writing.",
    ],
    acknowledgement:
      "By generating this offboarding document, the project closure and handover details are formally recorded.",
  },
];

const routeToType = Object.fromEntries(
  documentTypes.map((documentType) => [documentType.route, documentType.key])
);

const today = new Date().toISOString().split("T")[0];

const getDocumentType = (typeKey) =>
  documentTypes.find((item) => item.key === typeKey) || documentTypes[0];

const joinServices = (services) =>
  services.length > 0 ? services.join(", ") : "Not specified";

const buildDocumentContent = (typeKey, form) => {
  const shared = {
    clientName: form.clientName || "Client",
    projectTitle: form.projectTitle || "the assigned project",
    services: joinServices(form.services),
    representative: form.companyRepresentative || "Roshinth Sojan",
    issueDate: form.issueDate || today,
    onboardingDate: form.onboardingDate || today,
    offboardingDate: form.offboardingDate || today,
    startDate: form.startDate || today,
    endDate: form.endDate || "Mutually agreed completion date",
    dueDate: form.dueDate || today,
    amount: form.amount || "0",
    currency: form.currency || "INR",
    invoiceNumber: form.invoiceNumber || "INV-001",
    deliverables: form.deliverables || "Final files, credentials, and approved deliverables",
    notes: form.notes || "No additional notes provided.",
    roleTitle: form.roleTitle || "Client Partner",
    email: form.email || "Not provided",
    phone: form.phone || "Not provided",
    address: form.address || "Not provided",
    signature: form.signature || form.clientName || "Client Signature",
  };

  switch (typeKey) {
    case "welcomeLetter":
      return {
        introTitle: "Welcome Summary",
        introPoints: [
          `Welcome ${shared.clientName} to KanniyakumariOne.`,
          `Project: ${shared.projectTitle}`,
          `Start date: ${shared.onboardingDate}`,
        ],
        paragraphs: [
          `This letter confirms that ${shared.clientName} has engaged KanniyakumariOne for ${shared.projectTitle}. We look forward to commencing this engagement and delivering the agreed services through a structured and collaborative process.`,
          `The confirmed service scope for this engagement includes ${shared.services}. Communication, file sharing, approvals, and feedback will be managed through the channels agreed upon by both parties.`,
          `The next stage of the process includes onboarding, confirmation of requirements, and schedule alignment. Any pending content, brand assets, access credentials, or approvals should be shared before active production begins.`,
          `We appreciate the opportunity to work with ${shared.clientName} and look forward to a productive and professional collaboration.`,
        ],
      };
    case "onboarding":
      return {
        introTitle: "Onboarding Snapshot",
        introPoints: [
          `Client: ${shared.clientName}`,
          `Services: ${shared.services}`,
          `Onboarding date: ${shared.onboardingDate}`,
        ],
        paragraphs: [
          `This onboarding document records the approved project setup for ${shared.clientName} in relation to ${shared.projectTitle}. It serves as the initial operating reference for the engagement with KanniyakumariOne.`,
          `The agreed service scope includes ${shared.services}. To ensure an efficient start, the client should provide timely approvals, accurate project information, and all required credentials or source materials.`,
          `The initial deliverables, required inputs, or requested assets include ${shared.deliverables}. Communication, revisions, and schedule confirmations will be coordinated throughout the engagement.`,
          `Additional onboarding notes and implementation instructions: ${shared.notes}`,
        ],
      };
    case "nda":
      return {
        introTitle: "Confidentiality Details",
        introPoints: [
          `Disclosing party: KanniyakumariOne`,
          `Receiving party: ${shared.clientName}`,
          `Project: ${shared.projectTitle}`,
        ],
        paragraphs: [
          `This Non-Disclosure Agreement is entered into between KanniyakumariOne and ${shared.clientName} in connection with discussions, planning, and execution related to ${shared.projectTitle}.`,
          `${shared.clientName} agrees to treat as confidential all non-public business, technical, creative, financial, and operational information shared during this engagement. Such information may include proposals, credentials, campaign data, source files, strategy documents, pricing, and client-specific materials.`,
          `The receiving party shall not disclose, reproduce, or use confidential information for any purpose other than the agreed engagement without prior written consent from KanniyakumariOne. Appropriate care must be taken to protect all shared materials, documents, and access details.`,
          `These confidentiality obligations take effect on ${shared.startDate} and remain in force until ${shared.endDate}, unless superseded by a later written agreement between the parties.`,
        ],
      };
    case "invoice":
      return {
        introTitle: "Invoice Summary",
        introPoints: [
          `Invoice No: ${shared.invoiceNumber}`,
          `Issue date: ${shared.issueDate}`,
          `Due date: ${shared.dueDate}`,
        ],
        paragraphs: [
          `This invoice is issued to ${shared.clientName} for freelance services related to ${shared.projectTitle}.`,
          `The billed scope for this invoice includes ${shared.services}.`,
          `The total amount payable is ${shared.currency} ${shared.amount}, with payment due on or before ${shared.dueDate}.`,
          `Payment instructions or remarks: ${shared.notes}`,
        ],
      };
    case "offboarding":
      return {
        introTitle: "Offboarding Summary",
        introPoints: [
          `Client: ${shared.clientName}`,
          `Project: ${shared.projectTitle}`,
          `Closure date: ${shared.offboardingDate}`,
        ],
        paragraphs: [
          `This offboarding document confirms the formal closeout of ${shared.projectTitle} for ${shared.clientName}. It records the completion and handover stage of the engagement with KanniyakumariOne.`,
          `The following materials, files, credentials, or deliverables form part of the final handover: ${shared.deliverables}. The client is expected to review, secure, and retain all final assets provided during project closure.`,
          `Any future revisions, maintenance requests, or additional development work requested after offboarding may be treated as a separate engagement unless otherwise agreed in writing.`,
          `Final closure notes and recommendations: ${shared.notes}`,
        ],
      };
    case "agreement":
    default:
      return {
        introTitle: "Agreement Highlights",
        introPoints: [
          `Client: ${shared.clientName}`,
          `Services: ${shared.services}`,
          `Start date: ${shared.startDate}`,
        ],
        paragraphs: [
          `This Service Agreement is entered into between ${shared.clientName} and KanniyakumariOne for ${shared.projectTitle}, under the terms set out in this document.`,
          `The client agrees to provide accurate project information, required content, and timely approvals. KanniyakumariOne will use reasonable professional efforts to deliver the agreed services, namely ${shared.services}, in accordance with the approved scope and timeline.`,
          `The client shall complete the agreed advance or milestone payments as scheduled. The current estimated project value is ${shared.currency} ${shared.amount}. Any additional features or services requested outside the approved scope may be billed separately.`,
          `Once production has commenced, refunds are not generally applicable. Delays caused by incomplete assets, delayed communication, or third-party tools and services are outside the responsibility of KanniyakumariOne.`,
          `By signing this agreement, the client confirms that these terms have been read and accepted, and acknowledges that this digitally generated document is valid without a physical signature.`,
        ],
      };
  }
};

export default function FreelancerDocuments({ initialType = "agreement" }) {
  const [selectedType, setSelectedType] = useState(initialType);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",
    projectTitle: "",
    services: [],
    amount: "",
    currency: "INR",
    invoiceNumber: "",
    issueDate: today,
    dueDate: "",
    startDate: today,
    endDate: "",
    onboardingDate: today,
    offboardingDate: today,
    roleTitle: "",
    companyRepresentative: "Roshinth Sojan",
    deliverables: "",
    notes: "",
    signature: "",
  });

  const activeDocument = useMemo(
    () => getDocumentType(selectedType),
    [selectedType]
  );

  const currentInstructions = activeDocument.instructionPoints || [];

  const setDocumentType = (typeKey) => {
    const nextDocument = getDocumentType(typeKey);
    setSelectedType(nextDocument.key);
    window.history.replaceState({}, "", nextDocument.route);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const toggleService = (service) => {
    setForm((current) => {
      const exists = current.services.includes(service);
      return {
        ...current,
        services: exists
          ? current.services.filter((item) => item !== service)
          : [...current.services, service],
      };
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const content = buildDocumentContent(selectedType, form);
    const dateLabel = new Date().toLocaleDateString();
    const isInvoice = selectedType === "invoice";

    doc.setGState(new doc.GState({ opacity: 0.07 }));
    doc.addImage(logo, "PNG", 45, 95, 120, 60);
    doc.setGState(new doc.GState({ opacity: 1 }));

    doc.addImage(logo, "PNG", 20, 10, 25, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("KanniyakumariOne", 50, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Freelance Digital Services", 50, 24);
    doc.setTextColor(0);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(activeDocument.pdfTitle, 105, 40, { align: "center" });
    doc.line(20, 45, 190, 45);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Client Name: ${form.clientName || "Not provided"}`, 20, 58);
    doc.text(`Email: ${form.email || "Not provided"}`, 20, 66);
    doc.text(`Phone: ${form.phone || "Not provided"}`, 20, 74);
    doc.text(`Project: ${form.projectTitle || "Not provided"}`, 20, 82);

    let y = 94;

    if (isInvoice) {
      doc.setFont("helvetica", "bold");
      doc.text("Billing Summary", 20, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Number: ${form.invoiceNumber || "INV-001"}`, 20, y);
      doc.text(`Issue Date: ${form.issueDate || today}`, 120, y);
      y += 8;
      doc.text(`Due Date: ${form.dueDate || today}`, 20, y);
      doc.text(`Currency: ${form.currency || "INR"}`, 120, y);
      y += 12;

      doc.setFont("helvetica", "bold");
      doc.text("Service Description", 20, y);
      doc.text("Amount", 190, y, { align: "right" });
      y += 4;
      doc.line(20, y, 190, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      const serviceLines = doc.splitTextToSize(
        `${form.projectTitle || "Freelance services"} - ${joinServices(form.services)}`,
        125
      );
      doc.text(serviceLines, 20, y);
      doc.text(`${form.currency || "INR"} ${form.amount || "0"}`, 190, y, {
        align: "right",
      });
      y += Math.max(serviceLines.length * 6, 10) + 6;

      doc.line(20, y, 190, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Total Payable", 20, y);
      doc.text(`${form.currency || "INR"} ${form.amount || "0"}`, 190, y, {
        align: "right",
      });
      y += 14;

      doc.setFont("helvetica", "normal");
      content.paragraphs.forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 4;
      });
    } else {
      doc.setFont("helvetica", "bold");
      doc.text(content.introTitle, 20, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      content.introPoints.forEach((point) => {
        const lines = doc.splitTextToSize(`- ${point}`, 168);
        doc.text(lines, 22, y);
        y += lines.length * 6 + 2;
      });

      y += 4;

      content.paragraphs.forEach((paragraph) => {
        const lines = doc.splitTextToSize(paragraph, 170);
        doc.text(lines, 20, y);
        y += lines.length * 6 + 5;
      });
    }

    y += 6;
    doc.text("Client Signature:", 20, y);
    doc.line(20, y + 10, 80, y + 10);
    doc.text(form.signature || form.clientName || "", 20, y + 8);

    doc.text("For KanniyakumariOne:", 120, y);
    doc.line(120, y + 10, 180, y + 10);
    doc.text(form.companyRepresentative || "Authorized Signatory", 120, y + 8);

    y += 24;
    doc.text("Date:", 20, y);
    doc.text(dateLabel, 34, y);

    const stampX = 110;
    const stampY = Math.min(y - 38, 230);
    doc.setDrawColor(40, 70, 160);
    doc.setLineWidth(1.5);
    doc.rect(stampX, stampY, 80, 40);
    doc.setTextColor(40, 70, 160);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("KANNIYAKUMARIONE", stampX + 40, stampY + 10, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.text(activeDocument.pdfTitle, stampX + 40, stampY + 18, {
      align: "center",
    });
    doc.text(dateLabel, stampX + 40, stampY + 26, { align: "center" });
    doc.text("SIGN:", stampX + 8, stampY + 34);
    doc.line(stampX + 25, stampY + 34, stampX + 70, stampY + 34);
    doc.text(form.companyRepresentative || "ROSHINTH SOJAN", stampX + 25, stampY + 32);
    doc.setTextColor(0);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "This document is digitally generated by KanniyakumariOne and is valid without physical signature.",
      105,
      285,
      { align: "center" }
    );

    const blob = doc.output("blob");
    setPdfUrl(URL.createObjectURL(blob));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.clientName.trim()) {
      toast.error("Enter the client name");
      return;
    }

    if (
      ["agreement", "onboarding", "invoice"].includes(selectedType) &&
      form.services.length === 0
    ) {
      toast.error("Select at least one service");
      return;
    }

    if (selectedType === "invoice" && !form.amount.trim()) {
      toast.error("Enter the invoice amount");
      return;
    }

    generatePDF();
  };

  const previewTitle = `${activeDocument.label} Preview`;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-gray-800 bg-gradient-to-br from-[#111] via-[#0d1628] to-[#111] p-6 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.35em] text-blue-300">
            Freelancer Documents
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Generate client-ready forms beyond the agreement
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300 sm:text-base">
            Create polished PDFs for onboarding, confidentiality, billing, and
            project closure using the same quick workflow as your agreement form.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-gray-800 bg-[#0f0f0f] p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap gap-3">
              {documentTypes.map((documentType) => {
                const active = documentType.key === selectedType;

                return (
                  <button
                    key={documentType.key}
                    type="button"
                    onClick={() => setDocumentType(documentType.key)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-blue-500 bg-blue-600 text-white"
                        : "border-gray-700 bg-[#151515] text-gray-300 hover:border-gray-500"
                    }`}
                  >
                    {documentType.label}
                  </button>
                );
              })}
            </div>

            <div className="mb-6 rounded-2xl border border-gray-800 bg-[#121212] p-5">
              <h2 className="text-xl font-semibold">{activeDocument.label}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {activeDocument.description}
              </p>
            </div>

            <div className="mb-6 rounded-2xl border border-gray-800 bg-[#111] p-5 text-sm leading-relaxed text-gray-300 shadow-lg">
              <h3 className="mb-3 text-lg font-semibold text-white">
                {activeDocument.instructionsTitle}
              </h3>
              <p className="mb-4">
                {activeDocument.instructionsLead}
              </p>
              <ul className="list-disc space-y-2 pl-5 text-gray-400">
                {currentInstructions.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs italic text-gray-500">
                {activeDocument.acknowledgement}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Client name"
                  className="input"
                  required
                />
                <input
                  name="projectTitle"
                  value={form.projectTitle}
                  onChange={handleChange}
                  placeholder="Project / engagement title"
                  className="input"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="input"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="input"
                />
              </div>

              {["nda"].includes(selectedType) && (
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Client address or registered business address"
                  className="input"
                />
              )}

              {["agreement", "welcomeLetter", "onboarding", "invoice"].includes(selectedType) && (
                <div>
                  <p className="mb-2 text-sm text-gray-400">Select services</p>
                  <div className="flex flex-wrap gap-2">
                    {servicesList.map((service) => {
                      const active = form.services.includes(service);

                      return (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`rounded-lg border px-3 py-2 text-sm transition ${
                            active
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-700 bg-[#151515] text-gray-300"
                          }`}
                        >
                          {service}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {["agreement", "nda"].includes(selectedType) && (
                  <input
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    className="input"
                  />
                )}

                {["nda"].includes(selectedType) && (
                  <input
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    className="input"
                  />
                )}

                {["welcomeLetter", "onboarding"].includes(selectedType) && (
                  <input
                    name="onboardingDate"
                    type="date"
                    value={form.onboardingDate}
                    onChange={handleChange}
                    className="input"
                  />
                )}

                {["offboarding"].includes(selectedType) && (
                  <input
                    name="offboardingDate"
                    type="date"
                    value={form.offboardingDate}
                    onChange={handleChange}
                    className="input"
                  />
                )}

                {["agreement", "invoice"].includes(selectedType) && (
                  <input
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Project amount"
                    className="input"
                  />
                )}

                {["invoice"].includes(selectedType) && (
                  <>
                    <input
                      name="invoiceNumber"
                      value={form.invoiceNumber}
                      onChange={handleChange}
                      placeholder="Invoice number"
                      className="input"
                    />
                    <input
                      name="currency"
                      value={form.currency}
                      onChange={handleChange}
                      placeholder="Currency"
                      className="input"
                    />
                    <input
                      name="issueDate"
                      type="date"
                      value={form.issueDate}
                      onChange={handleChange}
                      className="input"
                    />
                    <input
                      name="dueDate"
                      type="date"
                      value={form.dueDate}
                      onChange={handleChange}
                      className="input"
                    />
                  </>
                )}
              </div>

              {["onboarding", "offboarding"].includes(selectedType) && (
                <textarea
                  name="deliverables"
                  value={form.deliverables}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Deliverables, assets, access, handover items"
                  className="input"
                />
              )}

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Additional terms, instructions, or notes"
                className="input"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="signature"
                  value={form.signature}
                  onChange={handleChange}
                  placeholder="Client signature name"
                  className="input"
                />
                <input
                  name="companyRepresentative"
                  value={form.companyRepresentative}
                  onChange={handleChange}
                  placeholder="Company representative"
                  className="input"
                />
              </div>

              <button className="btn">
                Generate {activeDocument.label}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-800 bg-[#101010] p-5">
              <h3 className="text-lg font-semibold">Included document types</h3>
              <div className="mt-4 space-y-3">
                {documentTypes.map((documentType) => (
                  <div
                    key={documentType.key}
                    className="rounded-2xl border border-gray-800 bg-[#151515] p-4"
                  >
                    <p className="font-medium text-white">{documentType.label}</p>
                    <p className="mt-1 text-sm leading-6 text-gray-400">
                      {documentType.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-blue-900/50 bg-[#0f1626] p-5">
              <h3 className="text-lg font-semibold text-white">How to use</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                Pick a document, fill the client details, generate the PDF, then
                preview, print, or download it immediately.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-800 bg-[#101010] p-5">
              <h3 className="text-lg font-semibold">Included in this form</h3>
              <div className="mt-4 space-y-2 text-sm leading-6 text-gray-400">
                {currentInstructions.map((point) => (
                  <p key={point}>• {point}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-gray-800 bg-[#111]">
            <div className="flex items-center justify-between border-b border-gray-800 p-4">
              <h2 className="text-lg font-semibold">{previewTitle}</h2>
              <button
                type="button"
                onClick={() => setPdfUrl(null)}
                className="rounded-lg border border-gray-700 px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <iframe
              src={pdfUrl}
              title={previewTitle}
              className="flex-1 w-full"
            />

            <div className="flex flex-col gap-3 border-t border-gray-800 p-4 sm:flex-row">
              <button
                type="button"
                onClick={() => document.querySelector("iframe")?.contentWindow?.print()}
                className="btn"
              >
                Print
              </button>

              <a
                href={pdfUrl}
                download={`${activeDocument.label.toLowerCase().replace(/\s+/g, "-")}.pdf`}
                className="btn text-center"
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

export { routeToType };
