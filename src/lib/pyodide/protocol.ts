/**
 * Communication protocol/routes/handlers between the worker and client.
 */

// import type { TypedArray } from 'pyodide';

/**
 * Commands recieved BY worker FROM client.
 */
export enum WorkerCmdEnum {
	RUN_CMD, // Run a python command
	// RUN_SCRIPT, // TODO Run a python script (work out FS, etc.)
	// LOAD_PACKAGE, // Load a py package from... (work out details of pypi v. pkg w/ c bindings.)
	// LIST_PACKAGES, // List packages active/available in env.
	// VIEW_ENV, // List active objects in env.
	RESTART // Restart/reset the python console
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

// export abstract class WorkerCmdData<P extends PyodideCmdDataPayload>
// 	implements PyodideCmdData<WorkerCmdEnum, P>
// {
// 	static readonly sym: unique symbol = Symbol();
// 	public abstract cmd: WorkerCmdEnum;
// 	constructor(public payload: P) {}
// }
//
// export const workerCmdSymbol = WorkerCmdData.sym;
export type WorkerCmdData<
	C extends WorkerCmdEnum,
	P extends PyodideCmdDataPayload
> = PyodideCmdData<C, P>;

/****************************************************************
 * RUN_CMD
 ****************************************************************/
export interface IRunCmdWorkerCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
	code: string;
	// context: Record<string, any>;
}

// export class RunCmdWorkerCmd extends WorkerCmdData<RunCmdWorkerCmdPayload> {
// 	public cmd: WorkerCmdEnum = WorkerCmdEnum.RUN_CMD;
// }
export type RunCmdWorkerCmd = WorkerCmdData<WorkerCmdEnum.RUN_CMD, IRunCmdWorkerCmdPayload>;

/****************************************************************
 * RESTART
 ****************************************************************/

export interface IRestartWorkerCmdPayload extends PyodideCmdDataPayload {
	console_id?: string; // TODO Make non-optional once have multiple consoles
}

// export class RestartWorkerCmd extends WorkerCmdData<RestartWorkerCmdPayload> {
// 	public cmd: WorkerCmdEnum = WorkerCmdEnum.RESTART;
// }

export type RestartWorkerCmd = WorkerCmdData<WorkerCmdEnum.RESTART, IRestartWorkerCmdPayload>;

export type TWorkerCmds = RunCmdWorkerCmd | RestartWorkerCmd;

// ////////////////////////////////////////
//  CLIENT COMMANDS
// ////////////////////////////////////////

export type ClientCmdData<
	C extends ClientCmdEnum,
	P extends PyodideCmdDataPayload
> = PyodideCmdData<C, P>;

/****************************************************************
 * STARTUP
 ****************************************************************/

export interface IStartupRunClientCmdPayload extends PyodideCmdDataPayload {
	status: 'ready' | 'failed';
	err?: Error;
	// console_id: string;
	// interruptBuffer: TypedArray;
}

export type StartupRunClientCmd = ClientCmdData<ClientCmdEnum.STARTUP, IStartupRunClientCmdPayload>;

/****************************************************************
 * OUTPUT
 ****************************************************************/

export interface IOutputClientCmdPayload extends PyodideCmdDataPayload {
	stream: 'stdout' | 'stderr';
	msg: string;
}

export type OutputClientCmd = ClientCmdData<ClientCmdEnum.OUTPUT, IOutputClientCmdPayload>;

/****************************************************************
 * RUN_START
 ****************************************************************/

export interface IRunStartClientCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
}

export type RunStartClientCmd = ClientCmdData<ClientCmdEnum.RUN_START, IRunStartClientCmdPayload>;

/****************************************************************
 * RUN_COMPLETE
 ****************************************************************/

export interface IRunCompleteClientCmdPayload extends PyodideCmdDataPayload {
	console_id: string;
	id: string;
	status: 'ok' | 'err'; // QUESTION Where do errors go???
	returns: any; // TODO Pin this down...
}

export type RunCompleteClientCmd = ClientCmdData<
	ClientCmdEnum.RUN_COMPLETE,
	IRunCompleteClientCmdPayload
>;

/****************************************************************
 * WORKER_ERROR
 ****************************************************************/

export interface IWorkerErrorClientCmdPayload extends PyodideCmdDataPayload {
	status: 'ready' | 'failed';
	err?: Error;
}

export type WorkerErrorClientCmd = ClientCmdData<
	ClientCmdEnum.WORKER_ERROR,
	IWorkerErrorClientCmdPayload
>;

export type TClientCmds =
	| StartupRunClientCmd
	| OutputClientCmd
	| RunStartClientCmd
	| RunCompleteClientCmd
	| WorkerErrorClientCmd;
