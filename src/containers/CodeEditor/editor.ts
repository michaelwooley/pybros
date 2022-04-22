/**
 * Functions handling editor and text tracking.
 */

import type monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { IndexeddbPersistence } from 'y-indexeddb';

export const initEditor = async (
	div: HTMLDivElement,
	runCmd: (ed: monaco.editor.ICodeEditor) => void
): Promise<monaco.editor.IStandaloneCodeEditor> => {
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
	const editor = monaco.editor.create(div, {
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
		run: runCmd
	};
	editor.addAction(runScriptAction);

	return editor;
};

export const initEditorTracking = (
	editor: monaco.editor.ICodeEditor,
	key: string
): MonacoBinding => {
	// A Yjs document holds the shared data
	const ydoc = new Y.Doc();
	const type = ydoc.getText('monaco'); // TODO Understand better...

	// We persist the document content across sessions
	const indexeddbProvider = new IndexeddbPersistence(key, ydoc);
	console.debug(indexeddbProvider);

	const monacoBinding = new MonacoBinding(
		type,
		editor.getModel(),
		new Set([editor]) // Can track multiple editors here...
		// provider.awareness // TODO Add awareness/people names w/ webrtc
	);
	// console.log(type);
	// console.log(indexeddbProvider);
	// console.log(monacoBinding);

	return monacoBinding;
};