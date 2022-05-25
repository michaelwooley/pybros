<script lang="ts">
	import { PYODIDE_INDEX_URL } from '$lib/constants';

	import { onMount } from 'svelte';

	onMount(async () => {
		const pym = await import('$lib/pyodide');
		const PyodideMain = pym.PyodideMain;
		const DefaultPyodideMainCallbacks = pym.DefaultPyodideMainCallbacks;
		const pm = new PyodideMain(DefaultPyodideMainCallbacks);
		console.log(pym);

		// TODO Add Worker#terminate? "This does not offer the worker an opportunity to finish its operations; it is stopped at once."
	});
</script>

<div class="box has-background-dark has-text-light">
	<div class="content">
		<h1 class="has-text-light">pyodide example: Workers</h1>
	</div>
</div>

<style lang="scss">
</style>
