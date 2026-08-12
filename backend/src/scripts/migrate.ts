import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

import csv from "csv-parser";
import mongoose from "mongoose";
import { ProductModel } from "../modules/product/product.model";

// S3 Configuration for Image URLs
const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://s3.ap-south-2.amazonaws.com";
const S3_BUCKET = process.env.S3_BUCKET || "store4riders";

const formatS3Url = (imagePath: string) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${S3_ENDPOINT}/${S3_BUCKET}/media/catalog/product${imagePath}`;
};

const formatSlug = (name: string, sku: string) => {
  if (!name) return sku.toLowerCase();
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};

async function migrate() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected successfully!");

  const results: any[] = [];
  const csvFilePath = "C:\\Users\\vikur\\Downloads\\ridergears-ecom\\backup-data\\Clancsv1.csv";

  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found at ${csvFilePath}`);
    process.exit(1);
  }

  console.log("Reading CSV...");
  fs.createReadStream(csvFilePath)
    // The legacy file is usually comma-delimited if it's Clancsv1.csv, or tab if specified. 
    // Using csv-parser which automatically handles standard comma separation. 
    // If it fails, we will modify it to use separator: '\t'
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(`Parsed ${results.length} rows. Processing mapping...`);

      // 1. First pass: extract all items and organize parent/child pricing logic
      const processedMap = new Map();
      const simpleProducts: any[] = [];
      const configurableProducts: any[] = [];

      for (const row of results) {
        const sku = row.sku?.trim();
        if (!sku) continue;

        const name = row.name || sku;
        const price = parseFloat(row.price) || 0;
        const specialPrice = parseFloat(row.special_price) || 0;
        const weight = parseFloat(row.weight) || 0;
        const stockStatus = parseInt(row.is_in_stock) || 0;
        
        const baseImage = row.base_image ? formatS3Url(row.base_image) : "";
        const additionalImagesStr = row.additional_images || "";
        
        let images = [];
        if (baseImage) {
          images.push({ id: "base", url: baseImage, altText: name });
        }
        if (additionalImagesStr) {
          additionalImagesStr.split(",").forEach((img: string, idx: number) => {
            if (img.trim()) {
              images.push({ id: `add-${idx}`, url: formatS3Url(img.trim()), altText: `${name} ${idx}` });
            }
          });
        }

        const productData = {
          name,
          description: row.description || row.short_description || "",
          slug: row.url_key || formatSlug(name, sku),
          sku,
          basePrice: price,
          specialPrice: specialPrice,
          weight,
          stockStatus,
          productType: row.product_type || "simple",
          magentoCategories: row.categories || "",
          configurableVariations: row.configurable_variations || "",
          images,
          variants: []
        };

        if (productData.productType === "configurable") {
          configurableProducts.push(productData);
        } else {
          simpleProducts.push(productData);
        }

        processedMap.set(sku, productData);
      }

      // 2. Pricing Logic: Map child prices to parents if parent price is 0
      console.log("Applying pricing logic...");
      for (const parent of configurableProducts) {
        if (parent.basePrice === 0) {
          // Find a child product matching the parent SKU prefix
          const child = simpleProducts.find(p => p.sku.startsWith(parent.sku));
          if (child && child.basePrice > 0) {
            parent.basePrice = child.basePrice;
            parent.specialPrice = child.specialPrice;
          }
        }
      }

      // 3. Database Insertion
      console.log(`Starting Database Insertion for ${processedMap.size} products...`);
      let successCount = 0;
      let errorCount = 0;
      let BATCH_SIZE = 100;
      
      const allProducts = Array.from(processedMap.values());
      
      for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
        const batch = allProducts.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (productData) => {
            try {
              await ProductModel.findOneAndUpdate(
                { sku: productData.sku },
                productData,
                { upsert: true, new: true, runValidators: false }
              );
              successCount++;
            } catch (err: any) {
              console.error(`Error importing SKU: ${productData.sku}`, err.message);
              errorCount++;
            }
          })
        );
        
        console.log(`Progress: ${Math.min(i + BATCH_SIZE, allProducts.length)} / ${allProducts.length} | Success: ${successCount} | Error: ${errorCount}`);
      }

      console.log("=========================================");
      console.log(`Migration Complete!`);
      console.log(`Total Successfully Upserted: ${successCount}`);
      console.log(`Total Errors: ${errorCount}`);
      console.log("=========================================");
      process.exit(0);
    });
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
