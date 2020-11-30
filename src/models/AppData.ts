export interface AppJson {
    name: string;
    assetURL: string;
    workerURL: string;
    sounds: SoundData[];
    characters: CharacterModelData[];
}

export interface SoundData {
    id: string;
    file: string;
}
export interface CharacterModelData {
    id: string;
    modelURL: string;
    file: string;
    name: string;
    markerData: MarkerData;
    scale: number;
    animations: AnimationData[];
}

export interface MarkerData {
    width: number;
    height: number;
    dpi: number;
    url: string;
    offsetX: number;
    offsetY: number;
}

export interface AnimationData {
    file: string;
    modelURL: string;
    type: string;
}

export enum GameEvents {
    DANCE = "GameEvent:CharacterDance",
    DISPLAY_DANCE_BUTTON = "GameEvent:DanceButton",
    DISPLAY_INFO_BUTTON = "GameEvent:InfoButton"
}

export class GameParam {
    // default 1080p
    static screenWidth: number = 480;
    static screenHeight: number = 640;
    // default 1080p
    // static screenWidth: number = 640;
    // static screenHeight: number = 480;
}

export enum AnimationType {
    Idle = "idle",
    Walk = "walk",
    Run = "run",
    Turn = "turn"
}


export function isMobile(): boolean {
    return /Android|mobile|iPad|iPhone/i.test(navigator.userAgent);
}