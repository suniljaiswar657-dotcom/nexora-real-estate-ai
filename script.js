const WHATSAPP_NUMBER = "917045326703";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  document.querySelectorAll(".wa-link").forEach((link) => {
    const message =
      link.dataset.message ||
      "Hi NEXORA, I want to know more about your Real Estate AI system.";

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    link.setAttribute("href", whatsappUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  setupWebsiteBuilder();
});

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normaliseWhatsapp(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length >= 12) return digits;
  if (digits.length === 10) return "91" + digits;
  return digits;
}

function createGeneratedWebsite(data) {
  const name = escapeHtml(data.businessName);
  const type = escapeHtml(data.businessType);
  const location = escapeHtml(data.businessLocation);
  const service = escapeHtml(data.businessService || "Property solutions");
  const description = escapeHtml(
    data.businessDescription ||
      `Professional ${data.businessType.toLowerCase()} services in ${data.businessLocation}.`
  );
  const whatsapp = normaliseWhatsapp(data.businessWhatsapp);

  const waText = encodeURIComponent(
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
*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;color:#102033;background:#f5f8fb;line-height:1.6}
.wrap{width:min(1100px,calc(100% - 32px));margin:auto}
header{padding:22px 0;background:#07111f;color:#fff}
.nav{display:flex;justify-content:space-between;align-items:center;gap:20px}.brand{font-size:22px;font-weight:800}
.hero{padding:85px 0;background:linear-gradient(135deg,#07111f,#12324b);color:#fff}
.badge{color:#65f5c8;font-size:12px;font-weight:800;letter-spacing:.14em}
h1{font-size:clamp(42px,7vw,72px);line-height:1.02;margin:15px 0;max-width:800px}
.hero p{max-width:650px;color:#c3d0df;font-size:18px}.btn{display:inline-block;padding:14px 22px;border-radius:10px;background:#65f5c8;color:#06120e;text-decoration:none;font-weight:800;margin-top:18px}
section{padding:65px 0}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.card{padding:25px;border-radius:18px;background:#fff;border:1px solid #dce5ee;box-shadow:0 12px 35px rgba(10,30,50,.06)}
.card h3{margin-top:0}.muted{color:#607086}.contact{background:#07111f;color:#fff;text-align:center}.contact p{color:#b9c7d6}
@media(max-width:700px){.grid{grid-template-columns:1fr}.hero{padding:60px 0}.nav{align-items:flex-start;flex-direction:column}}
</style>
</head>
<body>
<header><div class="wrap nav"><div class="brand">${name}</div><div>${location}</div></div></header>
<main>
<section class="hero"><div class="wrap">
<div class="badge">${type.toUpperCase()}</div>
<h1>${service}</h1>
<p>${description}</p>
<a class="btn" href="https://wa.me/${whatsapp}?text=${waText}" target="_blank" rel="noopener">Chat on WhatsApp →</a>
</div></section>
<section><div class="wrap">
<h2>What we offer</h2>
<div class="grid">
<div class="card"><h3>Professional Service</h3><p class="muted">${service} designed around your requirements.</p></div>
<div class="card"><h3>Local Support</h3><p class="muted">Serving customers in ${location} with direct communication.</p></div>
<div class="card"><h3>Quick Enquiry</h3><p class="muted">Connect directly on WhatsApp for availability, pricing and next steps.</p></div>
</div></div></section>
<section class="contact"><div class="wrap">
<h2>Ready to talk?</h2><p>Contact ${name} directly on WhatsApp.</p>
<a class="btn" href="https://wa.me/${whatsapp}?text=${waText}" target="_blank" rel="noopener">WhatsApp ${name}</a>
</div></section>
</main>
</body>
</html>`;
}

function setupWebsiteBuilder() {
  const form = document.getElementById("siteBuilderForm");
  const result = document.getElementById("builderResult");
  const preview = document.getElementById("websitePreview");
  const status = document.getElementById("builderStatus");
  const downloadButton = document.getElementById("downloadWebsite");

  if (!form || !result || !preview || !status || !downloadButton) return;

  let generatedHtml = "";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
      businessName: document.getElementById("businessName").value.trim(),
      businessType: document.getElementById("businessType").value,
      businessLocation: document.getElementById("businessLocation").value.trim(),
      businessWhatsapp: document.getElementById("businessWhatsapp").value.trim(),
      businessService: document.getElementById("businessService").value.trim(),
      businessDescription: document.getElementById("businessDescription").value.trim()
    };

    if (!data.businessName || !data.businessLocation || !data.businessWhatsapp) {
      status.textContent = "Please complete the required fields.";
      return;
    }

    const whatsapp = normaliseWhatsapp(data.businessWhatsapp);

    if (whatsapp.length < 12) {
      status.textContent = "Please enter a valid Indian WhatsApp number.";
      return;
    }

    status.textContent = "NEXORA is generating your website…";

    setTimeout(() => {
      generatedHtml = createGeneratedWebsite(data);
      preview.srcdoc = generatedHtml;
      result.hidden = false;
      status.textContent = "Website generated successfully.";
      result.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);
  });

  downloadButton.addEventListener("click", () => {
    if (!generatedHtml) return;

    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "nexora-generated-website.html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });
}
