# Banner assets

- `candidates/` contains the original wallpaper files selected by Ash, plus the local review manifest.
- `optimized/` contains normalized WebP files used by the website banner carousel.
- Run `pnpm optimize-banners` after adding or replacing candidate images.
- The carousel currently selects a different random image every 20 seconds and fades between images.
- The current candidate set was collected from public anime wallpaper APIs. Source and licensing details must be reviewed before public deployment.
