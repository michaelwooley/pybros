<script lang="ts">
	import { PROJECT_NAME } from '$lib/constants';

	// import Header from '$lib/header/Header.svelte';
	import '../app.scss';
</script>

<svelte:head>
	<title>{PROJECT_NAME}</title>
</svelte:head>

<header />

<main id="svelte">
	<slot />
</main>

<footer class="footer">
	<div class="container">
		<div class="content">
			<p>
				pysvelte | By Michael Wooley | <a
					href="https://github.com/michaelwooley/pysvelte"
					target="_blank">GitHub</a
				>
			</p>
		</div>
	</div>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		/* max-width: 1024px; */
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	} */
</style>
