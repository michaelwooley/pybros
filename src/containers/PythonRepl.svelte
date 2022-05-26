<script lang="ts">
    import PythonReplViewer from '$components/PythonReplViewer.svelte';
    import CodeEditor from '$containers/CodeEditor/CodeEditor.svelte';
    import type { TPythonCommand, TPythonSession } from '$lib/pythonSession';
    import { afterUpdate, onMount } from 'svelte';

    let replDiv: HTMLDivElement;
    let pyExec: (source: string, options?: object) => void;

    let results: TPythonSession = {
        cells: [],
        metadata: {},
        kind: 'repl'
    };

    const runPyEval = (code: string): void => {
        if (!pyExec) {
            throw new Error('pyExec Not loaded!');
        }
        if (!code) {
            console.error('Must submit a string');
        }

        let res: TPythonCommand = {
            idx: results.cells.length,
            cellType: 'code',
            source: code.trimEnd().split('\n'),
            outputs: { name: 'stdout', text: [] }
        };
        let s = '';

        pyExec(code, {
            stdout: (out: string): void => {
                // console.log(`Got stdout: ${out} (JSON/escaped: ${JSON.stringify(out)})`);

                s = s + out;
            }
        });

        res.outputs.text = s.trimEnd().split('\n');
        results.cells = results.cells.concat([res]);
    };

    onMount(async () => {
        const mod = await import('$lib/rustPython/pkg/rustpython_wasm');
        await mod.default();
        pyExec = mod.pyExec;
        pyExec('1+1'); // Warm up
    });

    /**
     * When add results, scroll to the bottom of the results tab.
     */
    afterUpdate(() => {
        replDiv.scrollTo(0, replDiv.scrollHeight);
    });
</script>

<div class="wrapper editor-console box p-1 has-background-dark">
    <div class="editor"><CodeEditor on:run={(e) => runPyEval(e.detail)} /></div>
    <div class="resize" title="TODO Resize panels" />
    <div class="repl" bind:this={replDiv}>
        <PythonReplViewer {results} on:resize={(e) => console.log('resize', e)} />
    </div>
</div>

<style lang="scss">
    .editor-console {
        height: 80vh; // 95%
    }

    .wrapper {
        display: grid;
        grid-template-columns: 50% 5px auto;
        // grid-template-rows: 24px auto;
    }

    .repl {
        overflow-y: auto;
    }

    .wrapper div {
        border-radius: 5px;
    }
    .resize {
        cursor: ew-resize;

        &:hover {
            background-color: black;
        }
    }
</style>
