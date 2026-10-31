import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("public/assets/banners/candidates");
const outputDir = path.resolve("public/assets/banners/optimized");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

await fs.mkdir(outputDir, { recursive: true });

const sources = (await fs.readdir(sourceDir, { withFileTypes: true }))
	.filter((entry) => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
	.map((entry) => entry.name)
	.sort((a, b) => a.localeCompare(b, "en"));

for (const inputName of sources) {
	const outputName = `${path.parse(inputName).name}.webp`;
	await sharp(path.join(sourceDir, inputName))
		.resize(1920, 1080, {
			fit: "cover",
			position: "center",
			withoutEnlargement: true,
		})
		.webp({ quality: 78, effort: 5 })
		.toFile(path.join(outputDir, outputName));
	console.log(`Optimized ${outputName}`);
}

console.log(`Optimized ${sources.length} banner images.`);
