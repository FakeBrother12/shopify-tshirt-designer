import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { db } from "../db.server";
export async function action({ request }: ActionFunctionArgs) {
  const { topic, shop } = await authenticate.webhook(request);
  if (topic === "APP_UNINSTALLED" && shop) {
    await db.session.deleteMany({ where: { shop } });
    // Retain designs only according to the merchant's configured retention/privacy policy.
  }
  if (topic === "SHOP_REDACT" && shop) {
    await db.design.deleteMany({ where: { shop } });
    await db.session.deleteMany({ where: { shop } });
  }
  return new Response(null, { status: 200 });
}
