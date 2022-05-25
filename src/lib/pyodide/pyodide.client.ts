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

import { ClientCmdEnum, type TClientCmds } from './protocol';
import PyodideWorker from './pyodide.worker?worker';

class PyodideClient {
	worker: Worker;

	constructor() {
		this.worker = new PyodideWorker();
		this.worker.onmessage = this.handleWorkerMessage;
	}

	// async init() {}

	private async handleWorkerMessage(e: MessageEvent<TClientCmds>): Promise<void> {
		const data = e.data;

		switch (data.cmd) {
			case ClientCmdEnum.STARTUP: {
				const d = data.payload;
				return;
			}
			case ClientCmdEnum.OUTPUT: {
				null;
				return;
			}
			case ClientCmdEnum.RUN_START: {
				null;
				return;
			}
			case ClientCmdEnum.RUN_COMPLETE: {
				null;
				return;
			}
			case ClientCmdEnum.WORKER_ERROR: {
				const d = data;
				console.log(d);
				null;
				return;
			}
			default: {
				// return _exhaustiveCheck;
				throw new Error(`Unknown ClientCmdData command: ${data}`);
			}
		}
	}
}

export { PyodideClient };
