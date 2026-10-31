<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

type Petal = {
	x: number;
	y: number;
	size: number;
	speed: number;
	drift: number;
	rotation: number;
	spin: number;
	opacity: number;
};

let enabled = true;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D | null = null;
let petals: Petal[] = [];
let frame = 0;
let width = 0;
let height = 0;

const storageKey = "ash-sakura-enabled";

function createPetal(fromTop = false): Petal {
	return {
		x: Math.random() * width,
		y: fromTop ? -20 - Math.random() * height * 0.25 : Math.random() * height,
		size: 4 + Math.random() * 5,
		speed: 0.45 + Math.random() * 0.8,
		drift: -0.35 + Math.random() * 0.7,
		rotation: Math.random() * Math.PI * 2,
		spin: -0.02 + Math.random() * 0.04,
		opacity: 0.35 + Math.random() * 0.45,
	};
}

function resize() {
	if (!canvas) return;
	const ratio = Math.min(window.devicePixelRatio || 1, 2);
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = Math.floor(width * ratio);
	canvas.height = Math.floor(height * ratio);
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	context = canvas.getContext("2d");
	context?.setTransform(ratio, 0, 0, ratio, 0, 0);
	const count = Math.min(
		window.innerWidth < 768 ? 28 : 52,
		Math.floor(width / 22),
	);
	petals = Array.from({ length: count }, () => createPetal(false));
}

function drawPetal(petal: Petal) {
	if (!context) return;
	context.save();
	context.translate(petal.x, petal.y);
	context.rotate(petal.rotation);
	context.scale(1, 0.65);
	context.beginPath();
	context.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
	context.fillStyle = `rgba(244, 151, 178, ${petal.opacity})`;
	context.fill();
	context.restore();
}

function animate() {
	if (!context) return;
	context.clearRect(0, 0, width, height);
	if (enabled && !document.hidden) {
		for (const petal of petals) {
			petal.y += petal.speed;
			petal.x += petal.drift + Math.sin(petal.y / 70) * 0.25;
			petal.rotation += petal.spin;
			if (petal.y > height + 20 || petal.x < -30 || petal.x > width + 30) {
				Object.assign(petal, createPetal(true));
			}
			drawPetal(petal);
		}
	}
	frame = requestAnimationFrame(animate);
}

function toggle() {
	enabled = !enabled;
	localStorage.setItem(storageKey, String(enabled));
}

onMount(() => {
	const reducedMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	const stored = localStorage.getItem(storageKey);
	enabled = stored === null ? !reducedMotion : stored === "true";
	resize();
	window.addEventListener("resize", resize);
	frame = requestAnimationFrame(animate);
	return () => {
		window.removeEventListener("resize", resize);
		cancelAnimationFrame(frame);
	};
});
</script>

<canvas bind:this={canvas} aria-hidden="true" class="pointer-events-none fixed inset-0 z-40"></canvas>
<button on:click={toggle} aria-label={enabled ? "关闭樱花效果" : "开启樱花效果"} title={enabled ? "关闭樱花效果" : "开启樱花效果"}
	class:current-theme-btn={enabled}
	class="btn-plain scale-animation relative z-50 rounded-lg w-11 h-11 active:scale-90">
	<Icon icon={enabled ? "material-symbols:local-florist-rounded" : "material-symbols:local-florist-outline-rounded"} class="text-[1.25rem]"></Icon>
</button>
