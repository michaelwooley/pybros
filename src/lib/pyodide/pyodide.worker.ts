/* @vite-ignore */
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
import {
	ClientCmdEnum,
	WorkerCmdEnum,
	type IClientCmdsUnion,
	type IOutputClientCmdPayload,
	type IRestartWorkerCmd,
	type IRunCmdWorkerCmd,
	type IRunCompleteClientCmdPayload,
	type IRunStartClientCmdPayload,
	type IStartupRunClientCmdPayload,
	type IWorkerCmdsUnion,
	type IWorkerErrorClientCmdPayload
} from '$lib/pyodide/protocol';

type PyodideInterface = GetInsidePromise<ReturnType<typeof pyodideModule.loadPyodide>>;

declare global {
	// eslint-disable-next-line no-var
	var pyodideWorker: PyodideWorker;
}

interface IPyodideWorkerOnMessageCallbacks {
	handleRunCmd?: (data: IRunCmdWorkerCmd, worker: PyodideWorker) => Promise<void>;
	handleRestart?: (data: IRestartWorkerCmd, worker: PyodideWorker) => Promise<void>;
}

/**
 * Client: Dispatches messages to main thread.
 */
class PyodideWorkerClient {
	constructor(public postMessage: typeof globalThis.postMessage) {}
	private _postMessage(data: IClientCmdsUnion): void {
		self.postMessage(data);
	}

	public startup(payload: IStartupRunClientCmdPayload): void {
		this._postMessage({ cmd: ClientCmdEnum.STARTUP, payload });
	}

	public output(payload: IOutputClientCmdPayload): void {
		this._postMessage({ cmd: ClientCmdEnum.OUTPUT, payload });
	}

	public runStart(payload: IRunStartClientCmdPayload): void {
		this._postMessage({ cmd: ClientCmdEnum.RUN_START, payload });
	}
	public runComplete(payload: IRunCompleteClientCmdPayload): void {
		this._postMessage({ cmd: ClientCmdEnum.RUN_COMPLETE, payload });
	}
	public workerError(payload: IWorkerErrorClientCmdPayload): void {
		this._postMessage({ cmd: ClientCmdEnum.WORKER_ERROR, payload });
	}
}

/**
 * Service: Handles incoming messages from main thread.
 */
class PyodideWorkerService {
	constructor(public worker: PyodideWorker, public callbacks: IPyodideWorkerOnMessageCallbacks) {}

	public async handleWorkerMessage(e: MessageEvent<IWorkerCmdsUnion>): Promise<void> {
		// Error case: Worker did not load pyodide.
		if (this.worker.readyPromise == undefined) {
			this.worker.client.workerError({
				err: new Error('Worker does not appear to be initialized. Cannot process request.')
			});
			return;
		}

		// Wait until the worker is ready to process the request.
		await this.worker.readyPromise;
		// NOTE We don't do python context from JS here...

		// Extract request data.
		const data = e.data;

		switch (data.cmd) {
			case WorkerCmdEnum.RUN_CMD: {
				return await this.handleRunCmd(data);
			}
			case WorkerCmdEnum.RESTART: {
				return await this.handleRestart(data);
			}
			default: {
				throw new Error(`Unknown WorkerCmdData command: ${data}`);
			}
		}
	}

	private async handleRunCmd(data: IRunCmdWorkerCmd): Promise<void> {
		const cb = this.callbacks.handleRunCmd || console.log;
		await cb(data, this.worker);
	}

	private async handleRestart(data: IRestartWorkerCmd): Promise<void> {
		const cb = this.callbacks.handleRestart || (() => console.error('asf'));
		await cb(data, this.worker);
	}
}

/**
 * Orchestrator: Handles client+service together.
 */
class PyodideWorker {
	svc: PyodideWorkerService;
	client: PyodideWorkerClient;

	pyodide?: PyodideInterface;
	readyPromise?: Promise<void>;

	constructor(
		public postMessage: typeof globalThis.postMessage,
		public indexURL: string,
		public callbacks: IPyodideWorkerOnMessageCallbacks
	) {
		this.client = new PyodideWorkerClient(postMessage);
		this.svc = new PyodideWorkerService(this, callbacks);
	}

	private async loadPyodideAndPackages(): Promise<void> {
		this.pyodide = await pyodideModule.loadPyodide({
			indexURL: this.indexURL,
			stdout: (msg) => this.client.output({ msg, stream: 'stdout' }),
			stderr: (msg) => this.client.output({ msg, stream: 'stderr' })
			// stdin?: () => string; // TODO handle stdin here...see docstring
		});

		// this.pyodide.loadPackagesFromImports;
		// await self.pyodide.loadPackage(['numpy', 'pytz']);
	}

	init(): void {
		this.readyPromise = this.loadPyodideAndPackages()
			.then(() => this.client.startup({ status: 'ready' }))
			.catch((err) => this.client.startup({ status: 'failed', err }));
	}

	get handleWorkerMessage(): (e: MessageEvent<IWorkerCmdsUnion>) => Promise<void> {
		return this.svc.handleWorkerMessage;
	}
}

interface IMessageCallbacks extends IPyodideWorkerOnMessageCallbacks {
	_getPyo?: (w: PyodideWorker) => PyodideInterface;
	_castCaughtErrorToError?: (e: unknown) => Error;
}

/**
 * Route handlers for messages received by worker.
 */
class MessageCallbacks implements IMessageCallbacks {
	static async handleRunCmd(data: IRunCmdWorkerCmd, w: PyodideWorker): Promise<void> {
		const pyo = MessageCallbacks._getPyo(w);
		const { code, id, console_id } = data.payload;

		w.client.runStart({ id, console_id });

		try {
			await pyo.loadPackagesFromImports(data.payload.code);
			const returns = await pyo.runPythonAsync(code, {});
			w.client.runComplete({ id, console_id, returns, status: 'ok' });
		} catch (e) {
			console.error('Error in python run: ', e);
			const err = MessageCallbacks._castCaughtErrorToError(e);

			w.client.runComplete({ id, console_id, err, status: 'err' });
		}
	}

	static async handleRestart(data: IRestartWorkerCmd, worker: PyodideWorker): Promise<void> {
		// TODO Implement restart handler.
		console.error('Restart hadnler not implemented!', data);
		console.log(worker);
	}

	/**
	 * UTILITY FNs
	 */

	static _getPyo(w: PyodideWorker): PyodideInterface {
		const pyo = w.pyodide;
		if (!pyo) {
			throw new Error('asf');
		}
		return pyo;
	}

	static _castCaughtErrorToError(e: unknown): Error {
		let err: Error;
		if (typeof e === 'string') {
			err = new Error(e);
		} else if (e instanceof Error) {
			err = e;
		} else {
			err = new Error(`(Unknown error type) ${e}`);
		}
		return err;
	}
}

/**
 * MAIN
 */

self.pyodideWorker = new PyodideWorker(self.postMessage, PYODIDE_INDEX_URL, MessageCallbacks);
self.pyodideWorker.init();
// // hack to avoid overlay.ts's dom assumptions
// self.HTMLElement = function () {
// 	return {};
// };
// self.customElements = {
// 	get() {
// 		return [];
// 	}
// };
self.onmessage = async (e) => self.pyodideWorker.handleWorkerMessage(e);

// TODO Set onmessageerror event handler in worker.
// REFERENCE Worker events: https://developer.mozilla.org/en-US/docs/Web/API/Worker#events
// self.onmessageerror
// for sourcemap
console.log('pyodide.worker.js');
