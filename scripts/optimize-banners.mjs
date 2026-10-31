import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = path.resolve("public/assets/banners/candidates");
const outputDir = path.resolve("public/assets/banners/optimized");
const sources = [
	["banner-test.png", "banner-01-spring-reading.webp"],
	["banner-02-rooftop.png", "banner-02-rooftop.webp"],
	["banner-03-rain-train.png", "banner-03-rain-train.webp"],
	["banner-04-coding-night.png", "banner-04-coding-night.webp"],
	["banner-05-autumn-shrine.png", "banner-05-autumn-shrine.webp"],
	["banner-06-seaside.png", "banner-06-seaside.webp"],
];

await fs.mkdir(outputDir, { recursive: true });

for (const [inputName, outputName] of sources) {
	await sharp(path.join(sourceDir, inputName))
		.resize(1920, 1080, { fit: "cover", position: "center" })
		.webp({ quality: 82, effort: 5 })
		.toFile(path.join(outputDir, outputName));
	console.log(`Optimized ${outputName}`);
}
