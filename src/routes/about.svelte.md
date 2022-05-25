<!-- <script context="module">
	// import { browser, dev } from '$app/env';
	import { PROJECT_NAME } from '$lib/constants';

	// // we don't need any JS on this page, though we'll load
	// // it in dev so that we get hot module replacement...
	// export const hydrate = dev;

	// // ...but if the client-side router is already loaded
	// // (i.e. we came here from elsewhere in the app), use it
	// export const router = browser;

	// // since there's no dynamic data here, we can prerender
	// // it so that it gets served as a static asset in prod
	// export const prerender = true;
</script>

<script lang="ts">
	import * as routes from '$lib/routes';
</script>

<section class="section">
	<div class="container content">
		<a href={routes.BASE}>🔙 Home</a>
		<h1>About {PROJECT_NAME}</h1>

		<p>TODO ....</p>
	</div>
</section> -->

title: About

---

_**Main idea:** Create a static site that supports collaborative python programming (i.e. [replit](https://replit.com/) without the server)._

---

Implementation path w/ progress:

- [x] Svelte project
- [x] Run wasm from rust Package
- [x] Run wasm within web worker
- [x] Run python code using RustPython compiled to wasm.
- [x] Add nice editor (monaco, codemirror, etc.)
- [x] Add CRDT/collaboration with [yjs](https://docs.yjs.dev/)
- [x] Add webrtc hookups for yjs/collaboration on _editor code_
- [ ] Add CRDT validation of python editor output/state.

# Acknowledgements

This is really just a glue job. All of the magic here is due to these projects:

- [Svelte/Svelte kit](kit.svelte.dev)
- [RustPython](https://github.com/RustPython/RustPython)
- [rustwasm/wasm-pack](https://github.com/rustwasm/wasm-pack)
- [YJS](https://docs.yjs.dev)
- [Monaco editor](https://microsoft.github.io/monaco-editor)
- [Bulma](https://bulma.io)
- [vite](https://vitejs.dev/)
