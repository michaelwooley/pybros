<script lang="ts">
	import { page } from '$app/stores';
	import MeetingNavbar from '$components/MeetingNavbar/MeetingNavbar.svelte';
	import { PROJECT_NAME } from '$lib/constants';
</script>

<svelte:head>
	<title>Meet {$page.params.slug} | {PROJECT_NAME}</title>
</svelte:head>

<MeetingNavbar slug={$page.params.slug} href={$page.url.href} />
<slot />
