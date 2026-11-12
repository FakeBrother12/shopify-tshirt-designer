import { index, route } from "@react-router/dev/routes";
export default [
  index("routes/app._index.tsx"),
  route("healthz", "routes/healthz.ts"),
  route("auth/*", "routes/auth.$.tsx"),
  route("webhooks", "routes/webhooks.ts"),
  route("api/products", "routes/api.products.ts"),
  route("api/designs", "routes/api.designs.ts"),
  route("api/designs/:id/checkout", "routes/api.designs.$id.checkout.ts"),
  route("proxy", "routes/proxy.ts")
];
