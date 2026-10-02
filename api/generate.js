function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function wa(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  if (digits.length === 10) return "91" + digits;
  return digits;
}

function buildSite(data) {
  const name = esc(data.businessName);
  const type = esc(data.businessType || "Business");
  const location = esc(data.businessLocation);
  const service = esc(data.businessService || "Professional services");
  const description = esc(
    data.businessDescription ||
    `Professional ${data.businessType || "business"} services in ${data.businessLocation}.`
  );
  const number = wa(data.businessWhatsapp);
  const message = encodeURIComponent(
    `Hi ${data.businessName}, I found your website and want to know more about your services.`
  );

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} — ${type}</title>
<meta name="description" content="${description}">
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,Arial,sans-serif;color:#102033;background:#f5f8fb;line-height:1.6}.wrap{width:min(1120px,calc(100% - 32px));margin:auto}
header{padding:22px 0;background:#07111f;color:#fff}.nav{display:flex;justify-content:space-between;align-items:center;gap:20px}.brand{font-size:22px;font-weight:800}
.hero{padding:90px 0;background:linear-gradient(135deg,#07111f,#12324b);color:#fff}.badge{color:#65f5c8;font-size:12px;font-weight:800;letter-spacing:.14em}
h1{font-size:clamp(42px,7vw,76px);line-height:1.02;margin:15px 0;max-width:850px}.hero p{max-width:680px;color:#c3d0df;font-size:18px}
.btn{display:inline-block;padding:14px 22px;border-radius:10px;background:#65f5c8;color:#06120e;text-decoration:none;font-weight:800;margin-top:18px}
section{padding:70px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.card{padding:26px;border-radius:18px;background:#fff;border:1px solid #dce5ee;box-shadow:0 12px 35px rgba(10,30,50,.06)}.muted{color:#607086}
.contact{background:#07111f;color:#fff;text-align:center}.contact p{color:#b9c7d6}@media(max-width:700px){.grid{grid-template-columns:1fr}.hero{padding:62px 0}.nav{align-items:flex-start;flex-direction:column}}
</style>
</head>
<body>
<header><div class="wrap nav"><div class="brand">${name}</div><div>${location}</div></div></header>
<main><section class="hero"><div class="wrap"><div class="badge">${type.toUpperCase()}</div><h1>${service}</h1><p>${description}</p><a class="btn" href="https://wa.me/${number}?text=${message}" target="_blank" rel="noopener">Chat on WhatsApp →</a></div></section>
<section><div class="wrap"><h2>What we offer</h2><div class="grid"><div class="card"><h3>Professional Service</h3><p class="muted">${service} designed around your requirements.</p></div><div class="card"><h3>Local Support</h3><p class="muted">Serving customers in ${location} with direct communication.</p></div><div class="card"><h3>Quick Enquiry</h3><p class="muted">Connect directly on WhatsApp for availability, pricing and next steps.</p></div></div></div></section>
<section class="contact"><div class="wrap"><h2>Ready to talk?</h2><p>Contact ${name} directly on WhatsApp.</p><a class="btn" href="https://wa.me/${number}?text=${message}" target="_blank" rel="noopener">WhatsApp ${name}</a></div></section>
</main></body></html>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    if (!data.businessName || !data.businessLocation || !data.businessWhatsapp) {
      return res.status(400).json({ error: "Business name, location and WhatsApp are required." });
    }

    const number = wa(data.businessWhatsapp);
    if (number.length < 12) {
      return res.status(400).json({ error: "Please enter a valid Indian WhatsApp number." });
    }

    const html = buildSite(data);
    return res.status(200).json({
      ok: true,
      html,
      slug: data.businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50)
    });
  } catch (error) {
    return res.status(400).json({ error: "Invalid request." });
  }
};
