// import * as THREE from "THREE"
import { EntityComponent } from "../../framework/entity/EntityComponent";
import * as BABYLON from 'babylonjs';
import { CharacterModelData } from "../AppData";
import { Vector3 } from "babylonjs";
import { degreesToRadians } from "app/framework/Utils";

export class ModelRendererComponent extends EntityComponent {

    static NAME: string = "ModelRendererComponent";

    public model: BABYLON.AbstractMesh;

    public root: BABYLON.AbstractMesh;

    // private testCube: THREE.Mesh;
    private data: CharacterModelData;

    constructor(model: BABYLON.AbstractMesh, d: CharacterModelData) {
        super(ModelRendererComponent.NAME);

        this.data = d;

        this.root = new BABYLON.AbstractMesh("model-root");
        // this.root.matrixAutoUpdate = false;

        this.model = model;
        let scale: number = this.data.scale;
        this.model.scaling.set(scale, scale, scale);
        this.model.position.set(150, 150, 0);

        this.model.rotate(BABYLON.Vector3.Left(), degreesToRadians(-90));
        // var geometry = new THREE.BoxGeometry(80, 80, 80);
        // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // this.testCube = new THREE.Mesh(geometry, material);
        // this.testCube.position.set(100, 100, 0);
        // this.model = this.testCube;
        this.model.parent = this.root;
        // this.root.add(this.model);
        // model.add(this.testCube);
    }

    public set enabled(value: boolean) {
        super.enabled = value;
        this.root.setEnabled(value);
    }

    // public setEnabled(value: boolean): void {
    //     this.root.setEnabled(value);
    // }
}

export interface IModelRendererComponent {

}