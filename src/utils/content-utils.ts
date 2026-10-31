import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

type PostData = CollectionEntry<"posts">["data"];

export function getPostSlug(post: CollectionEntry<"posts">): string {
	return post.data.slug?.trim() || post.slug;
}

export function getPostImage(data: PostData): string {
	return data.cover_path?.trim() || data.image?.trim() || "";
}

export function getPostCategories(data: PostData): string[] {
	const categories = data.categories
		.map((category) => category.trim())
		.filter(Boolean);
	if (categories.length > 0) return [...new Set(categories)];
	const legacyCategory = data.category?.trim();
	return legacyCategory ? [legacyCategory] : [];
}

function isPublished(data: PostData): boolean {
	if (data.draft) return false;
	const publishAt = data.publish_at || data.published;
	return publishAt.getTime() <= Date.now();
}

// Retrieve posts and sort them by pin status and publication date.
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? isPublished(data) : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = getPostSlug(sorted[i - 1]);
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = getPostSlug(sorted[i + 1]);
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: getPostSlug(post),
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? isPublished(data) : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? isPublished(data) : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post) => {
		const categories = getPostCategories(post.data);
		if (categories.length === 0) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}
		for (const categoryName of categories) {
			count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
		}
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
