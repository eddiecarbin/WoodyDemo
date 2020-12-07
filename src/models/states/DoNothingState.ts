import { DataEvent } from "app/controllers/DataEvent";
import { IState, State } from "app/framework/StateMachine";
import { GameEvents } from "../AppData";
import { AnimationControllerComponent } from "../components/AnimationControllerComponent";
import { ModelRendererComponent } from "../components/ModelRendererComponent";
import { StateMachineComponent } from "../components/StateMachineComponent";

export class DoNothingState extends State {

    static NAME: string = "DoNothingState";

    private _component: StateMachineComponent;

    private _modelComponent: ModelRendererComponent;

    private _animationComponent: AnimationControllerComponent;

    private _eventDispatcher: EventTarget;

    constructor(component: StateMachineComponent, dispatcher: EventTarget) {
        super();
        this._component = component;
        this._eventDispatcher = dispatcher;
    }

    public Initialize(): void {
        this._modelComponent = this._component.getSibling(ModelRendererComponent.NAME) as ModelRendererComponent;
        this._animationComponent = this._component.getSibling(AnimationControllerComponent.NAME) as AnimationControllerComponent;
    }

    public OnEnter(): void {
        this._modelComponent.enabled = false;
        // this._animationComponent.beginAnimation();
        this._eventDispatcher.dispatchEvent(new DataEvent(GameEvents.DISPLAY_INFO_BUTTON, true));

    }
    
    public OnExit(): void {
        this._eventDispatcher.dispatchEvent(new DataEvent(GameEvents.DISPLAY_INFO_BUTTON, false));
    }

    public Destroy(): void {
        this._modelComponent = null;
        this._animationComponent = null;
    }

    public GetName(): string {

        return DoNothingState.NAME;
    }
}