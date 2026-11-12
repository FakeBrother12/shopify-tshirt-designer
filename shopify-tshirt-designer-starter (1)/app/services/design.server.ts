import { z } from "zod";
import { db } from "../db.server";

const DesignSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  productTitle: z.string().min(1).max(300),
  variantTitle: z.string().max(300).optional(),
  quantity: z.number().int().min(1).max(20).default(1),
  size: z.string().max(80).optional(),
  color: z.string().max(80).optional(),
  customerEmail: z.string().email().optional().or(z.literal("")),
  designJson: z.record(z.string(), z.unknown()),
  frontArtworkBase64: z.string().optional(),
  backArtworkBase64: z.string().optional()
});

export async function saveDesign(shop: string, input: unknown) {
  const parsed = DesignSchema.parse(input);
  // Artwork storage adapter intentionally fails closed until private S3-compatible storage is configured.
  // Never silently store print files in a public URL or browser-only storage.
  if ((parsed.frontArtworkBase64 || parsed.backArtworkBase64) && !process.env.S3_BUCKET) {
    throw new Error("Private artwork storage is not configured. Set S3-compatible storage before accepting designs.");
  }
  return db.design.create({
    data: {
      shop, productId: parsed.productId, variantId: parsed.variantId,
      productTitle: parsed.productTitle, variantTitle: parsed.variantTitle,
      quantity: parsed.quantity, size: parsed.size, color: parsed.color,
      customerEmail: parsed.customerEmail || null, designJson: parsed.designJson
    }
  });
}
