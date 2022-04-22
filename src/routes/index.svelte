<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import CodeEditor from '$containers/CodeEditor.svelte';

	// import PythonExecDemo from '$containers/PythonExecDemo.svelte';
</script>

<section class="section">
	<div class="container">
		<h1 class="title is-1">pysvelte</h1>

		<div class="columns has-background-dark is-gapless box p-1 editor-console">
			<div class="column">
				<CodeEditor />
			</div>
			<div class="column is-narrow">||</div>
			<div class="column">Thie other</div>
		</div>
		<!-- <PythonExecDemo /> -->
	</div>
</section>

<style lang="scss">
	.editor-console {
		height: 80vh; // 95%
	}
</style>
