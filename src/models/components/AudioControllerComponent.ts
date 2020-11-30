import { EntityComponent } from "app/framework/entity/EntityComponent";
import { SoundData } from "../AppData";


export class AudioControllerComponent extends EntityComponent {

    static NAME: string = "AudioControllerComponent";

    constructor() {
        super(AudioControllerComponent.NAME);
    }

    public playSound(id: string): void {

    }
}