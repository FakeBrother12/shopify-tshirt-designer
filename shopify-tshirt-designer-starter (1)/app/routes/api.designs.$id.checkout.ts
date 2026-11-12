import type { ActionFunctionArgs } from "react-router";
import { json } from "@react-router/node";
import { authenticate } from "../shopify.server";
import { db } from "../db.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const design = await db.design.findFirst({ where: { id: params.id, shop: session.shop } });
  if (!design) return json({ error: "Design not found" }, { status: 404 });

  // Verify variant belongs to a currently existing product before creating the draft order.
  const variantCheck = await admin.graphql(`#graphql
    query VerifyVariant($id: ID!) { productVariant(id: $id) { id title product { id title } } }`,
    { variables: { id: design.variantId } });
  const verified = await variantCheck.json();
  const variant = verified.data?.productVariant;
  if (!variant || variant.product.id !== design.productId) {
    return json({ error: "Selected variant is invalid for this product" }, { status: 400 });
  }

  const attrs = [
    { key: "Custom design ID", value: design.id },
    { key: "Front artwork key", value: design.frontObjectKey || "Pending artwork storage setup" },
    { key: "Back artwork key", value: design.backObjectKey || "Pending artwork storage setup" },
    { key: "Size", value: design.size || "" },
    { key: "Colour", value: design.color || "" }
  ];
  const mutation = await admin.graphql(`#graphql
    mutation CreateTShirtDraftOrder($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors { field message }
      }
    }`, {
      variables: {
        input: {
          email: design.customerEmail || undefined,
          note: `Custom T-shirt design ${design.id}`,
          tags: ["custom-tshirt", "designer-app"],
          lineItems: [{
            variantId: design.variantId,
            quantity: design.quantity,
            customAttributes: attrs
          }]
        }
      }
    });
  const result = await mutation.json();
  const errors = result.data?.draftOrderCreate?.userErrors ?? [];
  if (errors.length) return json({ error: errors.map((e: any) => e.message).join("; ") }, { status: 400 });
  const draft = result.data?.draftOrderCreate?.draftOrder;
  if (!draft?.invoiceUrl) return json({ error: "Shopify did not return an invoice URL" }, { status: 502 });

  await db.design.update({ where: { id: design.id }, data: {
    draftOrderId: draft.id, invoiceUrl: draft.invoiceUrl, status: "CHECKOUT_CREATED"
  }});
  return json({ draftOrderId: draft.id, checkoutUrl: draft.invoiceUrl });
}
