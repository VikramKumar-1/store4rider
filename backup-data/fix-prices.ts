import "dotenv/config";
import { getPayload } from "payload";
import config from "./src/payload.config";

async function run() {
  const payload = await getPayload({ config });

  const { docs: configurableProducts } = await payload.find({
    collection: "products",
    where: {
      productType: { equals: "configurable" },
      priceInUSD: { equals: 0 },
    },
    limit: 1000,
  });

  console.log(
    `Found ${configurableProducts.length} configurable products with price 0`,
  );

  let successCount = 0;

  for (const product of configurableProducts) {
    if (!product.configurableVariations) continue;

    // Extract child SKUs
    const variations = product.configurableVariations.split("|");
    const childSkus = variations
      .map((v) => {
        const match = v.match(/sku=([^,]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (childSkus.length === 0) continue;

    // Find children in DB
    const { docs: children } = await payload.find({
      collection: "products",
      where: {
        sku: { in: childSkus },
      },
    });

    const prices = children.map((c) => c.priceInUSD || 0).filter((p) => p > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      console.log(`Updating ${product.sku} price to ${minPrice}`);

      await payload.update({
        collection: "products",
        id: product.id,
        data: {
          priceInUSD: minPrice,
        },
      });
      successCount++;
    } else {
      console.log(`Could not find any child prices for ${product.sku}`);
    }
  }

  console.log(`Fixed prices for ${successCount} products.`);
  process.exit(0);
}

run();
