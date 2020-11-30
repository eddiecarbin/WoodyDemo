import { IState } from "app/framework/StateMachine";
import { AnimationControllerComponent } from "../components/AnimationControllerComponent";
import { ModelRendererComponent } from "../components/ModelRendererComponent";
import { StateMachineComponent } from "../components/StateMachineComponent";
import { DoNothingState } from "./DoNothingState";

export class ExitState implements IState {

    static NAME: string = "ExitState";

    private _component: StateMachineComponent;
    private _modelComponent: ModelRendererComponent;

    private _animationComponent: AnimationControllerComponent;
    constructor(component: StateMachineComponent) {
        this._component = component;
    }
    public Initialize(): void {
        this._modelComponent = this._component.getSibling(ModelRendererComponent.NAME) as ModelRendererComponent;
        this._animationComponent = this._component.getSibling(AnimationControllerComponent.NAME) as AnimationControllerComponent;
    }
    public Update(): void {

    }
    public OnEnter(): void {
        this._modelComponent.enabled = false;
        this._component.stateMachine.GoToState(DoNothingState.NAME);

    }
    public OnExit(): void {

    }
    public Destroy(): void {

    }
    public GetName(): string {

        return ExitState.NAME;
    }
}