/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

class StdinBuffer {
	sab: ArrayBuffer;
	buffer: Int32Array;
	readIndex: number;
	numberOfCharacters: number;
	sentNull: boolean;

	constructor() {
		this.sab = new ArrayBuffer(128 * Int32Array.BYTES_PER_ELEMENT); //SharedArrayBuffer(128 * Int32Array.BYTES_PER_ELEMENT);
		this.buffer = new Int32Array(this.sab);
		this.readIndex = 1;
		this.numberOfCharacters = 0;
		this.sentNull = true;
	}

	prompt(): void {
		this.readIndex = 1;
		Atomics.store(this.buffer, 0, -1);
		self.postMessage({
			type: 'stdin',
			buffer: this.sab
		});
		Atomics.wait(this.buffer, 0, -1);
		this.numberOfCharacters = this.buffer[0];
	}

	stdin(): number | null {
		// if (this.numberOfCharacters + 1 === this.readIndex) {
		// 	if (!this.sentNull) {
		// 		// Must return null once to indicate we're done for now.
		// 		this.sentNull = true;
		// 		return null;
		// 	}
		// 	this.sentNull = false;
		// 	this.prompt();
		// }
		// const char = this.buffer[this.readIndex];
		// this.readIndex += 1;
		// // How do I send an EOF??
		// return char;
		// setInterval(() => {
		// })
	}
}

// // Needed for python.js?
// const stdoutBufSize = 128;
// const stdoutBuf = new Int32Array();
// let index = 0;

const stdout = (charCode: number) => {
	if (charCode) {
		self.postMessage({
			type: 'stdout',
			stdout: String.fromCharCode(charCode)
		});
	} else {
		console.log(typeof charCode, charCode);
	}
};

const stderr = (charCode: number) => {
	if (charCode) {
		self.postMessage({
			type: 'stderr',
			stderr: String.fromCharCode(charCode)
		});
	} else {
		console.log(typeof charCode, charCode);
	}
};

const stdinBuffer = new StdinBuffer();

// Will be in scope when import python.js
var Module = {
	noInitialRun: true,
	stdin: stdinBuffer.stdin,
	stdout: stdout,
	stderr: stderr,
	onRuntimeInitialized: () => {
		self.postMessage({ type: 'ready', stdinBuffer: stdinBuffer.sab });
	}
};

// type callMain = (args: string[] | undefined) => string;
// let callMain: (args: string[] | undefined) => string;
self.onmessage = (event) => {
	if (event.data.type === 'run') {
		console.log(event.data, callMain, typeof callMain);
		// TODO: Set up files from event.data.files
		const ret = callMain(event.data.args);
		console.log(ret);
		self.postMessage({
			type: 'finished',
			returnCode: ret
		});
	} else {
		console.log('Unknown type', event.data.type);
	}
};

self.importScripts('python.js');

// export {};
