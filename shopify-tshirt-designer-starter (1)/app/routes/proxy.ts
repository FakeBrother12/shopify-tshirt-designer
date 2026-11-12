import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { json } from "@react-router/node";

// Shopify App Proxy signature verification is handled by the official app library.
// Public storefront requests must be authenticated as app-proxy requests, never trusted by origin alone.
export async function loader({ request }: LoaderFunctionArgs) {
  const proxy = await authenticate.public.appProxy(request);
  return json({ ok: true, shop: proxy.session?.shop ?? null, message: "Designer proxy endpoint ready" });
}
export async function action({ request }: ActionFunctionArgs) {
  const proxy = await authenticate.public.appProxy(request);
  return json({ ok: true, shop: proxy.session?.shop ?? null, message: "Use the authenticated proxy API routes to submit designs" });
}
