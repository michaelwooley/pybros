import { dev } from '$app/env';

export const PROJECT_NAME = 'pysvelte';
export const PROJECT_EMOJI = '🥧';
export const PROJECT_REPO = 'https://github.com/michaelwooley/pysvelte';

export const YJS_INDEXEDDB_EDITOR_KEY = 'y-pysvelte-editor';
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
export const YJS_WEBRTC_COMMON_ROOM = 'pysvelte-room';
