<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let result: string;
	let worker: Worker;
	onMount(async () => {
		const MyWorker = await (await import('$lib/wasmWorker/worker?worker')).default;

		worker = new MyWorker();
		worker.onmessage = function (event) {
			console.log(event);
			result = event.data;
			// console.log('Got: ' + event.data + '\n');
		};
	});

	const handleFib = (num: number) => {
		worker.postMessage(num);
	};
	// worker.onmessage = function (event) {
	// 	console.log(event);
	// 	result = event.data;
	// 	// console.log('Got: ' + event.data + '\n');
	// };

	// import { onMount } from 'svelte';

	// onMount(async () => {
	// 	const mod = await import('$lib/wasm/pkg/wasm');
	// 	console.log(mod);

	// 	await mod.default();

	// 	mod.greet('is this working?');
	// });
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

	<div class="container">
		<!-- <input type="number" />	 -->
		<button class="button" on:click={() => handleFib(4)}>Run it</button>

		{#if result}
			<div>Result is: {result}</div>
		{/if}
	</div>
</section>
