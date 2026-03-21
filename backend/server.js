require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // ✅ FIX HERE

const app = express();

app.use(cors());
app.use(express.json());

async function callAppsScript(payload) {
  const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Apps Script HTTP ${response.status}: ${text}`);
  }

  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error(`Apps Script returned invalid JSON: ${text}`);
    }
  }

  if (data.success === false) {
    throw new Error(data.error || "Apps Script reported failure");
  }

  return data;
}

// 🔐 ADMIN LOGIN
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password === "Rosi@1234") {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

// 📩 SUBMIT FORM (CREATE LEAD)
app.post("/submit", async (req, res) => {
  try {
    const data = await callAppsScript(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📊 GET LEADS (SAFE VERSION - NO CRASH)
app.get("/leads", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.GOOGLE_SCRIPT_URL}?t=${Date.now()}`
    );

    const text = await response.text(); // safer than res.json()

    let data;

    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON from Apps Script:", text);
      return res.json({ data: [] }); // always safe
    }

    res.json(data || { data: [] });

  } catch (err) {
    console.error("❌ Backend error:", err);
    res.json({ data: [] }); // never crash frontend
  }
});

// 🔄 UPDATE STATUS / NOTES
app.post("/update", async (req, res) => {
  try {
    const data = await callAppsScript(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🗑️ DELETE LEAD
app.post("/delete", async (req, res) => {
  try {
    const data = await callAppsScript({
      action: "delete",
      rowIndex: Number(req.body.rowIndex),
    });
    res.json({ success: true, data });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🚀 START SERVER
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
