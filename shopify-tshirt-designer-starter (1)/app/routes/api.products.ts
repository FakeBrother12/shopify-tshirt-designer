import type { LoaderFunctionArgs } from "react-router";
import { json } from "@react-router/node";
import { authenticate } from "../shopify.server";
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin } = await authenticate.admin(request);
  const url = new URL(request.url);
  const productId = url.searchParams.get("id");
  const query = productId ? `id:${productId}` : "tag:customizable";
  const res = await admin.graphql(`#graphql
    query DesignerProducts($query: String!) {
      products(first: 50, query: $query) {
        nodes { id title handle description featuredImage { url altText } images(first: 10) { nodes { url altText } }
          variants(first: 100) { nodes { id title sku price availableForSale selectedOptions { name value } } }
        }
      }
    }`, { variables: { query } });
  const body = await res.json();
  return json({ products: body.data?.products?.nodes ?? [] });
}
