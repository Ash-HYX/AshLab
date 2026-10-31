<script lang="ts">
import Icon from "@iconify/svelte";
import { onMount } from "svelte";

type PostIndex = {
	url: string;
	title: string;
	description: string;
	tags: string[];
	categories: string[];
	year: number;
};

type DisplayResult = PostIndex & { excerpt?: string };

export let posts: PostIndex[] = [];

let keyword = "";
let category = "";
let tag = "";
let year = "";
let results: DisplayResult[] = posts;
let searching = false;
let pagefindReady = false;

const categories = [
	...new Set(posts.flatMap((post) => post.categories)),
].sort();
const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();
const years = [...new Set(posts.map((post) => post.year))].sort(
	(a, b) => b - a,
);

function matchesFilters(post: PostIndex) {
	return (
		(!category || post.categories.includes(category)) &&
		(!tag || post.tags.includes(tag)) &&
		(!year || post.year === Number(year))
	);
}

async function runSearch() {
	searching = true;
	const query = keyword.trim();
	try {
		if (query && import.meta.env.PROD && pagefindReady && window.pagefind) {
			const response = await window.pagefind.search(query);
			const pagefindResults = await Promise.all(
				response.results.map((item) => item.data()),
			);
			results = pagefindResults.flatMap((item) => {
				const pathname = new URL(item.url, window.location.origin).pathname;
				const post = posts.find(
					(candidate) =>
						pathname ===
						new URL(candidate.url, window.location.origin).pathname,
				);
				if (!post || !matchesFilters(post)) return [];
				return [{ ...post, excerpt: item.excerpt }];
			});
		} else {
			const normalized = query.toLocaleLowerCase();
			results = posts.filter((post) => {
				const haystack = [
					post.title,
					post.description,
					...post.tags,
					...post.categories,
				]
					.join(" ")
					.toLocaleLowerCase();
				return (
					(!normalized || haystack.includes(normalized)) && matchesFilters(post)
				);
			});
		}
	} finally {
		searching = false;
	}
}

onMount(() => {
	const syncPagefind = () => {
		pagefindReady = !!window.pagefind?.search;
	};
	syncPagefind();
	document.addEventListener("pagefindready", syncPagefind);
	return () => document.removeEventListener("pagefindready", syncPagefind);
});

$: {
	keyword;
	category;
	tag;
	year;
	runSearch();
}
</script>

<div class="card-base p-5 md:p-7 mb-4 onload-animation">
	<label class="relative block">
		<Icon icon="material-symbols:search-rounded" class="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-30" />
		<input bind:value={keyword} placeholder="搜索标题、摘要、正文、分类或标签" class="w-full h-12 pl-12 pr-4 rounded-lg bg-[var(--btn-regular-bg)] text-75 outline-none focus:ring-2 focus:ring-[var(--primary)]/40" />
	</label>
	<div class="grid sm:grid-cols-3 gap-3 mt-4">
		<select bind:value={category} aria-label="按分类筛选" class="h-11 px-3 rounded-lg bg-[var(--btn-regular-bg)] text-75 outline-none">
			<option value="">全部分类</option>
			{#each categories as item}<option value={item}>{item}</option>{/each}
		</select>
		<select bind:value={tag} aria-label="按标签筛选" class="h-11 px-3 rounded-lg bg-[var(--btn-regular-bg)] text-75 outline-none">
			<option value="">全部标签</option>
			{#each tags as item}<option value={item}>{item}</option>{/each}
		</select>
		<select bind:value={year} aria-label="按年份筛选" class="h-11 px-3 rounded-lg bg-[var(--btn-regular-bg)] text-75 outline-none">
			<option value="">全部年份</option>
			{#each years as item}<option value={String(item)}>{item}</option>{/each}
		</select>
	</div>
</div>

<div class="card-base p-3 md:p-4 mb-4 onload-animation">
	<div class="px-3 py-2 text-sm text-30">{searching ? "正在搜索…" : `找到 ${results.length} 条结果`}</div>
	{#each results as item}
		<a href={item.url} class="group block rounded-lg px-4 py-3 hover:bg-[var(--btn-plain-bg-hover)] active:bg-[var(--btn-plain-bg-active)]">
			<div class="font-bold text-lg text-90 group-hover:text-[var(--primary)]">{item.title}</div>
			{#if item.excerpt}<div class="mt-1 text-sm text-50 search-result">{@html item.excerpt}</div>{:else}<div class="mt-1 text-sm text-50">{item.description}</div>{/if}
			<div class="mt-2 flex flex-wrap gap-2 text-xs text-30">
				<span>{item.year}</span>
				{#each item.categories as value}<span>· {value}</span>{/each}
				{#each item.tags as value}<span>#{value}</span>{/each}
			</div>
		</a>
	{/each}
	{#if results.length === 0}<div class="px-4 py-12 text-center text-50">没有找到匹配内容。</div>{/if}
</div>

<style>
	.search-result :global(mark) { color: var(--primary); background: transparent; font-weight: 700; }
</style>
