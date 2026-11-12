import type { ActionFunctionArgs } from "react-router";
import { json } from "@react-router/node";
import { authenticate } from "../shopify.server";
import { saveDesign } from "../services/design.server";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  try {
    const design = await saveDesign(session.shop, await request.json());
    return json({ id: design.id, status: design.status }, { status: 201 });
  } catch (e: any) {
    return json({ error: e.message || "Could not save design" }, { status: 400 });
  }
}
