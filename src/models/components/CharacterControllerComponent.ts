import { EntityComponent } from "app/framework/entity/EntityComponent";
import { CharacterModelData } from "../AppData";

export class CharacterControllerComponent extends EntityComponent{
    
    static NAME : string = "InsectControllerComponent";

    public data : CharacterModelData;

    constructor( data : CharacterModelData){
        super(CharacterControllerComponent.NAME);
        this.data = data;
    }
}