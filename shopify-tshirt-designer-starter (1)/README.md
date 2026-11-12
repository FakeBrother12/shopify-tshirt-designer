# Shopify T-Shirt Designer — starter application

This repository is a backend-first Shopify app scaffold for a private custom-T-shirt workflow.

## What is included

- Shopify React Router app authentication scaffold with Prisma session storage.
- Product/variant query for products tagged `customizable`.
- Design metadata persistence in PostgreSQL.
- Draft Order creation using an existing Shopify variant.
- Invoice URL returned by Shopify.
- Webhook route for uninstall and shop-redaction handling.
- Theme app extension block that displays a Customize button on tagged product pages.
- Render deployment configuration.

## Important implementation status

This is a deployable **starter scaffold**, not yet a finished production designer. It does not yet include the complete drag/resize editor, high-resolution print renderer, S3 upload adapter, merchant artwork dashboard, or end-to-end public storefront app-proxy submission flow. Artwork upload deliberately fails closed until private storage is configured. Do not enable customer purchases until those pieces are completed and tested.

The Draft Order route currently expects an authenticated app-admin request. A storefront customer cannot call it directly. Implement the signed Shopify App Proxy customer submission route and server-side design ownership/anti-abuse checks before launch. Never put an Admin API token in theme JavaScript.

## Prerequisites

- Node.js 22+
- npm
- Shopify Partner/Dev Dashboard access
- A Shopify development store
- PostgreSQL
- Render account
- Private S3-compatible object storage (AWS S3, Cloudflare R2 private bucket, or equivalent)

## Local setup

1. Create a Shopify app in the Shopify Dev Dashboard.
2. Configure the app URL and OAuth callback URLs from `shopify.app.toml`.
3. Copy `.env.example` to `.env` and fill in credentials.
4. Run:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```

5. Follow Shopify CLI prompts to install the app on your development store.

## Store configuration

Tag the T-shirt products that should show the button with:

`customizable`

The app queries products with this tag. Confirm `read_products` and `write_draft_orders` scopes are approved.

## Theme extension

The extension source is in `extensions/tshirt-customizer`. Generate/register it through Shopify CLI and deploy it with the app. Add the block to the product template in Theme Editor. The block only renders for products tagged `customizable`.

The current button links to the configured app proxy path. The hosted designer route and signed proxy submit endpoint still need to be implemented before production use.

## Render deployment

1. Push this project to a private GitHub repository.
2. Create a Render Blueprint from `render.yaml`.
3. Set `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, and `SHOPIFY_APP_URL`.
4. Set the same production URL in Shopify Dev Dashboard and `shopify.app.toml`.
5. Deploy and verify `/healthz` after adding a health route (or configure Render to use `/` until then).
6. Run Prisma migrations.

## Required production work before launch

- Finish OAuth config against the current Shopify CLI-generated template and validate it with `shopify app dev`.
- Implement designer UI using Fabric.js or Konva with front/back canvas, layers, upload, text, transform controls, undo/redo.
- Render artwork server-side or in a controlled browser worker at a known print pixel size and DPI metadata.
- Add private object storage adapter and short-lived signed download URLs.
- Add signed App Proxy endpoint for storefront submissions; verify proxy signature and bind shop/customer/session.
- Add request limits, upload scanning, MIME sniffing, ownership checks, and abuse protection.
- Add admin dashboard for artwork preview/download and order status.
- Test Draft Order invoice behavior, taxes, shipping, inventory, and payment flow in the target store.
- Add `/healthz` route or update Render healthCheckPath.
- Complete Shopify privacy webhooks and data retention policy.

## Draft Order behavior

The app creates a Draft Order with the existing Shopify variant ID, quantity, and line item custom attributes. It does not publish a new catalog product. Shopify returns an invoice URL for private checkout. Inventory and fulfillment behavior must be verified in the merchant's store before launch.
