
import { ITicked } from "../framework/TimeManager";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { IShadowLight, DirectionalLight, HemisphericLight } from "@babylonjs/core/Lights";
import { Color3, Color4, Vector3 } from "@babylonjs/core/Maths/math";
import "@babylonjs/core/Meshes/meshBuilder"
import "@babylonjs/core/Materials/standardMaterial";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
// import "@babylonjs/core/Debug/debugLayer";
// import "@babylonjs/inspector";


export class Scene3DRendererBabylon implements ITicked {

    public canvas_draw: HTMLCanvasElement;

    public engine: Engine;
    public scene: Scene;
    public camera: Camera;
    public light: IShadowLight;
    public shadowGenerator: ShadowGenerator;
    // private material : BABYLON.GridMaterial;

    private worker: Worker;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;


    public initialize(): Promise<boolean> {

        console.log("Scene3DRendererBabylon");

        return new Promise<boolean>(async (resolve, reject) => {

            this.canvas_draw = document.getElementById("canvas") as HTMLCanvasElement;

            this.engine = new Engine(this.canvas_draw, true, {
                preserveDrawingBuffer: true,
                stencil: true
            });

            this.scene = new Scene(this.engine);
            this.scene.clearColor = new Color4(0, 0, 0, 0);
            this.scene.ambientColor = new Color3(1, 1, 1);
            this.scene.useRightHandedSystem = true;

            this.camera = new Camera('camera1', new Vector3(0, 0, 0), this.scene);

            console.log("createing sky material");
            // var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
            // let skyMaterial = new SkyMaterial("skyMaterial", null);

            // console.log("THE MATERIAL: " + skyMaterial);
            //this.camera.maxZ = 5000;
            // this.camera.minZ = .1;
            // this.camera.fov = 3;
            // this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
            this.light = new DirectionalLight('light', new Vector3(0, -10, -20), this.scene);
            this.light.position.y = 100;
            this.light.position.z = -250;
            this.light.intensity = 2;
            this.shadowGenerator = new ShadowGenerator(1024, this.light)
            // this.shadowGenerator.useBlurExponentialShadowMap = true;
            // this.shadowGenerator.blurScale = 2;
            this.shadowGenerator.setDarkness(0.3);
            // let sphear = Mesh.CreateBox("lightsphear",20, this.scene);
            // sphear.position = this.light.position;

            this.camera.fovMode = Camera.FOVMODE_VERTICAL_FIXED;
           

            this.camera.attachControl(this.canvas_draw, true);


            var light2 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this.scene);
            light2.intensity = 0.3;
            resolve(true);

        });
    }

    public update(): void {
        this.scene.render();
    }
}