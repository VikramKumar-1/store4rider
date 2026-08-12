import fs from "fs";
import path from "path";
// @ts-ignore
import Papa from "papaparse";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: path.join(process.cwd(), "..", ".env") });

import { ProductModel } from "../modules/product/product.model"; 

async function runMigration() {
  try {
    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/store4riders";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");

    // 2. Read the CSV file
    const csvPath = path.join(process.cwd(), "..", "backup-data", "Clancsv1.csv");
    if (!fs.existsSync(csvPath)) {
      console.error(`Error: CSV file not found at path: ${csvPath}`);
      process.exit(1);
    }

    console.log("Reading full products CSV with PapaParse...");
    const fileContent = fs.readFileSync(csvPath, "utf8");

    // 3. Parse the CSV file
    Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed: any) => {
        const results = parsed.data as any[];
        console.log(`Parsed ${results.length} total rows from CSV.`);

        // Filter: We only want to create parent documents for configurable products, 
        // or simple products that are meant to be visible (standalone).
        const topLevelProducts = results.filter((row) => {
          if (!row.sku) return false;
          // visibility "4" or "Catalog, Search" means it's a standalone product
          const isVisible = row.visibility === "4" || row.visibility?.includes("Catalog");
          return row.product_type === "configurable" || (row.product_type === "simple" && isVisible);
        });

        console.log(`Found ${topLevelProducts.length} top-level parent products to migrate...`);

        const BATCH_SIZE = 50;
        let successCount = 0;
        let failureCount = 0;

        // 4. Process in batches
        for (let i = 0; i < topLevelProducts.length; i += BATCH_SIZE) {
          const batch = topLevelProducts.slice(i, i + BATCH_SIZE);

          await Promise.all(
            batch.map(async (row) => {
              try {
                const name = row.name || row.sku;

                // CRITICAL PRICING LOGIC
                let price = parseFloat(row.price || "0");
                
                // --- NEW: VARIANTS EXTRACTION ---
                const variantsArray: any[] = [];
                
                if (row.product_type === "configurable") {
                  let lowestChildPrice = Infinity;

                  // Parse configurable_variations string
                  // Format example: "sku=CL-SN-SE-WP-42,size=42|sku=CL-SN-SE-WP-43,size=43"
                  if (row.configurable_variations) {
                    const variations = row.configurable_variations.split("|");
                    
                    for (const variation of variations) {
                      const parts = variation.split(",");
                      let childSku = "";
                      const attributes: Record<string, string> = {};

                      for (const part of parts) {
                        const [key, val] = part.split("=");
                        if (key === "sku") childSku = val;
                        else if (key && val) attributes[key] = val;
                      }

                      if (childSku) {
                        // Find this child simple product in the full CSV data
                        const childRow = results.find((d: any) => d.sku === childSku);
                        if (childRow) {
                          const childPrice = parseFloat(childRow.price || "0");
                          const childStock = parseInt(childRow.qty || "0", 10);
                          
                          if (childPrice > 0 && childPrice < lowestChildPrice) {
                            lowestChildPrice = childPrice;
                          }

                          variantsArray.push({
                            id: childSku,
                            sku: childSku,
                            price: childPrice,
                            stock: isNaN(childStock) ? 0 : childStock,
                            attributes: attributes
                          });
                        }
                      }
                    }
                  }

                  // Fallback pricing if parent price is 0
                  if (price === 0 && lowestChildPrice !== Infinity) {
                    price = lowestChildPrice;
                  }
                }

                const weightNum = parseFloat(row.weight);
                const stockStatusNum = parseInt(row.is_in_stock || "0", 10);
                
                // Extract all images accurately and map to absolute S3 URLs
                const imagesArray = [];
                const formatUrl = (imgStr: string) => {
                  let cleanUrl = imgStr.trim();
                  if (cleanUrl && !cleanUrl.startsWith("http")) {
                    cleanUrl = `https://store4riders.com/media/catalog/product${cleanUrl}`;
                  }
                  return cleanUrl;
                };

                if (row.base_image) {
                  imagesArray.push({ url: formatUrl(row.base_image), altText: name });
                }
                
                if (row.additional_images) {
                  const extraImages = row.additional_images.split(",");
                  for (const extra of extraImages) {
                    const cleanUrl = formatUrl(extra);
                    if (cleanUrl && !imagesArray.find(img => img.url === cleanUrl)) {
                      imagesArray.push({ url: cleanUrl, altText: `${name} - additional view` });
                    }
                  }
                }
                
                // Construct mapped document data
                const productData = {
                  name: name,
                  slug: row.url_key || row.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  sku: row.sku,
                  description: row.description || "",
                  stockStatus: isNaN(stockStatusNum) ? 0 : stockStatusNum,
                  weight: isNaN(weightNum) ? null : weightNum,
                  
                  magentoCategories: row.categories || "",
                  productType: row.product_type || "simple",
                  configurableVariations: row.configurable_variations || "",
                  
                  shortDescription: row.short_description || "",
                  metaTitle: row.meta_title || "",
                  metaKeywords: row.meta_keywords || "",
                  metaDescription: row.meta_description || "",
                  relatedSkus: row.related_skus ? row.related_skus.split(",").map((s: string) => s.trim()) : [],
                  upsellSkus: row.upsell_skus ? row.upsell_skus.split(",").map((s: string) => s.trim()) : [],
                  brand: row.manufacturer || name.split(" ")[0] || "Brand",
                  
                  basePrice: price,
                  specialPrice: row.special_price ? parseFloat(row.special_price) : null,
                  
                  images: imagesArray,
                  variants: variantsArray, // Inject the newly grouped variants array!
                };

                // Upsert operation
                await ProductModel.findOneAndUpdate(
                  { sku: row.sku },
                  { $set: productData },
                  { upsert: true, new: true }
                );

                successCount++;
              } catch (err: any) {
                console.error(`[ERROR] Failed to process SKU ${row.sku}: ${err.message}`);
                failureCount++;
              }
            })
          );

          console.log(`Progress: ${Math.min(i + BATCH_SIZE, topLevelProducts.length)} / ${topLevelProducts.length} | Completed: ${successCount} | Failed: ${failureCount}`);
        }

        console.log(`Migration Complete! Total successful inserts/updates: ${successCount}. Failures: ${failureCount}`);
        
        await mongoose.disconnect();
        process.exit(0);
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error);
        process.exit(1);
      }
    });

  } catch (err: any) {
    console.error("Migration fatal error:", err);
    process.exit(1);
  }
}

runMigration();
