<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const mod = await import('$lib/wasm/pkg/wasm');
		console.log(mod);

		await mod.default();

		mod.greet('is this working?');
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section class="section">
	<h1>
		<div class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>

		to your new<br />SvelteKit app
	</h1>

	<div class="container">...</div>
</section>
