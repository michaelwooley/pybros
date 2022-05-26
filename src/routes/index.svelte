<script context="module" lang="ts">
	// export const prerender = false;
</script>

<script lang="ts">
	// import HomeTitleBar from '$components/HomeTitleBar.svelte';
	// import PythonRepl from '$containers/PythonRepl.svelte';
	// import PyodideDemoNonWorker from '$containers/PyodideDemoNonWorker.svelte';

	import PyodideWorkerDemo from '$containers/PyodideWorkerDemo.svelte';
</script>

<section class="section">
	<div class="container">
		<!-- <HomeTitleBar />
		<PythonRepl /> -->
		<PyodideWorkerDemo />
	</div>
</section>
