<script context="module">
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
</section>
