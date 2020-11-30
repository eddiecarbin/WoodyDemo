import { DataEvent } from "app/controllers/DataEvent";
import { IState } from "app/framework/StateMachine";
import { GameEvents } from "../AppData";
import { AnimationControllerComponent } from "../components/AnimationControllerComponent";
import { ModelRendererComponent } from "../components/ModelRendererComponent";
import { StateMachineComponent } from "../components/StateMachineComponent";
import { WaveState } from "./WaveState";

export class IdleState implements IState {

    static NAME: string = "IdleState";

    private _component: StateMachineComponent;

    private _modelComponent: ModelRendererComponent;

    private _animationComponent: AnimationControllerComponent;

    private _callbackID: number;

    private _eventDispatcher : EventTarget;

    constructor(component: StateMachineComponent, dispatcher : EventTarget ) {
        this._component = component;
        this._eventDispatcher = dispatcher;
    }

    public Initialize(): void {
        this._modelComponent = this._component.getSibling(ModelRendererComponent.NAME) as ModelRendererComponent;
        this._animationComponent = this._component.getSibling(AnimationControllerComponent.NAME) as AnimationControllerComponent;
    }

    public Update(): void {
    }

    public OnEnter(): void {
        this._animationComponent.playAnimationAsync("idle_happy", true);
        this._callbackID = setTimeout(() => this.GoToWaveState(), 30000);

        this._eventDispatcher.dispatchEvent(new DataEvent(GameEvents.DISPLAY_DANCE_BUTTON, true));
    }
    
    private GoToWaveState(): void {
        this._component.stateMachine.GoToState(WaveState.NAME);
    }
    
    public OnExit(): void {
        this._animationComponent.stopAnimation("idle_happy");
        clearTimeout(this._callbackID);
        this._eventDispatcher.dispatchEvent(new DataEvent(GameEvents.DISPLAY_DANCE_BUTTON, false));
    }

    public Destroy(): void {

    }

    public GetName(): string {
        return IdleState.NAME;
    }
}