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

const outputNames = sources.map((inputName) => `${path.parse(inputName).name}.webp`);
if (new Set(outputNames).size !== outputNames.length) {
	throw new Error("Candidate image names must be unique before the file extension.");
}

const expectedOutputs = new Set(outputNames);
for (const entry of await fs.readdir(outputDir, { withFileTypes: true })) {
	if (entry.isFile() && entry.name.endsWith(".webp") && !expectedOutputs.has(entry.name)) {
		await fs.unlink(path.join(outputDir, entry.name));
		console.log(`Removed stale ${entry.name}`);
	}
}

const optimizedImages = [];
for (const [index, inputName] of sources.entries()) {
	const outputName = outputNames[index];
	const outputPath = path.join(outputDir, outputName);
	await sharp(path.join(sourceDir, inputName))
		.resize(1920, 1080, {
			fit: "cover",
			position: "center",
			withoutEnlargement: true,
		})
		.webp({ quality: 78, effort: 5 })
		.toFile(outputPath);
	const metadata = await sharp(outputPath).metadata();
	const stats = await fs.stat(outputPath);
	optimizedImages.push({
		file: inputName,
		output: outputName,
		bytes: stats.size,
		width: metadata.width,
		height: metadata.height,
	});
	console.log(`Optimized ${outputName}`);
}

const generatedAt = new Date();
await fs.writeFile(
	path.join(sourceDir, "manifest.json"),
	`${JSON.stringify(
		{
			count: optimizedImages.length,
			generatedAt: generatedAt.toISOString(),
			images: optimizedImages,
		},
		null,
		2,
	)}\n`,
);

const figures = optimizedImages
	.map(
		(image) => `  <figure>
    <a href="${image.file}" target="_blank" rel="noreferrer"><img loading="lazy" src="${image.file}" alt="${image.file}"></a>
    <figcaption><span>${image.file}</span><span>${image.width}x${image.height} · ${Math.round(image.bytes / 1024)}KB</span></figcaption>
  </figure>`,
	)
	.join("\n");
const totalBytes = optimizedImages.reduce((sum, image) => sum + image.bytes, 0);
const reviewPage = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>背景图候选 · ${optimizedImages.length} 张</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;font:14px/1.6 system-ui,"Segoe UI","Microsoft YaHei",sans-serif;background:#0d0f14;color:#e6e8ee}
  header{padding:28px 24px;border-bottom:1px solid #1e2230}
  h1{margin:0 0 6px;font-size:20px}
  .meta{color:#8b93a7;font-size:13px}
  .grid{display:grid;gap:14px;padding:24px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
  figure{margin:0;background:#151925;border:1px solid #1e2230;border-radius:8px;overflow:hidden;transition:.2s}
  figure:hover{transform:translateY(-3px);border-color:#3a4560;box-shadow:0 10px 24px #0008}
  img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#1b2030}
  figcaption{display:flex;justify-content:space-between;gap:8px;padding:10px 12px;font-size:12px;color:#8b93a7}
  a{color:#7fa6ff;text-decoration:none}
</style></head>
<body>
<header>
  <h1>背景图候选</h1>
  <div class="meta">共 ${optimizedImages.length} 张 · ${(totalBytes / 1024 / 1024).toFixed(1)} MB · 生成于 ${generatedAt.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}</div>
</header>
<div class="grid">
${figures}
</div>
</body></html>
`;
await fs.writeFile(path.join(sourceDir, "index.html"), reviewPage);

console.log(`Optimized ${sources.length} banner images.`);
