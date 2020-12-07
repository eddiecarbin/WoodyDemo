import { CharacterFactoryBabylon } from "../loaders/CharacterFactoryBabylon";
import { ITicked } from "../framework/TimeManager";
import { CharacterModelData, GameEvents, MarkerData } from "./AppData";
import { Entity } from "../framework/entity/Entity";
import { Model } from "../framework/Model";

import { CharacterEntity } from "./CharacterEntity";
import { ARControllerComponent } from "./components/ARControllerComponent";
import { PixarARContext } from "app/PixarARContext";
import { StateMachineComponent } from "./components/StateMachineComponent";
import { DanceState } from "./states/DanceState";
import { SpawnState } from "./states/SpawnState";
import { Scene } from "@babylonjs/core/scene";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { Camera } from "@babylonjs/core/Cameras/camera";

export class ARWorkerController extends Model implements ITicked {

    static LOADED_EVENT: string = "ARWorker_LOADED_EVENT";

    static IsCameraSet: boolean = false;

    private worker: Worker;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;

    // private ox: number;
    // private oy: number;

    private interpolationFactor: number = 15;
    
    private world: any;

    private camera: Camera;

    private root: AbstractMesh;

    private markerData: MarkerData;

    private _hadProcessed: boolean = false;

    private _hasFound: boolean = false;

    private _lastTranslation: Vector3;

    private _deltaAccuracy: number = 10;

    private _frameDrops: number = 0;

    private trackedMatrix: any = {
        // for interpolation
        delta: [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ],
        interpolated: [
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        ]
    }
    public _entities: Entity[] = [];

    constructor(camera: Camera, input_width: number, input_height: number) {
        super();
        this.camera = camera;
        this.vw = input_width;
        this.vh = input_height;
    }

    public getRoot(): AbstractMesh {
        return this.root;
    }

    private makeDance(): void {

        let stateMachine: StateMachineComponent = this._entities[0].getComponent(StateMachineComponent.NAME) as StateMachineComponent;
        if (stateMachine.stateMachine.GetCurrentState() && stateMachine.stateMachine.GetCurrentState().GetName() != SpawnState.NAME)
            stateMachine.stateMachine.GoToState(DanceState.NAME);
    }

    public initialize(data: CharacterModelData, context: PixarARContext): Promise<boolean> {
        let scene: Scene = context.sceneRenderer.scene;

        this.root = new AbstractMesh("root-" + data.id, scene);
        context.eventDispatcher.addEventListener(GameEvents.DANCE, () => {
            this.makeDance();
        });
        this.markerData = data.markerData;
        return new Promise<boolean>(async (resolve, reject) => {
            await CharacterFactoryBabylon.createCharacterEntity(data, context).then((enity) => {
                this._entities.push(enity);

                let _modelRoot: AbstractMesh = (enity as CharacterEntity).getModelRoot();
                _modelRoot.setParent(this.root);
                this.worker = new Worker('./resources/jsartoolkit5/artoolkit/artoolkit.wasm_worker.js');
                this.worker.onmessage = async (ev) => {
                    await this.load().then(() => {
                        resolve(true);
                    });
                };
            });

        });
    }

