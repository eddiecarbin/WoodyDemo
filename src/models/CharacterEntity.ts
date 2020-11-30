import { Entity } from "../framework/entity/Entity";
import { ModelRendererComponent } from "./components/ModelRendererComponent";
import * as BABYLON from 'babylonjs';

export class CharacterEntity extends Entity {

    public getModelRoot(): BABYLON.AbstractMesh {
        let _modelComponent: ModelRendererComponent = this.getComponent(ModelRendererComponent) as ModelRendererComponent;
        return _modelComponent.root;
    }

    public getModel(): BABYLON.AbstractMesh {
        let _modelComponent: ModelRendererComponent = this.getComponent(ModelRendererComponent) as ModelRendererComponent;
        return _modelComponent.model;
    }
}