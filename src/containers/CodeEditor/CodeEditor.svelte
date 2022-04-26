<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type monaco from 'monaco-editor';
	// import { initEditor, initEditorTracking } from './editor';
	import { YJS_INDEXEDDB_EDITOR_KEY, YJS_WEBRTC_COMMON_ROOM } from '$lib/constants';
	import { session } from '$app/stores';

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
		const { initEditor, initEditorTracking } = await import('./editor');

		editor = await initEditor(divEl, handleRunCmd);
		initEditorTracking(editor, YJS_INDEXEDDB_EDITOR_KEY, YJS_WEBRTC_COMMON_ROOM, $session.user);

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

	// TODO #24 Remove in favor of client-specific colors.
	:global(div.monaco-editor .yRemoteSelection) {
		background-color: rgb(250, 129, 0, 0.5);
	}
	:global(div.monaco-editor .yRemoteSelectionHead) {
		position: absolute;
		border-left: orange solid 2px;
		border-top: orange solid 2px;
		border-bottom: orange solid 2px;
		//  NOTE Can specify borders separately.
		//border-top-color: ${color};
		// border-top-style: solid;
		// border-top-width: 2px;
		height: 100%;
		box-sizing: border-box;
	}
	:global(div.monaco-editor .yRemoteSelectionHead::after) {
		position: absolute;
		content: ' ';
		border: 3px solid orange;
		border-radius: 4px;
		left: -4px;
		top: -5px;
	}
</style>
