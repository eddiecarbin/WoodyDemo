import { EntityComponent } from "../../framework/entity/EntityComponent";
import { CharacterModelData } from "../AppData";
import { degreesToRadians } from "app/framework/Utils";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { Color3, Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import "@babylonjs/core/Meshes/meshBuilder"
import "@babylonjs/core/Materials/standardMaterial";

export class ModelRendererComponent extends EntityComponent {

    static NAME: string = "ModelRendererComponent";

    public model: AbstractMesh;

    public root: AbstractMesh;

    private data: CharacterModelData;

    constructor(model: AbstractMesh, d: CharacterModelData, scene : Scene) {
        super(ModelRendererComponent.NAME);

        this.data = d;

        this.root = new AbstractMesh("model-root");
        // this.root = Mesh.CreateBox("model-root",1, scene);
        this.root.receiveShadows = true;
        this.model = model;
        let scale: number = this.data.scale;
        this.root.scaling.set(scale, scale, scale);
        this.root.position.set(150, 150, 0);

        this.model.rotate(Vector3.Left(), degreesToRadians(-90));
        this.model.parent = this.root;
    }

    public set enabled(value: boolean) {
        super.enabled = value;
        this.root.setEnabled(value);
    }

}

export interface IModelRendererComponent {

}