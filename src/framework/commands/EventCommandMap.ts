

export class EventCommandMap {

	protected eventDispatcher: EventTarget;

	protected eventTypeMap: Map<string, Map<string, Map<any, CommandMapping>>>;

	constructor(eventDispatcher: EventTarget) {

		this.eventDispatcher = eventDispatcher;

		//this.injector.map()
		this.eventTypeMap = new Map<string, Map<string, Map<any, CommandMapping>>>();
	}

	public destroy(): void {

		this.unmapEvents();

		this.eventDispatcher = null;

		this.eventTypeMap.clear();

	}

	public executeCommand(commandClassOrObject: any): void {
		var command: ICommand = commandClassOrObject;

		if (commandClassOrObject instanceof Function) {
			// this.injector.bind(commandClassOrObject).toFactory(commandClassOrObject);
			// command = this.injector.get(commandClassOrObject);
			// this.injector.unbind(commandClassOrObject);
		}
		else {
			// this.injector.injectInto(command);
		}

		command["execute"]();

		//command not complete after execution
		// should add asynccommand
		// if (command.hasOwnProperty("isComplete") && !command["isComplete"]) {
		// 	//command.onComplete.addOnce( onCommandComplete );
		// 	throw new Error("whoo hoo first async");
		// }

	}

	public execute(commandClass: any, payload: object = null, payloadClass: any = null, named: string = ''): void {

		var command: ICommand;

		// hack for now was double injecting dont know what else to do
		if (payload != null || payloadClass != null) {

			payloadClass = payloadClass || payload.constructor;

			var bindName: string = payloadClass.toString() + named;

			// this.injector.bind(bindName).toConstantValue(payload);

			// command = this.injector.get(commandClass);

			// this.injector.unbind(bindName);

			command["execute"]();

			//command not complete after execution
			// should add asynccommand
			/*if ( command is AsyncCommand && !command.isComplete )
			{
				command.onComplete.addOnce( onCommandComplete );
			}*/
		}
		else {
			this.executeCommand(command);
		}

	}


	public hasEventCommand(eventType: string, commandClass: any, eventClass: any = null): boolean {
		var eventClassMap: Map<string, Map<any, CommandMapping>> = this.eventTypeMap.get(eventType);

		if (eventClassMap == null)
			return false;

		var callbacksByCommandClass: Map<any, CommandMapping> = eventClassMap.get(eventClass as string || eventType);

		if (callbacksByCommandClass == null)
			return false;

		return callbacksByCommandClass.has(commandClass);
	}

	public mapCommand(type: any, commandClass: any, oneShot: boolean = false): CommandMapping {
		return this.mapEvent(type, commandClass, null, oneShot);
	}


	public unmapEvent(eventType: string, commandClass: any, eventClass: any = null): void {
		var eventClassMap: Map<string, Map<any, CommandMapping>> = this.eventTypeMap.get(eventType);

		if (eventClassMap == null)
			return;

		var callbacksByCommandClass: Map<any, CommandMapping> = eventClassMap.get(eventClass as string || eventType);

		if (callbacksByCommandClass == null)
			return;

		var commandMapping: CommandMapping = callbacksByCommandClass.get(commandClass);

		if (commandMapping == null)
			return;

		this.eventDispatcher.removeEventListener(eventType, commandMapping.callback, false);

		commandMapping.destroy();

		callbacksByCommandClass.delete(commandClass);
	}

	public unmapEvents(): void {

		//new Map<string, Map<string, Map<any, CommandMapping>>>();

		this.eventTypeMap.forEach((classMap: Map<string, Map<any, CommandMapping>>, eventType: string) => {
			classMap.forEach((callbackMap: Map<any, CommandMapping>, keys: string) => {
				callbackMap.forEach((commandMapping: CommandMapping, a: any) => {
					this.eventDispatcher.removeEventListener(eventType, commandMapping.callback, false);
					commandMapping.destroy();

				});
			});
		});
		this.eventTypeMap.clear();
		this.eventTypeMap = new Map<string, Map<string, Map<any, CommandMapping>>>();
	}


	protected mapEvent(eventType: string, commandClass: any, eventClass: any = null, oneshot: boolean = false): CommandMapping {

		eventClass = eventClass || Event;

		var commandMapping: CommandMapping = new CommandMapping();

		var eventClassMap: Map<string, Map<any, CommandMapping>> = this.eventTypeMap.get(eventType) || (this.eventTypeMap.set(eventType, new Map<string, Map<any, CommandMapping>>())).get(eventType);

		var callbacksByCommandClass: Map<any, CommandMapping> = eventClassMap.get(eventClass) || (eventClassMap.set(eventClass, new Map<any, CommandMapping>())).get(eventClass);

		if (callbacksByCommandClass.has(commandClass)) {
			//throw new Error( ContextError.E_COMMANDMAP_OVR + ' - eventType (' + eventType + ') and Command (' + commandClass + ')' );
		}
		var callback: EventListenerOrEventListenerObject = function (event: Event): void {
			this.routeEventToCommand(this.event, commandClass, commandMapping, oneshot, eventClass);
		};

		commandMapping.callback = callback;

		this.eventDispatcher.addEventListener(eventType, callback.bind(this));

		callbacksByCommandClass.set(commandClass, commandMapping);

		return commandMapping;
	}

	protected routeEventToCommand(event: Event, commandClass: any, mapper: CommandMapping, oneshot: boolean, originalEventClass: any): boolean {
		if (!(event instanceof originalEventClass))
			return false;

		this.execute(commandClass, event);

		if (oneshot)
			this.unmapEvent(event.type, commandClass, originalEventClass);

		return true;
	}

}

export class CommandMapping {

	private _playOnce: boolean = false;

	public callback: EventListenerOrEventListenerObject;

	constructor() {
	}

	public destroy(): void {
		this.callback = null;
	}

	public playOnce(value: boolean): CommandMapping {

		this._playOnce = value;

		return this;
	}
}

export interface ICommand {
	execute(): void;
}


export abstract class Command implements ICommand {
	public abstract execute(): void;
}