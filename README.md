# NEXORA Real Estate AI

NEXORA is a real-estate-focused AI website automation product.

## Current architecture

- Static landing page
- Automatic website builder UI
- Serverless website-generation API at `/api/generate.js`
- Vercel-ready configuration
- Razorpay intentionally excluded for now

## Target customer flow

Customer → Build My Website → Business details → Generate → Preview → Publish → Live URL

The current API generates the website HTML. Live publishing requires connecting a hosting/deployment account; no secret keys are stored in this repository.

## Local/API test

POST JSON to `/api/generate`:

```json
{
  "businessName": "Sharma Properties",
  "businessType": "Real Estate",
  "businessLocation": "Thane, Maharashtra",
  "businessWhatsapp": "9876543210",
  "businessService": "Residential Properties",
  "businessDescription": "Helping buyers and sellers find suitable properties."
}
```

