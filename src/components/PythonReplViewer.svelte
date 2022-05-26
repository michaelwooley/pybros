<script lang="ts">
    import type { TPythonSession } from '$lib/pythonSession';

    export let results: TPythonSession;
</script>

<div class="viewer has-text-white p-2 is-family-code is-size-7" on:res>
    {#if results}
        {#if results.cells && results.cells.length > 0}
            <div class="wrapper">
                {#each results.cells as res}
                    <div class="idx inputs has-text-success">In [{res.idx + 1}]:</div>
                    <div class="source inputs">
                        {#each res.source as l}
                            <div>{l}</div>
                        {/each}
                    </div>
                    <div class="idx output has-text-danger">Out [{res.idx + 1}]:</div>
                    <div class="source output">
                        {#each res.outputs.text as l}
                            <div>{l}</div>
                        {/each}
                    </div>
                {/each}
            </div>
        {:else}
            <p>Write a command and run it to see results.</p>
        {/if}
    {:else}
        <p>No results passed</p>
    {/if}
</div>

<style lang="scss">
    .viewer {
        background-color: #1e1e1e;
        min-height: 100%;
    }
    .wrapper {
        display: grid;
        grid-template-columns: 75px auto;
        grid-auto-flow: row dense;
        font-size: 14px;
    }

    .source {
        white-space: pre;
    }
</style>
