import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const maxProducts = limitParam ? parseInt(limitParam, 10) : 36;
    
    let csvPath = path.join(process.cwd(), "..", "backup-data", "Clancsv1.csv");
    
    // Fallback if running from root via turbo
    if (!fs.existsSync(csvPath)) {
      csvPath = path.join(process.cwd(), "backup-data", "Clancsv1.csv");
    }

    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: "CSV backup file not found at " + csvPath }, { status: 404 });
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    
    // Robust CSV parsing for the entire file handling embedded newlines
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentVal = "";
    let inQuotes = false;
    
    for (let i = 0; i < fileContent.length; i++) {
      const char = fileContent[i];
      const nextChar = fileContent[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentVal.trim());
        currentVal = "";
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') i++; // skip \n of \r\n
        currentRow.push(currentVal.trim());
        if (currentRow.length > 1) { // Only push valid rows
          rows.push(currentRow);
          currentRow = [];
        }
        currentVal = "";
      } else {
        currentVal += char;
      }
    }
    if (currentVal || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      if (currentRow.length > 1) rows.push(currentRow);
    }

    if (rows.length === 0) {
      return NextResponse.json({ products: [] });
    }
    
    // Parse Headers
    const headers = rows[0];
    
    const skuIdx = headers.indexOf("sku");
    const nameIdx = headers.indexOf("name");
    const priceIdx = headers.indexOf("price");
    const specialPriceIdx = headers.indexOf("special_price");
    const descIdx = headers.indexOf("description");
    const baseImgIdx = headers.indexOf("base_image");
    const categoryIdx = headers.indexOf("categories");

    const products: any[] = [];
    
    for (let i = 1; i < rows.length && products.length < maxProducts; i++) {
      const cols = rows[i];
      if (cols.length < Math.max(skuIdx, nameIdx, priceIdx)) continue; // Skip malformed rows
      
      const sku = cols[skuIdx];
      const name = cols[nameIdx]?.replace(/^"|"$/g, '');
      const basePrice = parseFloat(cols[priceIdx]) || 0;

      
      // We only want products that have a name and a valid realistic price (>100)
      if (name && name !== '""' && basePrice > 100) {
        let imageUrl = cols[baseImgIdx];
        if (imageUrl && !imageUrl.startsWith("http")) {
          // If the image is a Magento path like /s/n/snkr--se-_9__5.jpg
          // we prefix it with the live S3/CDN domain if known, or fallback to placeholder for now
          // Assuming user will provide the correct CDN domain or we can just append it to a placeholder bucket
          imageUrl = `https://store4riders.com/media/catalog/product${imageUrl}`; 
        }

        const cleanName = name.replace(/^"|"$/g, '');
        // Prevent duplicates (e.g. child sizes showing up as duplicate standalone products)
        if (products.find(p => p.name === cleanName)) {
          continue;
        }

        products.push({
          id: sku,
          name: cleanName,
          brand: name.split(" ")[0] || "Brand", // Extract first word as brand roughly
          basePrice: basePrice,
          originalPrice: parseFloat(cols[specialPriceIdx]) || basePrice,
          category: (cols[categoryIdx] || "").split("/")[0] || "Riding Gear",
          images: [{ url: imageUrl, altText: name }],
          slug: sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: (cols[descIdx] || "").replace(/<[^>]*>?/gm, ''), // Strip HTML tags
        });
      }
    }

    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
