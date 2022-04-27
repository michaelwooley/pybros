class StdinBuffer {
	constructor() {
		this.sab = new SharedArrayBuffer(128 * Int32Array.BYTES_PER_ELEMENT);
		this.buffer = new Int32Array(this.sab);
		this.readIndex = 1;
		this.numberOfCharacters = 0;
		this.sentNull = true;
	}

	prompt() {
		console.log('prompting');
		this.readIndex = 1;
		Atomics.store(this.buffer, 0, -1);
		postMessage({
			type: 'stdin',
			buffer: this.sab
		});
		Atomics.wait(this.buffer, 0, -1);
		this.numberOfCharacters = this.buffer[0];
	}

	stdin = () => {
		if (this.numberOfCharacters + 1 === this.readIndex) {
			if (!this.sentNull) {
				// Must return null once to indicate we're done for now.
				this.sentNull = true;
				return null;
			}
			this.sentNull = false;
			this.prompt();
		}
		const char = this.buffer[this.readIndex];
		this.readIndex += 1;
		console.log(char, String.fromCharCode(char));
		if (char === 49 || this.sentNull) {
			if (!this.sentNull) {
				// Must return null once to indicate we're done for now.
				this.sentNull = true;
				return null;
			} else if (this.sentNull) {
				this.sentNull = 10;
				return 10;
			} else {
				this.sentNull = false;
				this.prompt();
			}
		}
		// How do I send an EOF??
		return char == 10 ? char : 49; //always returns 1
		// return char;
	};
}

const stdoutBufSize = 128;
const stdoutBuf = new Int32Array();
let index = 0;

const stdout = (charCode) => {
	if (charCode) {
		postMessage({
			type: 'stdout',
			stdout: String.fromCharCode(charCode)
		});
	} else {
		console.log(typeof charCode, charCode);
	}
};

const stderr = (charCode) => {
	if (charCode) {
		postMessage({
			type: 'stderr',
			stderr: String.fromCharCode(charCode)
		});
	} else {
		console.log(typeof charCode, charCode);
	}
};

const stdinBuffer = new StdinBuffer();

var Module = {
	noInitialRun: true,
	stdin: stdinBuffer.stdin,
	stdout: stdout,
	stderr: stderr,
	onRuntimeInitialized: () => {
		postMessage({ type: 'ready', stdinBuffer: stdinBuffer.sab });
	}
};

onmessage = (event) => {
	if (event.data.type === 'run') {
		console.log('run', event.data.args, callMain, typeof callMain);
		// TODO: Set up files from event.data.files
		const ret = callMain(event.data.args);
		console.log(ret);
		postMessage({
			type: 'finished',
			returnCode: ret
		});
	}
};

importScripts('python.js');
