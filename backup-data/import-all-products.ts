import "dotenv/config";
import { getPayload } from "payload";
import config from "./src/payload.config";
import fs from "fs";
import Papa from "papaparse";
import path from "path";

async function run() {
  const payload = await getPayload({ config });

  console.log("Reading full products CSV with PapaParse...");
  const fileContent = fs.readFileSync(
    path.join(process.cwd(), "../products.csv"),
    "utf8",
  );

  Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    delimiter: "\t",
    complete: async (parsed) => {
      const results = parsed.data as any[];
      console.log(`Parsed ${results.length} rows. Starting massive import...`);

      const BATCH_SIZE = 50;
      let successCount = 0;
      let noImageCount = 0;

      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (row) => {
            try {
              const title = row.name || row.sku;
              if (!title) return;

              const existing = await payload.find({
                collection: "products",
                where: { title: { equals: title } },
              });

              let price = parseFloat(row.price || "0");
              if (row.product_type === "configurable" && price === 0) {
                // find a child simple product to get the price
                const child = results.find(
                  (d: any) =>
                    d.product_type === "simple" &&
                    d.sku &&
                    d.sku.startsWith(row.sku),
                );
                if (child) {
                  price = parseFloat(child.price || "0");
                }
              }

              const productData = {
                title,
                priceInUSD: price,
                magentoImage: row.base_image || null,
                sku: row.sku || "",
                magentoHtmlDescription: row.description || "",
                stockStatus: row.is_in_stock || "1",
                magentoCategories: row.categories || "",
                specialPrice: row.special_price
                  ? parseFloat(row.special_price)
                  : null,
                weight: row.weight || "",
                productType: row.product_type || "simple",
                configurableVariations: row.configurable_variations || "",
                additionalImages: row.additional_images || "",
              };

              if (existing.docs.length > 0) {
                await payload.update({
                  collection: "products",
                  id: existing.docs[0].id,
                  data: productData,
                });
              } else {
                await payload.create({
                  collection: "products",
                  data: productData,
                });
              }
              successCount++;
            } catch (err) {
              console.error(`Error processing sku ${row.sku}:`, err.message);
            }
          }),
        );

        console.log(
          `Progress: ${Math.min(i + BATCH_SIZE, results.length)} / ${results.length} | Completed: ${successCount}`,
        );
      }

      console.log(
        `Migration Complete! Total inserted/updated: ${successCount}`,
      );
      process.exit(0);
    },
  });
}

run();
