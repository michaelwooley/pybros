import { Terminal } from 'xterm';

export class WorkerManager {
	workerURL: string | Worker;
	standardIO: any;
	readyCallBack: () => void;
	worker: Worker | null;

	constructor(workerURL: string, standardIO: any, readyCallBack: () => void) {
		this.workerURL = workerURL;
		this.worker = null;
		this.standardIO = standardIO;
		this.readyCallBack = readyCallBack;

		this.initialiseWorker();
	}

	async initialiseWorker() {
		if (!this.worker) {
			this.worker =
				typeof this.workerURL === 'string' ? new Worker(this.workerURL) : new this.workerURL(); //
			if (!this.worker) {
				throw new Error('afs');
			}
			console.log(this.worker);
			this.worker.addEventListener('message', this.handleMessageFromWorker);
		}
	}

	async run(options) {
		if (!this.worker) {
			console.error('Worker not defined');
			return;
		}
		this.worker.postMessage({
			type: 'run',
			args: options.args || [],
			files: options.files || {}
		});
	}

	handleStdinData(inputValue) {
		if (this.stdinbuffer && this.stdinbufferInt) {
			let startingIndex = 1;
			if (this.stdinbufferInt[0] > 0) {
				startingIndex = this.stdinbufferInt[0];
			}
			const data = new TextEncoder().encode(inputValue);
			data.forEach((value, index) => {
				this.stdinbufferInt[startingIndex + index] = value;
			});

			this.stdinbufferInt[0] = startingIndex + data.length - 1;
			Atomics.notify(this.stdinbufferInt, 0, 1);
		}
	}

	handleMessageFromWorker = (event) => {
		const type = event.data.type;
		if (type === 'ready') {
			this.readyCallBack();
		} else if (type === 'stdout') {
			this.standardIO.stdout(event.data.stdout);
		} else if (type === 'stderr') {
			this.standardIO.stderr(event.data.stderr);
		} else if (type === 'stdin') {
			// Leave it to the terminal to decide whether to chunk it into lines
			// or send characters depending on the use case.
			this.stdinbuffer = event.data.buffer;
			this.stdinbufferInt = new Int32Array(this.stdinbuffer);
			this.standardIO.stdin().then((inputValue) => {
				this.handleStdinData(inputValue);
			});
		} else if (type === 'finished') {
			this.standardIO.stderr(`Exited with status: ${event.data.returnCode}\r\n`);
		}
	};
}

export class WasmTerminal {
	xterm: Terminal;
	activeInput: boolean;
	input: string;
	constructor() {
		this.input = '';
		this.resolveInput = null;
		this.activeInput = false;
		this.inputStartCursor = null;

		this.xterm = new Terminal({
			scrollback: 10000,
			fontSize: 14,
			theme: { background: '#1a1c1f' },
			cols: 100
		});

		this.xterm.onKey((keyEvent) => {
			// Fix for iOS Keyboard Jumping on space
			if (keyEvent.key === ' ') {
				keyEvent.domEvent.preventDefault();
			}
		});

		this.xterm.onData(this.handleTermData);
	}

	open(container: HTMLElement) {
		this.xterm.open(container);
	}

	handleReadComplete(lastChar) {
		this.resolveInput(this.input + lastChar);
		this.activeInput = false;
	}

	handleTermData = (data) => {
		if (!this.activeInput) {
			return;
		}
		const ord = data.charCodeAt(0);
		let ofs;

		// TODO: Handle ANSI escape sequences
		if (ord === 0x1b) {
			// Handle special characters
		} else if (ord < 32 || ord === 0x7f) {
			switch (data) {
				case '\r': // ENTER
				case '\x0a': // CTRL+J
				case '\x0d': // CTRL+M
					this.xterm.write('\r\n');
					this.handleReadComplete('\n');
					break;
				case '\x7F': // BACKSPACE
				case '\x08': // CTRL+H
				case '\x04': // CTRL+D
					this.handleCursorErase(true);
					break;
			}
		} else {
			this.handleCursorInsert(data);
		}
	};

	handleCursorInsert(data) {
		this.input += data;
		this.xterm.write(data);
	}

	handleCursorErase() {
		// Don't delete past the start of input
		if (this.xterm.buffer.active.cursorX <= this.inputStartCursor) {
			return;
		}
		this.input = this.input.slice(0, -1);
		this.xterm.write('\x1B[D');
		this.xterm.write('\x1B[P');
	}

	prompt = async () => {
		this.activeInput = true;
		// Hack to allow stdout/stderr to finish before we figure out where input starts
		setTimeout(() => {
			this.inputStartCursor = this.xterm.buffer.active.cursorX;
		}, 1);
		return new Promise((resolve, reject) => {
			this.resolveInput = (value) => {
				this.input = '';
				resolve(value);
			};
		});
	};

	clear() {
		this.xterm.clear();
	}

	print(message: string): void {
		const normInput = message.replace(/[\r\n]+/g, '\n').replace(/\n/g, '\r\n');
		this.xterm.write(normInput);
	}
}
