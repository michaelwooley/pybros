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
import { WebrtcProvider } from 'y-webrtc';
import { YJS_WEBRTC_SIGNALLING_SERVERS } from '$lib/constants';
import * as awarenessProtocol from 'y-protocols/awareness.js';
import { randomColor } from '$lib/util';

type TExtendedSelf = typeof globalThis & {
	MonacoEnvironment: {
		getWorker: (_moduleId: string, label: string) => Worker;
	};
};

(self as unknown as TExtendedSelf).MonacoEnvironment = {
	getWorker: function (_moduleId: string, label: string) {
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

export const initEditor = async (
	div: HTMLDivElement,
	runCmd: (ed: monaco.editor.ICodeEditor) => void
): Promise<monaco.editor.IStandaloneCodeEditor> => {
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

export const initEditorTracking = async (
	editor: monaco.editor.ICodeEditor,
	key: string,
	roomName: string,
	awarenessState: UserSettings
): Promise<MonacoBinding> => {
	// const MonacoBinding = await (await import('y-monaco')).MonacoBinding;

	// A Yjs document holds the shared data
	const ydoc = new Y.Doc();
	const type = ydoc.getText('monaco'); // TODO Understand better...

	// TODO #22 Handle doc persistence when starting a new webrtc conference.
	// We persist the document content across sessions
	const indexeddbProvider = new IndexeddbPersistence(key, ydoc);
	console.debug(indexeddbProvider);

	// TODO Fix awareness
	const opts = {
		// Specify signaling servers. The client will connect to every signaling server concurrently to find other peers as fast as possible.
		signaling: YJS_WEBRTC_SIGNALLING_SERVERS,
		// If password is a string, it will be used to encrypt all communication over the signaling servers.
		// No sensitive information (WebRTC connection info, shared data) will be shared over the signaling servers.
		// The main objective is to prevent man-in-the-middle attacks and to allow you to securely use public / untrusted signaling instances.
		password: null,
		// Specify an existing Awareness instance - see https://github.com/yjs/y-protocols
		awareness: new awarenessProtocol.Awareness(ydoc),
		// Maximal number of WebRTC connections.
		// A random factor is recommended, because it reduces the chance that n clients form a cluster.
		maxConns: 3, // 20 + Math.floor(random.rand() * 15),
		// Whether to disable WebRTC connections to other tabs in the same browser.
		// Tabs within the same browser share document updates using BroadcastChannels.
		// WebRTC connections within the same browser are therefore only necessary if you want to share video information too.
		filterBcConns: true,
		// simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts for available options.
		// y-webrtc uses simple-peer internally as a library to create WebRTC connections.
		peerOpts: {}
	};
	const provider = new WebrtcProvider(roomName, ydoc, opts);
	console.debug(provider);

	provider.awareness.setLocalStateField('user', awarenessState);

	const monacoBinding = new MonacoBinding(
		type,
		editor.getModel(),
		new Set([editor]), // Can track multiple editors here...
		provider.awareness
	);

	provider.connect(); // Necessary?
	/** What do updates look like?
	 * (2) [{…}, 'local']
		0: {added: Array(0), updated: Array(1), removed: Array(0)}
		1: "local"

		OR:

		(2) [{…}, Room]
		0: {added: Array(0), updated: Array(1), removed: Array(0)}
		1: Room {p
	 */
	// TODO #24 Style cursors by user by modifying .yRemoteSelection-{clientId} css
	// See CodeEditor.svelte style tag for current behavior
	// REFERENCE https://github.com/yjs/y-monaco/#styling
	// REFERENCE https://github.com/yjs/y-monaco/blob/master/src/y-monaco.js#L88-L122
	// provider.awareness.on('update', (...a) => console.log('awareness ipdate: ', a));

	return monacoBinding;
};
