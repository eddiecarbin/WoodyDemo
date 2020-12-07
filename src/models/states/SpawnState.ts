import { IState } from "app/framework/StateMachine";
import { AnimationControllerComponent } from "../components/AnimationControllerComponent";
import { ModelRendererComponent } from "../components/ModelRendererComponent";
import { StateMachineComponent } from "../components/StateMachineComponent";
import { WaveState } from "./WaveState";

export class SpawnState implements IState {

    static NAME: string = "SpawnState";

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
        // this._animationComponent.beginAnimation();
        this.SpawnAnimation();
    }

    private async SpawnAnimation() {

        this._modelComponent.enabled = true;
        await this._animationComponent.playAnimationAsync("stand", false);
        // this._animationComponent.playAnimationAsync("wave", true);
        // await AudioManager.instance.playSound("Hoowdy");
        // this._animationComponent.stopAnimation("wave");
        if (this._component.stateMachine.GetCurrentState().GetName() == SpawnState.NAME)
            this._component.stateMachine.GoToState(WaveState.NAME);
    }

    public OnExit(): void {

    }
    public Destroy(): void {
        this._modelComponent = null;
        this._animationComponent = null;
    }

    public GetName(): string {

        return SpawnState.NAME;
    }
}