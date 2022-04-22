<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	// let result: string;
	// let worker: Worker;
	// let pyEval: (source: string, options?: object) => any; 	// eslint-disable
	let pyExec: (source: string, options?: object) => void;
	let code = '';
	let results: string[] = [];

	const runPyEval = (s: string): void => {
		if (!pyExec) {
			alert('Not loaded!');
			return;
		}

		pyExec(s, {
			stdout: (out: string): void => {
				console.log(`Got stdout: ${out} (JSON/escaped: ${JSON.stringify(out)})`);

				results = results.concat([out]);
			}
		});
		console.log('This only runs once the code is done executing.');
	};

	onMount(async () => {
		// const MyWorker = await (await import('$lib/wasmWorker/worker?worker')).default;

		// worker = new MyWorker();
		// worker.onmessage = function (event) {
		// 	console.log(event);
		// 	console.log(event.data);
		// 	result = event.data;
		// };

		// const mod = await import('$lib/wasm/pkg/wasm');
		// console.log(mod);
		// await mod.default();
		// console.log(mod.fibonacci(30));

		const mod = await import('$lib/rustPython/pkg/rustpython_wasm');
		performance.mark('start-load');
		await mod.default();
		let m = performance.measure('load rustpython', 'start-load');

		console.log('Measure: ', m.toJSON());

		pyExec = mod.pyExec; // mod.pyEval // Nope: truly a single-line req

		console.log('Loaded', new Date());
		performance.mark('start-first-run');
		runPyEval('print(1+1)');
		m = performance.measure('load rustpython', 'start-first-run');

		console.log(m.toJSON());
		performance.mark('start-second-run');
		runPyEval('print(2+2)');
		m = performance.measure('Second run', 'start-second-run');

		console.log(m.toJSON());
	});

	// const handleFib = (num: number) => {
	// 	worker.postMessage(num);
	// };
</script>

<section class="section">
	<div class="container">
		<h1 class="title is-1">pysvelte</h1>

		<!-- <input type="number" />	 -->
		<!-- <button class="button" on:click={() => handleFib(4)}>Run it</button> -->

		<!-- {#if result}
			<div>Result is: {result}</div>
		{/if} -->
		<form class="form" on:submit|preventDefault={() => runPyEval(code)}>
			<div class="field">
				<label class="label" for="py-eval">Python code</label>
				<div class="control">
					<textarea
						class="textarea"
						bind:value={code}
						placeholder="Write python code here..."
						name="py-eval"
					/>
				</div>
			</div>
			<div class="control">
				<button class="button" disabled={!pyExec}>🏃 Run code</button>
			</div>
		</form>
		<hr />
		<h2 class="subtitle is-2">Results</h2>
		<div>
			{#each results as r}
				<div class="results">
					<code>
						>>> {r}
						<!-- <pre>{r}</pre> -->
					</code>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="scss">
	.results {
		width: 100%;
		background-color: var(--code-bg-color);
		padding-bottom: 3px;
	}
</style>
