import { MeiliSearch } from "meilisearch";
import { logger } from "../utils/logger";

const HOST = process.env.MEILISEARCH_HOST;
const KEY = process.env.MEILISEARCH_KEY;

let meiliClient: MeiliSearch | null = null;

if (HOST) {
  meiliClient = new MeiliSearch({ host: HOST, apiKey: KEY });
} else {
  logger.warn("MEILISEARCH_HOST not set. Search will be mocked.");
}

export const indexProduct = async (product: any) => {
  if (!meiliClient) return;
  try {
    await meiliClient.index("products").addDocuments([product]);
  } catch (err) {
    logger.error("Meilisearch index error", err);
  }
};

export const searchProducts = async (query: string) => {
  if (!meiliClient) return { hits: [] };
  try {
    return await meiliClient.index("products").search(query);
  } catch (err) {
    logger.error("Meilisearch search error", err);
    return { hits: [] };
  }
};
