
export class Mediator {
    public dispatcher: EventTarget = new EventTarget();

    protected contextDispatcher: EventTarget;

    constructor(dispatcher: EventTarget) {
        this.contextDispatcher = dispatcher;
    }

}
