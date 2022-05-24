import { dev } from '$app/env';

export const PROJECT_NAME = 'pybros';
export const PROJECT_EMOJI = '🥧';
export const PROJECT_REPO = 'https://github.com/michaelwooley/pybros';

export const SETTINGS_COOKIE_PREFIX = 'ps-3237e276';
export const SETTINGS_STORE_KEY = 'ps-3237e276-7333-45ff-95d6-5d9db0638397';

export const YJS_INDEXEDDB_EDITOR_KEY = 'y-pybros-editor';
// TODO Add on indexedDb key for other tracked items

// TODO #20 Can we use 3rd party turn servers for webrtc? Kosher?
export const YJS_WEBRTC_SIGNALLING_SERVERS = dev
	? ['ws://localhost:4444']
	: [
			'wss://signaling.yjs.dev',
			'wss://y-webrtc-signaling-eu.herokuapp.com',
			'wss://y-webrtc-signaling-us.herokuapp.com'
	  ];

// TODO #21 Create and handle multiple webrtc rooms. (One per meet.)
export const YJS_WEBRTC_COMMON_ROOM = 'pybros-room';

export const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${
	import.meta.env.VITE_PYODIDE_VERSION
}/full/`; // import.meta.env.VITE_PYODIDE_INDEX_URL || 'https://cdn.jsdelivr.net/pyodide/v0.20.1a1/full/';
