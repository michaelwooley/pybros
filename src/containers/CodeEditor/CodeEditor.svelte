<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type monaco from 'monaco-editor';
	import { initEditor } from './editor';

	const dispatch = createEventDispatcher<{ run: string }>();

	let divEl: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	const handleRunCmd = (ed: monaco.editor.ICodeEditor): void => {
		const v = ed.getValue();
		console.debug('Running script: ', v);
		dispatch('run', ed.getValue());
	};

	onMount(async () => {
		if (!divEl) {
			throw new Error('Div not found..');
		}
		editor = await initEditor(divEl, handleRunCmd);

		return () => {
			editor.dispose();
		};
	});
</script>

<div bind:this={divEl} class="editor" />

<style lang="scss">
	.editor {
		width: 100%;
		height: 100%;
	}
</style>
