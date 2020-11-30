import { SoundData } from "app/models/AppData";
import { URLHelper } from "app/utils/net/URLHelper";
import { Model } from "./Model";
import * as BABYLON from 'babylonjs';

export class AudioManager extends Model {

    private static _instance: AudioManager;

    private _data: SoundData[];

    private constructor() { super() }

    private _soundMap: Map<string, any> = new Map<string, any>();

    public static get instance(): AudioManager {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }

        return AudioManager._instance;
    }

    public initialize(data: SoundData[], scene: BABYLON.Scene): Promise<boolean> {
        this._data = data;

        return new Promise<boolean>(async (resolve, reject) => {
            Promise.all(
                this._data.map(async (audio) => {
                    console.log(URLHelper.instance().resolveURL(audio.file));
                    this.loadSound(audio, scene).then((sound) => {
                        this._soundMap.set(audio.id, sound);
                    });
                })
            )
        });
    }

    private loadSound(audio: SoundData, scene: BABYLON.Scene): Promise<BABYLON.Sound> {
        return new Promise<BABYLON.Sound>((resolve, reject) => {
            let sound = new BABYLON.Sound(
                audio.id,
                URLHelper.instance().resolveURL(audio.file),
                scene,
                () => {
                    resolve(sound)
                }
            );
        })
    }

    public playSound(id: string): Promise<BABYLON.Sound> {
        let sound: BABYLON.Sound = this._soundMap.get(id);
        if (!sound) {
            return Promise.reject("I dont have sound");
        }
        return new Promise<BABYLON.Sound>(async (resolve, reject) => {
            sound.play();
            sound.onEndedObservable.add((eventDAta, eventState) => {
                resolve(sound);
            })
        });
    }
}