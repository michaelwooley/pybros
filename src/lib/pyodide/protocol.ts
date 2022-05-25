/**
 * Communication protocol/routes/handlers between the worker and client.
 */

// import type { TypedArray } from 'pyodide';

// TODO Remove if unnecessary
// const workerCmdSymbol: unique symbol = Symbol('workerCmdSymbol');
// const clientCmdSymbol: unique symbol = Symbol();

/**
 * Commands recieved BY worker FROM client.
 */
export enum WorkerCmdEnum {
	RUN_CMD = 'RUN_CMD', // Run a python command
	// RUN_SCRIPT, // TODO Run a python script (work out FS, etc.)
	// LOAD_PACKAGE, // Load a py package from... (work out details of pypi v. pkg w/ c bindings.)
	// LIST_PACKAGES, // List packages active/available in env.
	// VIEW_ENV, // List active objects in env.
	RESTART = 'RESTART' // Restart/reset the python console
	// ADD_CONSOLE, // Add console, returning ID
	// REMOVE_CONSOLE, // Remove console by ID
}

/**
 * Commands recieved BY client FROM worker.
 */
export enum ClientCmdEnum {
	STARTUP, // Signal sent when interpreter is ready to start

	OUTPUT, // stderr+stdout streams. Return valuen returned in RUN*_COMPLETE.
	RUN_START, // Start: Python cmd run
	RUN_COMPLETE, // Complete: Python cmd run w/ return value (thrown errors?)

	WORKER_ERROR // Worker-level error. Distinct from console errors.

	// ADD_CONSOLE_CALLBACK, // Response once added console.
	// REMOVE_CONSOLE_CALLBACK, // Response once removed console.
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PyodideCmdDataPayload {}

interface PyodideCmdData<C extends number, P extends PyodideCmdDataPayload> {
	// readonly sym: unique symbol;

	cmd: C;

	payload: P;
}

// ////////////////////////////////////////
//  WORKER COMMANDS
// ////////////////////////////////////////

export abstract class WorkerCmdData<P extends PyodideCmdDataPayload>
	implements PyodideCmdData<WorkerCmdEnum, P>
{
	static readonly sym: unique symbol = Symbol();
	public abstract cmd: WorkerCmdEnum;
	constructor(public payload: P) {}
}

export const workerCmdSymbol = WorkerCmdData.sym;

/****************************************************************
 * RUN_CMD
 ****************************************************************/
export interface RunCmdWorkerCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
	code: string;
	// context: Record<string, any>;
}

export class RunCmdWorkerCmd extends WorkerCmdData<RunCmdWorkerCmdPayload> {
	public cmd: WorkerCmdEnum = WorkerCmdEnum.RUN_CMD;
}

/****************************************************************
 * RESTART
 ****************************************************************/

export interface RestartWorkerCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
}

export class RestartWorkerCmd extends WorkerCmdData<RestartWorkerCmdPayload> {
	public cmd: WorkerCmdEnum = WorkerCmdEnum.RESTART;
}

// ////////////////////////////////////////
//  CLIENT COMMANDS
// ////////////////////////////////////////

export type ClientCmdData<
	C extends ClientCmdEnum,
	P extends PyodideCmdDataPayload
> = PyodideCmdData<C, P>;
// export interface ClientCmdData<C extends ClientCmdEnum, P extends PyodideCmdDataPayload>
// 	extends PyodideCmdData<C, P> {
// 	// cmd: ClientCmdEnum;
// 	// payload: P;
// }

// export abstract class ClientCmdData<P extends PyodideCmdDataPayload>
// 	implements PyodideCmdData<ClientCmdEnum, P>
// {
// 	static readonly sym: unique symbol = Symbol();
// 	public abstract cmd: ClientCmdEnum;
// 	constructor(public payload: P) {}
// }

// export const clientCmdSymbol = ClientCmdData.sym;

/****************************************************************
 * STARTUP
 ****************************************************************/

export interface StartupRunClientCmdPayload extends PyodideCmdDataPayload {
	status: 'ready' | 'failed';
	err?: Error;
	// console_id: string;
	// interruptBuffer: TypedArray;
}

// export class StartupRunClientCmd extends ClientCmdData<StartupRunClientCmdPayload> {
// 	public cmd: ClientCmdEnum = ClientCmdEnum.STARTUP;
// 	constructor(public payload: StartupRunClientCmdPayload) {
// 		super(payload);
// 	}
// }
export type StartupRunClientCmd = ClientCmdData<ClientCmdEnum.STARTUP, StartupRunClientCmdPayload>;

/****************************************************************
 * OUTPUT
 ****************************************************************/

export interface OutputClientCmdPayload extends PyodideCmdDataPayload {
	stream: 'stdout' | 'stderr';
	msg: string;
}

// export class OutputClientCmd extends ClientCmdData<OutputClientCmdPayload> {
// 	public cmd: ClientCmdEnum = ClientCmdEnum.OUTPUT;
// 	// payload: OutputClientCmdPayload;
// 	constructor(public payload: OutputClientCmdPayload) {
// 		super(payload);
// 	}
// }

export type OutputClientCmd = ClientCmdData<ClientCmdEnum.OUTPUT, OutputClientCmdPayload>;

/****************************************************************
 * RUN_START
 ****************************************************************/

export interface RunStartClientCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
}

// export class RunStartClientCmd extends ClientCmdData<RunStartClientCmdPayload> {
// 	public cmd: ClientCmdEnum = ClientCmdEnum.RUN_START;
// }
export type RunStartClientCmd = ClientCmdData<ClientCmdEnum.RUN_START, RunStartClientCmdPayload>;

/****************************************************************
 * RUN_COMPLETE
 ****************************************************************/

export interface RunCompleteClientCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
	status: 'ok' | 'err'; // QUESTION Where do errors go???
	returns: any; // TODO Pin this down...
}

// export class RunCompleteClientCmd extends ClientCmdData<RunCompleteClientCmdPayload> {
// 	public cmd: ClientCmdEnum = ClientCmdEnum.RUN_COMPLETE;
// }

export type RunCompleteClientCmd = ClientCmdData<
	ClientCmdEnum.RUN_COMPLETE,
	RunCompleteClientCmdPayload
>;

/****************************************************************
 * WORKER_ERROR
 ****************************************************************/

export interface WorkerErrorClientCmdPayload extends PyodideCmdDataPayload {
	status: 'ready' | 'failed';
	err?: Error;
}

// export class WorkerErrorClientCmd extends ClientCmdData<WorkerErrorClientCmdPayload> {
// 	public cmd: ClientCmdEnum = ClientCmdEnum.WORKER_ERROR;
// }

export type WorkerErrorClientCmd = ClientCmdData<
	ClientCmdEnum.WORKER_ERROR,
	WorkerErrorClientCmdPayload
>;

export type TClientCmds =
	| RunStartClientCmd
	| StartupRunClientCmd
	| RunCompleteClientCmd
	| WorkerErrorClientCmd
	| OutputClientCmd;

// TODO Remove
// const a = new WorkerErrorClientCmd({ status: 'ready' });
// if (a instanceof ClientCmdData) {
// 	null;
// }
