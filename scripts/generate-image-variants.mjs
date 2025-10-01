import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve("public", "images", "timeline");
const VARIANT_WIDTHS = [480, 960, 1440];
const PLACEHOLDER_WIDTH = 24;
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const pendingTasks = [];

const withSuffix = (filePath, suffix, extOverride) => {
  const parsed = path.parse(filePath);
  const ext = extOverride ?? parsed.ext;
  return path.join(parsed.dir, `${parsed.name}${suffix}${ext}`);
};

const shouldProcess = async (src, dest) => {
  try {
    const [srcStat, destStat] = await Promise.all([
      fs.stat(src),
      fs.stat(dest),
    ]);
    return srcStat.mtimeMs > destStat.mtimeMs;
  } catch (error) {
    return true;
  }
};

const processImage = async (filePath) => {
  const absolutePath = path.resolve(ROOT, filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    return;
  }

  const relativeDir = path.dirname(absolutePath);
  await fs.mkdir(relativeDir, { recursive: true });

  for (const width of VARIANT_WIDTHS) {
  const outputPath = withSuffix(absolutePath, `-${width}w`, ".webp");
    if (!(await shouldProcess(absolutePath, outputPath))) {
      continue;
    }
    pendingTasks.push(
      sharp(absolutePath)
        .resize({ width, fit: "inside", withoutEnlargement: true })
        .toFormat(ext === ".webp" ? "webp" : "webp", {
          quality: 80,
          effort: 4,
        })
        .toFile(outputPath)
    );
  }

  const placeholderPath = withSuffix(absolutePath, "-placeholder", ".webp");
  if (await shouldProcess(absolutePath, placeholderPath)) {
    pendingTasks.push(
      sharp(absolutePath)
        .resize({ width: PLACEHOLDER_WIDTH, fit: "inside", withoutEnlargement: true })
        .blur(10)
        .toFormat("webp", { quality: 50, effort: 4 })
        .toFile(placeholderPath)
    );
  }
};

const traverse = async (current = ROOT) => {
  const entries = await fs.readdir(current, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await traverse(entryPath);
      } else if (entry.isFile()) {
        const relative = path.relative(ROOT, entryPath);
        await processImage(relative);
      }
    })
  );
};

const run = async () => {
  console.time("image-variants");
  await traverse();
  await Promise.all(pendingTasks);
  console.timeEnd("image-variants");
  console.log(
    `Processed ${pendingTasks.length} operations across ${VARIANT_WIDTHS.length} variants + placeholder.`
  );
};

run().catch((error) => {
  console.error("Failed to generate image variants", error);
  process.exit(1);
});
