import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Entity } from "../framework/entity/Entity";
import { ModelRendererComponent } from "./components/ModelRendererComponent";

export class CharacterEntity extends Entity {

    public getModelRoot(): AbstractMesh {
        let _modelComponent: ModelRendererComponent = this.getComponent(ModelRendererComponent) as ModelRendererComponent;
        return _modelComponent.root;
    }

    public getModel(): AbstractMesh {
        let _modelComponent: ModelRendererComponent = this.getComponent(ModelRendererComponent) as ModelRendererComponent;
        return _modelComponent.model;
    }
}