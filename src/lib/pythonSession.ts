/**
 * A command type.
 * Loosely based on ipynb.
 */
export type TPythonCommand = {
    idx: number;
    cellType: 'code'; // | "markdown"
    source: string[];
    outputs: { name: 'stderr' | 'stdout'; text: string[] };
};
/**
 * A python session
 * Loosely based on ipynb.
 */
export type TPythonSession = {
    cells: TPythonCommand[];
    metadata: Record<string, string>;
    kind: 'repl'; // | "notebook"
};
