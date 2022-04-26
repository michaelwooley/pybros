<script lang="ts">
	import PersistentSession from '$containers/PersistentSession.svelte';
	import { PROJECT_NAME } from '$lib/constants';
	import '../app.scss';
</script>

<svelte:head>
	<title>{PROJECT_NAME}</title>
</svelte:head>

<slot />
<PersistentSession />
