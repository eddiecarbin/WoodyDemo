
import { ITicked } from "../framework/TimeManager";

// import * as BABYLON from 'babylonjs';
// import * as MATERIALS from "babylonjs-materials";
// import 'babylonjs-materials';
import { SkyMaterial } from '@babylonjs/materials/sky/SkyMaterial';
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Camera } from "@babylonjs/core/Cameras/camera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { IShadowLight } from "@babylonjs/core/Lights/shadowLight";

export class Scene3DRendererBabylon implements ITicked {

    public canvas_draw: HTMLCanvasElement;

    public engine: Engine;
    public scene: Scene;
    public camera: Camera;
    public light: IShadowLight;
    public shadowGenerator : ShadowGenerator;
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

            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
            this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);
            this.scene.useRightHandedSystem = true;

            this.camera = new BABYLON.Camera('camera1', new BABYLON.Vector3(0, 0, 0), this.scene);

            console.log("createing sky material");
            // var myMaterial = new BABYLON.StandardMaterial("myMaterial", this.scene);
            let skyMaterial = new SkyMaterial("skyMaterial", null);

            // console.log("THE MATERIAL: " + skyMaterial);
            //this.camera.maxZ = 5000;
            // this.camera.minZ = .1;
            // this.camera.fov = 3;
            // this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);
            this.light = new BABYLON.DirectionalLight('light', new BABYLON.Vector3(0, 1, -1), this.scene);
            this.light.position.y=8;
            this.light.position.z=2;
            this.light.intensity = 2;
            // this.light.intensity = 0.5
            this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light)
            this.shadowGenerator.useBlurExponentialShadowMap = true;
            this.shadowGenerator.blurScale = 2;
            this.shadowGenerator.setDarkness(1);


            this.camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
            // console.log("clipPlane:",this.scene.clipPlane);
            // Add a camera to the scene and attach it to the canvas
            // this.camera = new BABYLON.ArcRotateCamera(
            //     "Camera",
            //     Math.PI / 2,
            //     Math.PI / 2,
            //     2,
            //     BABYLON.Vector3.Zero(),
            //     this.scene
            // );


            this.camera.attachControl(this.canvas_draw, true);
            // This is where you create and manipulate meshes
            // create a basic light, aiming 0,1,0 - meaning, to the sky

            resolve(true);

        });
    }

    public displayInsepctor(): void {
        this.scene.debugLayer.show({
            overlay: true,
            globalRoot: document.getElementById('inspector')
        });
    }
    public update(): void {
        this.scene.render();
    }
}