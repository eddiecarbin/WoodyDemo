import { IState } from "app/framework/StateMachine";
import { AnimationControllerComponent } from "../components/AnimationControllerComponent";
import { ModelRendererComponent } from "../components/ModelRendererComponent";
import { StateMachineComponent } from "../components/StateMachineComponent";
import { IdleState } from "./IdleState";
import { AudioManager } from "app/framework/AudioManager";

export class WaveState implements IState {

    static NAME: string = "WaveState";

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
        this._modelComponent.enabled = true;
        // this._animationComponent.beginAnimation();
        this.WaveAnimation();
    }

    private async WaveAnimation() {

        this._animationComponent.playAnimationAsync("wave", true);
        await AudioManager.instance.playSound("Hoowdy");
        this._animationComponent.stopAnimation("wave");

        if (this._component.stateMachine.GetCurrentState().GetName() == WaveState.NAME)
            this._component.stateMachine.GoToState(IdleState.NAME);
    }

    public OnExit(): void {
        this._animationComponent.stopAnimation("wave");
    }
    
    public Destroy(): void {
        this._modelComponent = null;
        this._animationComponent = null;
    }

    public GetName(): string {

        return WaveState.NAME;
    }
}