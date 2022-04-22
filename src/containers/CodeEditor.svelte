<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type monaco from 'monaco-editor';
	import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
	import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
	import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
	import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
	import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

	const dispatch = createEventDispatcher<{ run: string }>();

	let divEl: HTMLDivElement;
	let editor: monaco.editor.IStandaloneCodeEditor;

	onMount(async () => {
		if (!divEl) {
			throw new Error('Div not found..');
		}

		// @ts-ignore
		self.MonacoEnvironment = {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			getWorker: function (_moduleId: any, label: string) {
				if (label === 'json') {
					return new jsonWorker();
				}
				if (label === 'css' || label === 'scss' || label === 'less') {
					return new cssWorker();
				}
				if (label === 'html' || label === 'handlebars' || label === 'razor') {
					return new htmlWorker();
				}
				if (label === 'typescript' || label === 'javascript') {
					return new tsWorker();
				}

				return new editorWorker();
			}
		};

		const monaco = await import('monaco-editor');
		// REFERENCE https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
		editor = monaco.editor.create(divEl, {
			value: [`for i in range(10):`, `    print(i)`].join('\n'),
			language: 'python',
			minimap: { enabled: false },
			theme: 'vs-dark',
			formatOnPaste: true,
			scrollbar: {
				vertical: 'auto',
				verticalScrollbarSize: 5
			}
		});

		// REFERENCE https://github.com/microsoft/monaco-editor/blob/d987b87d6dd24d597991a2bd9022887b12b32cd5/website/playground/new-samples/interacting-with-the-editor/adding-an-action-to-an-editor-instance/sample.js#L20
		// REFERENCE https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IActionDescriptor.html#keybindingContext
		const runScriptAction: monaco.editor.IActionDescriptor = {
			id: 'run-script',
			label: 'Run script',
			keybindings: [
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, // Ctrl/Cmd + R
				// eslint-disable-next-line no-bitwise
				monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter // Ctrl/Cmd + Enter
			],
			contextMenuGroupId: 'navigation',
			contextMenuOrder: 1,
			run: (ed) => {
				const v = ed.getValue();
				console.debug('Running script: ', v);
				dispatch('run', ed.getValue());
			}
		};
		editor.addAction(runScriptAction);

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
