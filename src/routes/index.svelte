<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import PythonExecDemo from '$containers/PythonExecDemo.svelte';
</script>

<section class="section">
	<div class="container">
		<h1 class="title is-1">pysvelte</h1>
		<PythonExecDemo />
	</div>
</section>
