/**
 * Client interface for interacting with worker module
 *
 *
 * const pyodideWorker = new Worker("./build/webworker.js");

const callbacks = {};

pyodideWorker.onmessage = (event) => {
  const { id, ...data } = event.data;
  const onSuccess = callbacks[id];
  delete callbacks[id];
  onSuccess(data);
};

const asyncRun = (() => {
  let id = 0; // identify a Promise
  return (script, context) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      pyodideWorker.postMessage({
        ...context,
        python: script,
        id,
      });
    });
  };
})();

export { asyncRun };
 */

import {
	ClientCmdEnum,
	WorkerCmdEnum,
	type IRestartWorkerCmdPayload,
	type IRunCmdWorkerCmdPayload,
	type OutputClientCmd,
	type RunCompleteClientCmd,
	type RunStartClientCmd,
	type StartupRunClientCmd,
	type TClientCmds,
	type TWorkerCmds,
	type WorkerErrorClientCmd
} from './protocol';
import PyodideWorker from './pyodide.worker?worker';

export interface IPyodideOnMessageHandlerCallbacks {
	handleStartup?: (data: StartupRunClientCmd, client: PyodideClient) => Promise<void>;
	handleOutput?: (data: OutputClientCmd, client: PyodideClient) => Promise<void>;
	handleRunStart?: (data: RunStartClientCmd, client: PyodideClient) => Promise<void>;
	handleRunComplete?: (data: RunCompleteClientCmd, client: PyodideClient) => Promise<void>;
	handleWorkerError?: (data: WorkerErrorClientCmd, client: PyodideClient) => Promise<void>;
}

/**
 * Submit outgoing requests to pyodide worker.
 */
export class PyodidePostMessage {
	constructor(public worker: Worker) {}

	private _postMessage(data: TWorkerCmds): void {
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
export class PyodideOnMessageHandler {
	/**
	 * Init the handler.
	 *
	 * @param pm Cmd handler. Included as an argument in various callbacks.
	 */
	constructor(public client: PyodideClient, public callbacks: IPyodideOnMessageHandlerCallbacks) {}

	public async handleWorkerMessage(e: MessageEvent<TClientCmds>): Promise<void> {
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
				// return _exhaustiveCheck;
				throw new Error(`Unknown ClientCmdData command: ${data}`);
			}
		}
	}

	private async handleStartup(data: StartupRunClientCmd): Promise<void> {
		const cb = this.callbacks.handleStartup || console.log;
		cb(data, this.client);
	}

	private async handleOutput(data: OutputClientCmd): Promise<void> {
		const cb = this.callbacks.handleOutput || console.log;
		cb(data, this.client);
	}

	private async handleRunStart(data: RunStartClientCmd): Promise<void> {
		const cb = this.callbacks.handleRunStart || console.log;
		cb(data, this.client);
	}

	private async handleRunComplete(data: RunCompleteClientCmd): Promise<void> {
		const cb = this.callbacks.handleRunComplete || console.log;
		cb(data, this.client);
	}

	private async handleWorkerError(data: WorkerErrorClientCmd): Promise<void> {
		const cb = this.callbacks.handleWorkerError || console.error;
		cb(data, this.client);
	}
}

export class PyodideClient {
	pm: PyodidePostMessage;
	om: PyodideOnMessageHandler;
	worker: Worker;

	constructor(callbacks: IPyodideOnMessageHandlerCallbacks) {
		this.om = new PyodideOnMessageHandler(this, callbacks);

		this.worker = new PyodideWorker();
		this.worker.onmessage = this.om.handleWorkerMessage;

		this.pm = new PyodidePostMessage(this.worker);
	}

	// async init() {}
}
