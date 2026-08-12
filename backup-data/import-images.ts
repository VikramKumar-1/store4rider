import "dotenv/config";
import { getPayload } from "payload";
import config from "./src/payload.config";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const IMAGES_DIR =
  "C:\\Users\\vikur\\OneDrive\\Desktop\\product1\\product\\product";
const BATCH_SIZE = 20; // safe concurrency

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      // Ignore macos hidden files and non-images
      if (
        !file.startsWith("._") &&
        (file.endsWith(".jpg") ||
          file.endsWith(".png") ||
          file.endsWith(".jpeg") ||
          file.endsWith(".webp"))
      ) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

async function run() {
  const payload = await getPayload({ config });

  console.log(`Scanning directory: ${IMAGES_DIR}...`);
  const allFiles = await getAllFiles(IMAGES_DIR);
  console.log(
    `Found ${allFiles.length} valid images. Starting upload to Payload & AWS S3...`,
  );

  let successCount = 0;

  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (filePath) => {
        try {
          const filename = path.basename(filePath);

          // Check if media already exists to prevent duplicates
          const existing = await payload.find({
            collection: "media",
            where: {
              filename: {
                equals: filename,
              },
            },
          });

          if (existing.totalDocs > 0) {
            successCount++;
            return;
          }

          // Upload to S3 and create record
          await payload.create({
            collection: "media",
            data: {
              alt: filename,
            },
            filePath: filePath,
          });
          successCount++;
        } catch (err) {
          console.error("Error uploading:", filePath, err.message);
        }
      }),
    );

    console.log(
      `Progress: ${Math.min(i + BATCH_SIZE, allFiles.length)} / ${allFiles.length} | Uploaded: ${successCount}`,
    );
  }

  console.log(`Finished uploading ${successCount} images to S3!`);
  process.exit(0);
}

run();
