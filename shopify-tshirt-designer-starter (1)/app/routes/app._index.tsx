import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
export async function loader({ request }: LoaderFunctionArgs) {
  const { admin, session } = await authenticate.admin(request);
  const response = await admin.graphql(`#graphql
    query DesignerProducts {
      products(first: 30, query: "tag:customizable") {
        nodes { id title handle featuredImage { url } variants(first: 50) { nodes { id title price availableForSale } } }
      }
    }`);
  const data = await response.json();
  return { shop: session.shop, products: data.data?.products?.nodes ?? [] };
}
export default function Index() {
  const { shop, products } = useLoaderData<typeof loader>();
  return <main style={{fontFamily:"Arial",padding:32,maxWidth:1000,margin:"auto"}}>
    <h1>T-Shirt Designer</h1><p>Connected store: <b>{shop}</b></p>
    <p>Products tagged <code>customizable</code> are available to the designer storefront.</p>
    <ul>{products.map((p:any)=><li key={p.id}>{p.title} — {p.variants.nodes.length} variants</li>)}</ul>
    <p>Next: add the Theme App Extension block to your product template and tag T-shirts with <b>customizable</b>.</p>
  </main>;
}
