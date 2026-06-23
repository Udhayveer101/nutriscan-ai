/**
 * Open Food Facts API integration for barcode lookups.
 * Falls back gracefully if product not found.
 */

export interface ProductData {
  name: string;
  brand: string;
  imageUrl?: string;
  ingredientsText: string;
  nutritionGrade?: string;
  novaGroup?: number;
  nutriments?: {
    sugars_100g?: number;
    sodium_100g?: number;
    fat_100g?: number;
    proteins_100g?: number;
  };
}

export async function lookupBarcode(barcode: string): Promise<ProductData | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      {
        headers: {
          "User-Agent": "NutriScanAI/1.0 (contact@nutriscan.ai)",
        },
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const product = data.product;

    return {
      name: product.product_name || product.product_name_en || "Unknown Product",
      brand: product.brands || "Unknown Brand",
      imageUrl: product.image_url || product.image_front_url,
      ingredientsText: product.ingredients_text || product.ingredients_text_en || "",
      nutritionGrade: product.nutrition_grade_fr,
      novaGroup: product.nova_group,
      nutriments: {
        sugars_100g: product.nutriments?.sugars_100g,
        sodium_100g: product.nutriments?.sodium_100g,
        fat_100g: product.nutriments?.fat_100g,
        proteins_100g: product.nutriments?.proteins_100g,
      },
    };
  } catch {
    return null;
  }
}

export function isValidBarcode(barcode: string): boolean {
  return /^[0-9]{8,14}$/.test(barcode.trim());
}
