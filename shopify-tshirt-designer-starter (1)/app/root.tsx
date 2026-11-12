import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
export const links: LinksFunction = () => [];
export default function App() {
  return <html lang="en"><head><Meta /><Links /></head><body><Outlet /><ScrollRestoration /><Scripts /></body></html>;
}
