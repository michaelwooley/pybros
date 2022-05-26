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

export interface IPyodideMainOnMessageCallbacks {
    handleStartup?: (data: IStartupRunClientCmd, client: PyodideMain) => Promise<void>;
    handleOutput?: (data: IOutputClientCmd, client: PyodideMain) => Promise<void>;
    handleRunStart?: (data: IRunStartClientCmd, client: PyodideMain) => Promise<void>;
    handleRunComplete?: (data: IRunCompleteClientCmd, client: PyodideMain) => Promise<void>;
    handleWorkerError?: (data: IWorkerErrorClientCmd, client: PyodideMain) => Promise<void>;
}

/**
 * Client: Send messages to worker.
 */
export class PyodideMainClient {
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
}

/**
 * Service: Handle incoming messages from pyodide worker.
 */
export class PyodideMainService {
    constructor(public client: PyodideMain, public callbacks: IPyodideMainOnMessageCallbacks) {}

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
        // TODO Track running/not running in the PyodideMain class.
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

export class PyodideMain {
    client: PyodideMainClient;
    svc: PyodideMainService;
    worker: Worker;

    // TODO Add second callbacks layer for use by the main class.
    constructor(callbacks: IPyodideMainOnMessageCallbacks) {
        this.svc = new PyodideMainService(this, callbacks);

        this.worker = new PyodideWorker();
        // this.worker = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' });
        // this.worker = new Worker('/worker.js', { type: 'module' });

        // NOTE MUST do this. Otherwise, "this" within `handleWorkerMessage` is that of the worker,
        // 	not the service.
        // 	this.worker.onmessage = this.svc.handleWorkerMessage;
        this.worker.onmessage = async (e) => this.svc.handleWorkerMessage(e);

        this.client = new PyodideMainClient(this.worker);
    }

    // async init() {} // TODO Need init here??

    get isReady(): boolean {
        return !!this.worker && !!this.client;
    }
}

/**
 * Callbacks class
 * TODO Make this do something interesting.
 */
export class DefaultPyodideMainCallbacks implements IPyodideMainOnMessageCallbacks {
    static async handleStartup(data: IStartupRunClientCmd, client: PyodideMain): Promise<void> {
        console.info(data);
        console.log(client);
    }
    static async handleOutput(data: IOutputClientCmd, client: PyodideMain): Promise<void> {
        console.info(data);
        console.log(client);
    }
    static async handleRunStart(data: IRunStartClientCmd, client: PyodideMain): Promise<void> {
        console.info(data);
        console.log(client);
    }
    static async handleRunComplete(
        data: IRunCompleteClientCmd,
        client: PyodideMain
    ): Promise<void> {
        console.info(data);
        console.log(client);
    }
    static async handleWorkerError(
        data: IWorkerErrorClientCmd,
        client: PyodideMain
    ): Promise<void> {
        console.error(data);
        console.log(client);
    }
}
