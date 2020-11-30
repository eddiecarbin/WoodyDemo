
// Notes
// 1. What a finite state machine is
// 2. Examples where you'd use one
//     AI, Animation, Game State
// 3. Parts of a State Machine
//     States & Transitions
// 4. States - 3 Parts
//     Tick - Why it's not Update()
//     OnEnter / OnExit (setup & cleanup)
// 5. Transitions
//     Separated from states so they can be re-used

import { ITicked } from "./TimeManager";

//     Easy transitions from any state
export interface IState {
    Update(): void;
    OnEnter(): void;
    OnExit(): void;
    Destroy(): void;
    GetName(): string;
    Initialize(): void;
}

export class State implements IState {
    public Update(): void {

    }

    public OnEnter(): void {

    }

    public OnExit(): void {

    }

    public Destroy(): void {

    }

    public GetName(): string {
        return "";
    }

    public Initialize(): void {

    }
}


export class StateMachine implements ITicked {
    private _currentState: IState;

    private _states: Map<string, IState> = new Map<string, IState>();

    public update(): void {
        this._currentState?.Update();
    }

    public GoToState(id: string): void {
        let state: IState = this.GetState(id);

        if ( !state ){
            throw console.error("Missing state: " + id);
        }
        if (state == this._currentState)
            return;

        console.log("Transition to state: " + id);
        this._currentState?.OnExit();
        this._currentState = state;
        this._currentState.OnEnter();
    }

    public Initialize(): void {
        this._states.forEach((state: IState, key: string) => {
            state.Initialize();
        });
    }

    public GetCurrentState(): IState {
        return this._currentState;
    }

    public GetState(id: string): IState {
        return this._states.get(id);
    }

    public AddState(id: string, state: IState): void {
        this._states.set(id, state);
    }

    public Destroy(): void {
        this._states.forEach((state: IState, key: string) => {
            state.Destroy();
        });
    }
}