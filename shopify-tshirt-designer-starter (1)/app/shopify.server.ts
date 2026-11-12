import "@shopify/shopify-app-react-router/adapters/node";
import { shopifyApp } from "@shopify/shopify-app-react-router";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { db } from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: "2026-10",
  scopes: (process.env.SCOPES || "read_products,write_draft_orders").split(","),
  appUrl: process.env.SHOPIFY_APP_URL!,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(db),
  distribution: "AppStore",
  future: { unstable_newEmbeddedAuthStrategy: true }
});
export default shopify;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
