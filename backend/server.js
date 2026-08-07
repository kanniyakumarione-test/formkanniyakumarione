require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. Strict CORS Configuration (Only allow trusted domains)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://kanniyakumarione.com",
  "https://forms.kanniyakumarione.com"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

// 3. Payload Size Limitation (Prevent massive payload crashes)
app.use(express.json({ limit: "10kb" }));

const JWT_SECRET = process.env.JWT_SECRET || "kanniyakumarione_super_secret_key_2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Rosi@1234";

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, error: "Forbidden: Invalid token" });
    req.user = user;
    next();
  });
}

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

// 4. Rate Limiting for Admin Login (Max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: "Too many login attempts. Try again in 15 minutes." },
});

// 🔐 ADMIN LOGIN (Generates JWT)
app.post("/login", loginLimiter, (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "12h" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, error: "Invalid password" });
  }
});

// 5. Rate Limiting for Public Submissions (Prevent spamming Google Apps Script)
const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Max 20 form submissions per IP per hour
  message: { success: false, error: "Submission limit reached. Try again later." },
});

// 📩 SUBMIT FORM (CREATE LEAD) - Public
app.post("/submit", submitLimiter, async (req, res) => {
  try {
    const data = await callAppsScript(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📊 GET LEADS (SAFE VERSION - NO CRASH) - Protected
app.get("/leads", authenticateToken, async (req, res) => {
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

// 🔍 PUBLIC LEAD TRACKING (BY PHONE) - Public
app.get("/track", async (req, res) => {
  const { phone } = req.query;
  if (!phone) {
    return res.status(400).json({ success: false, error: "Phone number required" });
  }

  try {
    const response = await fetch(
      `${process.env.GOOGLE_SCRIPT_URL}?t=${Date.now()}`
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Invalid JSON from Apps Script:", text);
      return res.json({ success: true, data: [] });
    }

    const leads = data.data || [];
    const normalizedQuery = phone.replace(/\D/g, "");

    const results = leads
      .filter((lead) => {
        const leadPhone = String(lead.phone || "").replace(/\D/g, "");
        if (!leadPhone || !normalizedQuery) return false;
        return leadPhone.slice(-10) === normalizedQuery.slice(-10);
      })
      .map((lead) => ({
        rowIndex: lead.rowIndex,
        name: lead.name,
        service: lead.service,
        status: lead.status || "Pending",
        notes: lead.notes || "",
      }));

    res.json({ success: true, data: results });
  } catch (err) {
    console.error("❌ Tracking error:", err);
    res.status(500).json({ success: false, error: "Failed to query status" });
  }
});

// 🔄 UPDATE STATUS / NOTES - Protected
app.post("/update", authenticateToken, async (req, res) => {
  try {
    const data = await callAppsScript(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🗑️ DELETE LEAD - Protected
app.post("/delete", authenticateToken, async (req, res) => {
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
