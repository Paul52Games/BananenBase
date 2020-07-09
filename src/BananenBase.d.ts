import * as discord from "discord.js";

declare class BananenBase {
	constructor(
		token: string
	)

	addModule(
		name: string | Module,
		options?: {}
	): BananenBase

	ready(
		func: (BananenBase: BananenBase) => void
	): promise

	set(
		key: string,
		value: any
	): BananenBase

	token: string
	loading: boolean
	toConfigure: object
	loadingModules: boolean
	commandCheck: []
	prefix: string
}

declare class Module {
	constructor(
		options: ModuleOptions
	)
	afterConfigure?(): void
	beforeReady?(): void
	onReady?(): void
	onMessage?(message: discord.Message): promise | boolean
	internal_BB_Execute?(name: string, ...args: any): any
	beforeCommandExecute?(message: discord.Message, command: cmd)

	BananenBase: object
	dependencies: object
	name: string
	toConfigute: {
		key?: any
	}
}
interface ModuleOptions {
	name: string,
	dependencies?: [string],
	toConfigute?: {
		key: any
	},
	priority?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}
declare class cmd {
	constructor(
		BananenBase: object, 
		settings: {
			name: string,
			description?: string,
			usage?: string,
			examples?: [string?],
			args?: [["required" | "optional", string]],
			enabled?: boolean
		}, args?: {
			name: string,
			value: any
		}
	)

	ready?(): void 

	run(
		message: discord.Message,
		args: [string?]
	): void
}
declare class evnt {
	constructor(
		BananenBase: object, 
		settings: {
			event: string,
			enabled?: boolean
		}
	)

	run(...args: any): void
}

declare namespace BananenBase {
	export let command = cmd;
	export let event = evnt;
	export let modules = {
		loader: BananenBaseModule_Loader,
		start: BananenBaseModule_Start
	}
}

declare class BananenBaseModule_Start extends Module {
	constructor()
	onload(): void
	start(): void
}

declare class BananenBaseModule_Loader extends Module {
	constructor()
	afterConfigure(): void
	getFiles(
		folder: string
	): Promise
	loadCommands(
		folder: string
	): Promise
	loadEvents(
		folder: string
	): Promise
	loadProcessEvents(
		folder: string
	): Promise
	loadFunctions(
		folder: string
	): Promise
}

export = BananenBase;