<script lang="ts">
    import { onMount } from 'svelte';

    onMount(async () => {
        // const PyW = await (await import('$lib/pyodide/pyodide.worker?worker')).default;
        const pym = await import('$lib/pyodide');
        // const pw = await (await import('$lib/pyodide/pyodide.worker?worker')).default;
        const PyodideMain = pym.PyodideMain;
        const DefaultPyodideMainCallbacks = pym.DefaultPyodideMainCallbacks;
        const pm = new PyodideMain(DefaultPyodideMainCallbacks);
        console.log('Main: ', pm);
        // const w = new pw();
        // console.log(w);
        // TODO Add Worker#terminate? "This does not offer the worker an opportunity to finish its operations; it is stopped at once."
    });
</script>

<div class="box has-background-dark has-text-light">
    <div class="content">
        <h1 class="has-text-light">pyodide example: Workers</h1>
    </div>
</div>

<style lang="scss">
</style>
