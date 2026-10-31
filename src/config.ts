import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Ash",
	subtitle: "不诱于誉，不恐于诽，率道而行，端然正己。",
	lang: "zh_CN",
	themeColor: {
		hue: 345,
		fixed: true,
	},
	banner: {
		enable: true,
		src: "/assets/banners/optimized/banner-01-spring-reading.webp",
		sources: [
			"/assets/banners/optimized/banner-01-spring-reading.webp",
			"/assets/banners/optimized/banner-02-rooftop.webp",
			"/assets/banners/optimized/banner-03-rain-train.webp",
			"/assets/banners/optimized/banner-04-coding-night.webp",
			"/assets/banners/optimized/banner-05-autumn-shrine.webp",
			"/assets/banners/optimized/banner-06-seaside.webp",
		],
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Leave this array empty to use the default favicon
		// {
		//   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
		//   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
		//   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{ name: "分类", url: "/categories/" },
		{ name: "标签", url: "/tags/" },
		{ name: "时间线", url: "/timeline/" },
		{ name: "友链", url: "/friends/" },
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/assets/profile/avatar.jpg",
	name: "Ash",
	bio: "不诱于誉，不恐于诽，率道而行，端然正己。",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Ash-HYX",
		},
		{
			name: "Bilibili",
			icon: "fa6-brands:bilibili",
			url: "https://space.bilibili.com/473396540",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
