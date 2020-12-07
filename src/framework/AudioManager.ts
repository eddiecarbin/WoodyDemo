import { Scene } from "@babylonjs/core/scene";
import { SoundData } from "app/models/AppData";
import { URLHelper } from "app/utils/net/URLHelper";
import { Model } from "./Model";
import {Sound} from "@babylonjs/core/Audio"

export class AudioManager extends Model {

    private static _instance: AudioManager;

    private _data: SoundData[];

    private constructor() { super() }

    private _soundMap: Map<string, Sound> = new Map<string, Sound>();

    public static get instance(): AudioManager {
        if (!AudioManager._instance) {
            AudioManager._instance = new AudioManager();
        }

        return AudioManager._instance;
    }

    public initialize(data: SoundData[], scene: Scene): Promise<boolean> {
        this._data = data;

        return new Promise<boolean>(async (resolve, reject) => {
            Promise.all(
                this._data.map(async (audio) => {
                    console.log(URLHelper.instance().resolveURL(audio.file));
                    this.loadSound(audio, scene).then((sound) => {
                        this._soundMap.set(audio.id, sound);
                    });
                })
            ).then((eve)=>{
                resolve(true);
            });
        });
    }

    private loadSound(audio: SoundData, scene: Scene): Promise<Sound> {
        return new Promise<Sound>((resolve, reject) => {
            let sound = new Sound(
                audio.id,
                URLHelper.instance().resolveURL(audio.file),
                scene,
                () => {
                    resolve(sound)
                }
            );
        })
    }

    public playSound(id: string): Promise<Sound> {
        let sound: Sound = this._soundMap.get(id);
        if (!sound) {
            return Promise.reject("I dont have sound");
        }
        return new Promise<Sound>(async (resolve, reject) => {
            sound.play();
            sound.onEndedObservable.add((eventDAta, eventState) => {
                resolve(sound);
            })
        });
    }
}