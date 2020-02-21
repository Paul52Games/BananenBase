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

	token: string
	loading: boolean
	toConfigure: object
	loadingModules: boolean
	commandCheck: []
}

declare class Module {
	constructor(
		options: ModuleOptions
	)
	afterConfigure?(): void
	beforeReady?(): void
	onReady?(): void
	onMessage?(): void

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
	}
}

declare namespace BananenBase {
	export class command {
		constructor(
			BananenBase: object, 
			settings: {
				name: string,
				description?: string,
				usage?: string,
				examples?: [string?],
				args?: [["required" | "optional", string]]
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