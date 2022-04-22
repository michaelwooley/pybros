<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import PythonRepl from '$containers/PythonRepl.svelte';
	import { PROJECT_EMOJI, PROJECT_NAME, PROJECT_REPO } from '$lib/constants';
	import * as routes from '$lib/routes';
</script>

<section class="section">
	<div class="container">
		<!-- <h1 class="title is-1">pysvelte</h1> -->
		<nav class="level mb-2">
			<!-- Left side -->
			<div class="level-left">
				<div class="level-item">
					<p class="title is-4">
						<a href={routes.BASE}> {PROJECT_EMOJI} <strong>{PROJECT_NAME}</strong> </a>
					</p>
				</div>
			</div>

			<!-- Right side -->
			<div class="level-right">
				<!-- <p class="level-item">
					<button class="button is-success has-text-weight-bold" disabled>run</button>
				</p> -->
				<div class="level-item">
					<a href={routes.ABOUT}>about</a>
				</div>
				<div class="level-item">
					<a href={PROJECT_REPO} target="_blank" title="github repo">code</a>
				</div>
			</div>
		</nav>
		<PythonRepl />
	</div>
</section>
