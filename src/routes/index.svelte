<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	// import HomeTitleBar from '$components/HomeTitleBar.svelte';
	// import PythonRepl from '$containers/PythonRepl.svelte';
	import PyodideDemoNonWorker from '$containers/PyodideDemoNonWorker.svelte';
</script>

<section class="section">
	<div class="container">
		<!-- <HomeTitleBar />
		<PythonRepl /> -->
		<PyodideDemoNonWorker />
	</div>
</section>
