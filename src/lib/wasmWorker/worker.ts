/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import init, { fibonacci } from '$lib/wasm/pkg/wasm';
// import init, { pyEval, pyExec } from '$lib/rustPython/pkg/rustpython_wasm';

init().then(() => {
    self.postMessage('WASM is ready to run!');
});

self.onmessage = function (e) {
    const userNum = Number(e.data);
    const b = fibonacci(userNum);
    self.postMessage({ b, route: 'fib' });
};

export {};
