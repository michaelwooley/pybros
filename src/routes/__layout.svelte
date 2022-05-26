<script lang="ts">
    import Footer from '$components/Footer.svelte';
    import PersistentSession from '$containers/PersistentSession.svelte';
    import { PROJECT_NAME } from '$lib/constants';
    import '../app.scss';
</script>

<svelte:head>
    <title>{PROJECT_NAME}</title>
</svelte:head>

<header />

<main id="svelte">
    <slot />
</main>

<Footer />
<PersistentSession />

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
</style>
