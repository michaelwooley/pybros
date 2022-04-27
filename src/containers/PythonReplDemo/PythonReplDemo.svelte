<script lang="ts" type="module">
	import { onMount } from 'svelte';

	import { WorkerManager, type WasmTerminal } from './lib';
	import workerModule from '$lib/python/python.worker?url';
	import 'xterm/css/xterm.css';

	let ready = false;
	let term: WasmTerminal;
	let termDiv: HTMLDivElement;
	let pythonWorkerManager: WorkerManager;

	onMount(async () => {
		// console.log(workerModule);
		// const workerModule = await (await import('$lib/python/python.worker?worker')).default;
		// const init = await (await import('$lib/python/python.wasm')).default;
		// console.log(init);

		// // const pyMod = await py({});
		// // console.log(pyMod);
		// init({ imports: {} }).then((exports) => {
		// 	console.log(exports);
		// });
		console.log(workerModule);
		const lib = await import('./lib');
		term = new lib.WasmTerminal();
		term.open(termDiv);
		const stdio = {
			stdout: (s: string) => {
				term.print(s);
			},
			stderr: (s: string) => {
				term.print(s);
			},
			stdin: async () => {
				return await term.prompt();
			}
		};
		const readyCallback = () => {
			ready = true;
		};

		pythonWorkerManager = new WorkerManager(workerModule, stdio, readyCallback);
		// Need to use "-i -" to force interactive mode.
		// Looks like isatty always returns false in emscripten
	});
</script>

<div id="terminal" bind:this={termDiv} />

{#if ready}
	<div>READY</div>
	<button
		on:click={() => {
			pythonWorkerManager.run({ args: ['-i', '-'], files: {} });
		}}>Repl</button
	>
	<button on:click={() => term.xterm.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')}
		>Write</button
	>
{/if}
