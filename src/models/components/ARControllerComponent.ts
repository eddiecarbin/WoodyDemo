
import { EntityComponent } from "app/framework/entity/EntityComponent";
import { ITicked } from "app/framework/TimeManager";
import { CharacterModelData } from "../AppData";
import { DelayableSignalFilter } from "app/utils/DelayableSignalFilter"
import { StateMachine } from "app/framework/StateMachine";
import { StateMachineComponent } from "./StateMachineComponent";
import { SpawnState } from "../states/SpawnState";
import { ExitState } from "../states/ExitState";

export class ARControllerComponent extends EntityComponent implements ITicked {

    static NAME: string = "ARControllerComponent";

    public data: CharacterModelData;

    private delayExitCheck: DelayableSignalFilter;

    private delayEnterCheck: DelayableSignalFilter;

    private isVisible: boolean;

    private _stateMachine : StateMachine;

    constructor(data: CharacterModelData) {
        super(ARControllerComponent.NAME);
        this.data = data;

        this.delayEnterCheck = new DelayableSignalFilter(3);
        this.delayExitCheck = new DelayableSignalFilter(0);
    }

    public onAdd(): void {
        this._stateMachine = (this.owner.getComponent(StateMachineComponent.NAME) as StateMachineComponent).stateMachine;
    
        this.isVisible = false;
    }

    public foundPattern(sucess: boolean): void {
        if (sucess) {
            if (this.delayEnterCheck.Update(true) && this.isVisible == false) {
                // dispaly in scene
                this.isVisible = true;
                this._stateMachine.GoToState(SpawnState.NAME);
                // this.modelComponent.enabled = true;
                // this.animationComponent.beginAnimation();
            }
            this.delayExitCheck.Update(false);
        } else {
            if (this.delayExitCheck.Update(true) && this.isVisible == true) {
                //  hide from scene
                this.isVisible = false;
                this._stateMachine.GoToState(ExitState.NAME)
                // this.modelComponent.enabled = false;
                // this.animationComponent.stopAnimation();
            }
            this.delayEnterCheck.Update(false);
        }
    }

    public update(): void {

    }
}