/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import init, { greet } from '$lib/wasm/pkg/wasm';
init().then(() => {
	// greet('WebAssembly');
	// console.log('woerk');
	self.postMessage('Ready to go!');
	// greet('WebAssembly');
});

self.onmessage = function (e) {
	const userNum = Number(e.data);
	const b = fibonacci(userNum);
	self.postMessage({ b, route: 'fib' });
};

function fibonacci(num: number): number {
	let a = 1,
		b = 0,
		temp;
	while (num >= 0) {
		temp = a;
		a = a + b;
		b = temp;
		num--;
	}

	return b;
}
// import init, { greet } from '$lib/wasm/pkg/wasm';
// init().then(() => {
// 	greet('WebAssembly');
// 	console.log('woerk');
// });
export {};
