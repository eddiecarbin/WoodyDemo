import { EntityComponent } from "app/framework/entity/EntityComponent";
import { StateMachine } from "app/framework/StateMachine";
import { ITicked } from "app/framework/TimeManager";


export class StateMachineComponent extends EntityComponent {

    static NAME: string = "StateMachineComponent";

    private _stateMachine: StateMachine;

    constructor() {
        super(StateMachineComponent.NAME);
        this._stateMachine = new StateMachine();
    }

    public get stateMachine(): StateMachine {
        return this._stateMachine;
    }

    public update(dt: number): void {
        this._stateMachine.update();
    }

    public onAdd(): void {
        this._stateMachine.Initialize();
    }
}