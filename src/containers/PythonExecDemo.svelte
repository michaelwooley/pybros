<script lang="ts">
	import { onMount } from 'svelte';
	let pyExec: (source: string, options?: object) => void;
	let value = `for i in range(10):
    print(i)`;
	let results: string[][] = [];

	const runPyEval = (code: string): void => {
		if (!pyExec) {
			alert('Not loaded!');
			return;
		}

		let res = '';

		pyExec(code, {
			stdout: (out: string): void => {
				console.log(`Got stdout: ${out} (JSON/escaped: ${JSON.stringify(out)})`);

				res = res + out;
			}
		});
		console.log(JSON.stringify(res));
		results = results.concat([res.trimEnd().split('\n')]);
		console.log('This only runs once the code is done executing.');
	};

	onMount(async () => {
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

		runPyEval(`
for i in range(10):
    print(i)`);
	});
</script>

<form class="form" on:submit|preventDefault={() => runPyEval(value)}>
	<div class="field">
		<label class="label" for="py-eval">Python code</label>
		<div class="control">
			<textarea
				class="textarea"
				bind:value
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
	{#each results as r, i}
		{#each r as l, j}
			<div class="columns is-gapless mb-0">
				<div class="column is-1">
					<div class="results">
						<code>
							{#if j === 0}
								[out:{i}]
							{:else}
								{''}
							{/if}
						</code>
					</div>
				</div>
				<div class="column">
					<div class="results">
						<code>
							{l}
							<!-- <pre>{r}</pre> -->
						</code>
					</div>
				</div>
			</div>
		{/each}
	{/each}
</div>

<style lang="scss">
	.results {
		width: 100%;
		background-color: var(--code-bg-color);
		padding-bottom: 3px;
	}
</style>
