<script lang="ts">
	import { copyToClipboard } from '$lib/util';
	// import { PROJECT_EMOJI, PROJECT_NAME } from '$lib/constants';
	// import * as routes from '$lib/routes';

	export let href: string;

	let isCopying = false;

	function handleInvite(): void {
		copyToClipboard(href);
		isCopying = true;
		setTimeout(() => {
			isCopying = false;
		}, 1500);
	}
</script>

<div class="buttons has-addons">
	<button
		class="button is-small is-info is-light"
		class:is-success={isCopying}
		on:click={handleInvite}
		title="Copy share link"
	>
		{#if isCopying}
			Copied link
		{:else}
			<span class="has-text-weight-bold">+ Invite</span>
		{/if}
	</button>
	<button
		class="button is-small is-info"
		class:is-success={isCopying}
		title="Copy share link"
		on:click={handleInvite}
	>
		{#if isCopying}
			<span>✔️</span>
		{:else}
			<span>🔗</span>
		{/if}
	</button>
</div>
