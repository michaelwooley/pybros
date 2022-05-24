<script lang="ts">
	import { PYODIDE_INDEX_URL } from '$lib/constants';

	import { onMount } from 'svelte';

	onMount(async () => {
		const pyodideModule = await import('pyodide');
		console.log(pyodideModule);
		let pyodide = await pyodideModule.loadPyodide({
			indexURL: PYODIDE_INDEX_URL,
			stdout: (msg) => console.log('stdout: ', msg)
		});
		console.log('pyodide object: ', pyodide);
		let out = pyodide.runPython('a={"a":1};print("stdout??? ",a);a');

		console.log('Output raw: ', out);
		console.log(out.toString());
	});
</script>

<div class="box has-background-dark has-text-light">
	<div class="content">
		<h1 class="has-text-light">pyodide example</h1>
	</div>
</div>

<style lang="scss">
</style>
