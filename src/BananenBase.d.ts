import * as discord from "discord.js";

declare class BananenBase {
	constructor(
		token: string
	)

	addModule(
		name: string | Module | [...(string | Module)],
		options?: {key: any}
	): BananenBase

	ready(
		func: (BananenBase: BananenBase) => void
	): Promise<BananenBase>

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
	onMessage?(message: discord.Message): Promise<boolean> | boolean
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
			enabled?: boolean
		},
		args?: {
			name: string,
			value: any
		}
	)

	ready?(): void 

	run(
		message: discord.Message,
		args: [...string?]
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
	export let Command = cmd;
	export let Event = evnt;
	export let Module = Module;
	export let Database = DatabaseClass;

	export let colors = colorsFunction;
	export let version = string;
	export let modules = {
		loader: BananenBaseModule_Loader,
		start: BananenBaseModule_Start,
		alias: BananenBaseModule_Alias,
		args: BananenBaseModule_Args,
		database: BananenBaseModule_Database,
		messageFlags: BananenBaseModule_MessageFlags,
		security: BananenBaseModule_Security
	};
}

declare function colorsFunction(text: string): colorsInstance;

declare interface colorsInstance {
	private out: string,
	public done(): string,
	public log(): undefined,
	public black(): colorsInstance,
	public red(): colorsInstance,
	public green(): colorsInstance,
	public yellow(): colorsInstance,
	public blue(): colorsInstance,
	public magenta(): colorsInstance,
	public cyan(): colorsInstance,
	public white(): colorsInstance,
	public reset(): colorsInstance
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
	): Promise<[...string]>
	loadCommands(
		folder: string
	): Promise<undefined>
	loadEvents(
		folder: string
	): Promise<undefined>
}

declare class BananenBaseModule_Alias extends Module {
	constructor()
	onMessage(): undefined
}

declare class BananenBaseModule_Args extends Module {
	constructor()
	beforeCommandExecute(): boolean
}

declare class DatabaseClass {
	constructor(
		options: {
		name: string,
		development?: boolean,
		cwd?: string,
		caching: string,
		compression?: boolean
	})

	public isReady(func: function): Promise<undefined>
	public get(key: string): Promise<any>
	public set(key: string, value: any): Promise<boolean>
	public delete(key: string): Promise<boolean>

	private sterilize(data: any): string
	private desterilize(data: string): any
	private sterilizeKey(key: string): string

	private compression: boolean
	private caching: boolean
	private memory: object
	private sqlite: object
	
	public ready: boolean
}

declare class BananenBaseModule_Database extends Module {
	constructor()
	afterConfigure(): undefined
	onMessage(): undefined
}

declare class BananenBaseModule_MessageFlags extends Module {
	constructor()
	afterConfigure(): undefined
	onMessage(): undefined
}

declare class BananenBaseModule_Security extends Module {
	constructor()
	afterConfigure(): undefined
	beforeCommandExecute(): boolean
}

export = BananenBase;