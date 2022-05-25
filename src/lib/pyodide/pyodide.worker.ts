/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/**
 * Web worker running pyodide python repl.
 */

// TODO #33 Add interrupt signals https://pyodide.org/en/stable/usage/keyboard-interrupts.html#setting-up-interrupts
// TODO #36 #35 Handle stdin/`input()` in pyodide worker

import { PYODIDE_INDEX_URL } from '$lib/constants';
import * as pyodideModule from 'pyodide';

declare global {
	// eslint-disable-next-line no-var
	var pyodide: GetInsidePromise<ReturnType<typeof pyodideModule.loadPyodide>>;
}

async function loadPyodideAndPackages() {
	self.pyodide = await pyodideModule.loadPyodide({
		indexURL: PYODIDE_INDEX_URL,
		stdout: (msg) => console.log('stdout: ', msg)
	});
	// await self.pyodide.loadPackage(['numpy', 'pytz']);
}

/**
 * Initialization command
 */
const pyodideReadyPromise = loadPyodideAndPackages()
	.then(() => self.postMessage({ cmd: 'startup', payload: { status: 'ready' } }))
	.catch((e) => self.postMessage({ cmd: 'startup', payload: { status: 'failed', err: e } }));

self.onmessage = async (event) => {
	// make sure loading is done
	await pyodideReadyPromise;

	// Don't bother yet with this line, suppose our API is built in such a way:
	const { id, python, ...context } = event.data;

	// TODO Work out use of context... what the heck??!
	// // The worker copies the context in its own "memory" (an object mapping name to values)
	// for (const key of Object.keys(context)) {
	// 	self[key] = context[key];
	// }
	// Now is the easy part, the one that is similar to working in the main thread:
	try {
		self.pyodide.runPython('a');
		await self.pyodide.loadPackagesFromImports(python);
		const results = await self.pyodide.runPythonAsync(python);
		self.postMessage({ results, id });
	} catch (e) {
		let result: string;
		if (typeof e === 'string') {
			result = e;
		} else if (e instanceof Error) {
			result = e.message;
		} else {
			result = `(Unknown error type) ${e}`;
		}
		self.postMessage({ error: result, id });
	}
};