    public load(): Promise<boolean> {

        return new Promise<boolean>(async (resolve, reject) => {
            var camera_para = '../../data/camera_para.dat';
            // var camera_para = '../../data/camera_para-iPhone 5 rear 640x480 1.0m.dat';

            var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);

            this.w = this.vw * pscale;
            this.h = this.vh * pscale;
            this.pw = Math.max(this.w, (this.h / 3) * 4);
            this.ph = Math.max(this.h, (this.w / 4) * 3);
            // this.ox = (this.pw - this.w) / 2;
            // this.oy = (this.ph - this.h) / 2;

            // this.canvas_process.width = this.pw;
            // this.canvas_process.height = this.ph;

            // this.canvas_process.style.clientWidth = this.pw + "px";
            // this.canvas_process.style.clientHeight = this.ph + "px";

            // console.log(this.markerData.url);
            this.worker.postMessage({
                type: 'load',
                pw: this.pw,
                ph: this.ph,
                camera_para: camera_para,
                marker: this.markerData.url
            });

            this.worker.onmessage = (ev) => {
                var msg = ev.data;
                switch (msg.type) {
                    case 'loaded': {
                        if (!ARWorkerController.IsCameraSet) {
                            var proj = JSON.parse(msg.proj);
                            var ratioW = this.pw / this.w;
                            var ratioH = this.ph / this.h;
                            proj[0] *= ratioW;
                            proj[4] *= ratioW;
                            proj[8] *= ratioW;
                            proj[12] *= ratioW;
                            proj[1] *= ratioH;
                            proj[5] *= ratioH;
                            proj[9] *= ratioH;
                            proj[13] *= ratioH;

                            // console.log("--------------------------- init camera --------------------------------");
                            // console.log(msg.proj);
                            // console.log(proj);
                            // console.log(this.getArrayMatrix(proj));
                            let matrix: Matrix = Matrix.FromArray(this.getArrayMatrix(proj));

                            let pos = Vector3.TransformCoordinates(new Vector3(0, 0, 0), matrix);

                            let rotMatrix: Matrix = matrix.getRotationMatrix();
                            let rotation: Quaternion = new Quaternion().fromRotationMatrix(rotMatrix);
                            // console.log(rotation);
                            // console.log(rotation.toEulerAngles());
                            // console.log("rotation");

                            // this.camera.

                            // console.log("camera matrix: " + matrix.toArray());
                            // console.log("matrix position: " + pos);
                            // console.log("camera current position: " + this.camera.position);
                            // this.camera.freezeProjectionMatrix(matrix);
                            // console.log("camera current position after: " + this.camera.position);
                            // this.camera.maxZ = 5000;
                            // this.camera.minZ = .1;
                            this.camera.fov = 1;
                            this.camera.fovMode = Camera.PERSPECTIVE_CAMERA;

                            // this.camera.maxZ = -5000;
                            ARWorkerController.IsCameraSet = true;
                        }
                        break;
                    }
                    case "endLoading": {
                        if (msg.end == true)
                            resolve(true);
                        break;
                    }
                    case 'found': {
                        this.found(msg);
                        break;
                    }
                    case 'not found': {
                        this.found(null);
                        break;
                    }
                }
                this._hadProcessed = true;
            };
        });
    };

    public process(imageData: ImageData) {


        if (!this._hadProcessed) {
            return;
        }
        this._hadProcessed = false;
        //this.context_process.fillStyle = 'black';
        //this.context_process.fillRect(0, 0, this.pw, this.ph);
        // we can optimze this by moving to one image for all AR objects
        //this.context_process.drawImage(this.video, 0, 0, this.vw, this.vh, this.ox, this.oy, this.w, this.h);

        //var imageData: ImageData = this.context_process.getImageData(0, 0, this.pw, this.ph);
        this.worker.postMessage({ type: 'process', imagedata: imageData }, [imageData.data.buffer]);
    }


    public update(): void {

        let arComponent = this._entities[0].getComponent(ARControllerComponent) as ARControllerComponent;


        if (!this.world) {
            this._hasFound = false;
            this._frameDrops = 0;

            arComponent.foundPattern(false);
            this.root.setEnabled(false);
        } else {
            let worldMatrix: Matrix = Matrix.FromArray(this.getArrayMatrix(this.world));

            arComponent.foundPattern(true);
            // console.log("------------------------- Matrix found ----------------------------");
            // console.log(this.world);
            // console.log(this.getArrayMatrix(this.world));

            if (!this._hasFound) {
                this.root.setEnabled(true);
                for (var i = 0; i < 16; i++) {
                    this.trackedMatrix.interpolated[i] = this.world[i];
                }
                this._hasFound = true;
                this._lastTranslation = worldMatrix.getTranslation();
            }
            else {
                let _currentTranslation: Vector3 = worldMatrix.getTranslation();

                if (Math.abs(Vector3.Distance(_currentTranslation, this._lastTranslation)) > this._deltaAccuracy) {
                    // console.log(Math.abs(BABYLON.Vector3.Distance(_currentTranslation, this._lastTranslation)))
                    // console.log("frame drop");
                    this._frameDrops += 1;
                    if (this._frameDrops > 3) {
                        this._lastTranslation = _currentTranslation;
                    }
                    return;
                }
                this._frameDrops = 0;
                this._lastTranslation = _currentTranslation;
                for (var i = 0; i < 16; i++) {
                    this.trackedMatrix.delta[i] = this.world[i] - this.trackedMatrix.interpolated[i];
                    this.trackedMatrix.interpolated[i] = this.trackedMatrix.interpolated[i] + (this.trackedMatrix.delta[i] / this.interpolationFactor);
                }
            }
            // console.log(this.root.matrix);
            // this.root.matrixAutoUpdate = false;
            // console.log("matrix0", this.trackedMatrix.interpolated.toString());
            let matrix: Matrix = Matrix.FromArray(this.getArrayMatrix(this.trackedMatrix.interpolated));
            // console.log("matrix1", matrix.toArray().toString());
            // this.root.setPivotMatrix(matrix);
            // this.root.freezeWorldMatrix(matrix);
            // this.root.getWorldMatrix().invertToRef(matrix);

            let rotMatrix: Matrix = matrix.getRotationMatrix();
            let rotation: Quaternion = new Quaternion().fromRotationMatrix(rotMatrix);
            this.root.rotation = rotation.toEulerAngles();
            // this.root.rotationQuaternion = rotation.fromRotationMatrix(rotMatrix);

            let pos = Vector3.TransformCoordinates(new Vector3(0, 0, 0), matrix);

            // console.log("camera position: " + pos);

            this.root.setAbsolutePosition(pos);
        }
        this._entities.forEach(element => {
            element.update();
        });
    }

    public found(msg: any): void {
        if (!msg) {
            this.world = null;
        } else {
            this.world = JSON.parse(msg.matrixGL_RH);
        }
    }

    private getArrayMatrix(value: any): any {
        var array: any = [];
        for (var key in value) {
            array[key] = value[key]; //.toFixed(4);
        }
        return array;
    }

}