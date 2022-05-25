/**
 * Main thread interface for interacting with worker module
 */

import {
	ClientCmdEnum,
	WorkerCmdEnum,
	type IRestartWorkerCmdPayload,
	type IRunCmdWorkerCmdPayload,
	type IOutputClientCmd,
	type IRunCompleteClientCmd,
	type IRunStartClientCmd,
	type IStartupRunClientCmd,
	type IClientCmdsUnion,
	type IWorkerCmdsUnion,
	type IWorkerErrorClientCmd
} from './protocol';
import PyodideWorker from './pyodide.worker?worker';

export interface IPyodideClientOnMessageCallbacks {
	handleStartup?: (data: IStartupRunClientCmd, client: PyodideClient) => Promise<void>;
	handleOutput?: (data: IOutputClientCmd, client: PyodideClient) => Promise<void>;
	handleRunStart?: (data: IRunStartClientCmd, client: PyodideClient) => Promise<void>;
	handleRunComplete?: (data: IRunCompleteClientCmd, client: PyodideClient) => Promise<void>;
	handleWorkerError?: (data: IWorkerErrorClientCmd, client: PyodideClient) => Promise<void>;
}

/**
 * Submit outgoing requests to pyodide worker.
 */
export class PyodidePostMessage {
	constructor(public worker: Worker) {}

	private _postMessage(data: IWorkerCmdsUnion): void {
		// if (!this.worker) {
		// 	// QUESTION Want to add a pre-worker command buffer instead of an error here? Will
		// 	// call all postMessage once worker is set.
		// 	throw new Error(
		// 		'Worker is not yet set in PyodidePostMessage. Cannot communicate with worker.'
		// 	);
		// }
		this.worker.postMessage(data);
	}

	public runCmd(payload: IRunCmdWorkerCmdPayload): void {
		this._postMessage({ cmd: WorkerCmdEnum.RUN_CMD, payload });
	}

	public restart(payload: IRestartWorkerCmdPayload): void {
		this._postMessage({ cmd: WorkerCmdEnum.RESTART, payload });
	}

	get isReady(): boolean {
		return !!this.worker;
	}
}

/**
 * Handle incoming messages from pyodide worker.
 */
export class PyodideMessageHandler {
	constructor(public client: PyodideClient, public callbacks: IPyodideClientOnMessageCallbacks) {}

	public async handleWorkerMessage(e: MessageEvent<IClientCmdsUnion>): Promise<void> {
		const data = e.data;

		switch (data.cmd) {
			case ClientCmdEnum.STARTUP: {
				return await this.handleStartup(data);
			}
			case ClientCmdEnum.OUTPUT: {
				return await this.handleOutput(data);
			}
			case ClientCmdEnum.RUN_START: {
				return await this.handleRunStart(data);
			}
			case ClientCmdEnum.RUN_COMPLETE: {
				return await this.handleRunComplete(data);
			}
			case ClientCmdEnum.WORKER_ERROR: {
				return await this.handleWorkerError(data);
			}
			default: {
				throw new Error(`Unknown ClientCmdData command: ${data}`);
			}
		}
	}

	private async handleStartup(data: IStartupRunClientCmd): Promise<void> {
		const cb = this.callbacks.handleStartup || console.log;
		await cb(data, this.client);
	}

	private async handleOutput(data: IOutputClientCmd): Promise<void> {
		const cb = this.callbacks.handleOutput || console.log;
		await cb(data, this.client);
	}

	private async handleRunStart(data: IRunStartClientCmd): Promise<void> {
		const cb = this.callbacks.handleRunStart || console.log;
		await cb(data, this.client);
	}

	private async handleRunComplete(data: IRunCompleteClientCmd): Promise<void> {
		const cb = this.callbacks.handleRunComplete || console.log;
		await cb(data, this.client);
	}

	private async handleWorkerError(data: IWorkerErrorClientCmd): Promise<void> {
		const cb = this.callbacks.handleWorkerError || console.error;
		await cb(data, this.client);
	}
}

export class PyodideClient {
	pm: PyodidePostMessage;
	mh: PyodideMessageHandler;
	worker: Worker;

	constructor(callbacks: IPyodideClientOnMessageCallbacks) {
		this.mh = new PyodideMessageHandler(this, callbacks);

		this.worker = new PyodideWorker();
		this.worker.onmessage = this.mh.handleWorkerMessage;

		this.pm = new PyodidePostMessage(this.worker);
	}

	// async init() {}
}
