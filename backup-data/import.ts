import "dotenv/config";
import { getPayload } from "payload";
import config from "./src/payload.config";
import fs from "fs";
import csv from "csv-parser";
import path from "path";

async function run() {
  const payload = await getPayload({ config });
  const results: any[] = [];

  console.log("Reading CSV...");
  fs.createReadStream(path.join(process.cwd(), "../products.csv"))
    .pipe(csv({ separator: "\t" }))
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      console.log(
        `Parsed ${results.length} rows. Starting import in batches of 50...`,
      );

      const BATCH_SIZE = 50;
      let successCount = 0;

      for (let i = 0; i < results.length; i += BATCH_SIZE) {
        const batch = results.slice(i, i + BATCH_SIZE);

        await Promise.all(
          batch.map(async (row) => {
            try {
              const title = row.name || row.sku;
              if (!title) return;

              await payload.create({
                collection: "products",
                data: {
                  title: title,
                  // Add minimum required fields for search test
                },
              });
              successCount++;
            } catch (err) {
              console.error("Error importing:", row.sku, err.message);
            }
          }),
        );

        console.log(
          `Progress: ${i + batch.length} / ${results.length} | Success: ${successCount}`,
        );
      }

      console.log(`Migration Complete! Total inserted: ${successCount}`);
      process.exit(0);
    });
}

run();
