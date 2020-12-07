import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Scene } from "@babylonjs/core/scene";
import { ShadowOnlyMaterial } from "@babylonjs/materials/shadowOnly";
import { ITicked } from "../framework/TimeManager";
import { PixarARContext } from "../PixarARContext";
import { AppJson, CharacterModelData } from "./AppData";
import { ARWorkerController } from "./ARWorkerController";
import "@babylonjs/core/Meshes/Builders/planeBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import "@babylonjs/core/Meshes/meshBuilder"
import "@babylonjs/core/Materials/standardMaterial";
export class ARWorkerGroup implements ITicked {

    private _controllers: Map<string, ARWorkerController> = new Map<string, ARWorkerController>();

    private _context: PixarARContext;

    private _data: CharacterModelData[];

    private context_process: CanvasRenderingContext2D;
    private canvas_process: HTMLCanvasElement;

    private video: HTMLVideoElement;

    private vw: number;
    private vh: number;

    private w: number;
    private h: number;

    private pw: number;
    private ph: number;

    private ox: number;
    private oy: number;

    private _groundPlane: Mesh;

    constructor(context: PixarARContext) {
        this._context = context;

    }

    public initialize(data: CharacterModelData[]): Promise<boolean> {
        this._data = data;

        this.video = this._context.cameraView.video;
        this.canvas_process = document.createElement('canvas');
        this.context_process = this.canvas_process.getContext('2d');

        let input_width = this.video.videoWidth;
        let input_height = this.video.videoHeight;

        this.vw = input_width;
        this.vh = input_height;

        var pscale = 320 / Math.max(this.vw, this.vh / 3 * 4);

        this.w = this.vw * pscale;
        this.h = this.vh * pscale;
        this.pw = Math.max(this.w, (this.h / 3) * 4);
        this.ph = Math.max(this.h, (this.w / 4) * 3);
        this.ox = (this.pw - this.w) / 2;
        this.oy = (this.ph - this.h) / 2;

        this.canvas_process.width = this.pw;
        this.canvas_process.height = this.ph;
        return new Promise<boolean>(async (resolve, reject) => {

            let _scene: Scene = this._context.sceneRenderer.scene;

            this._groundPlane = Mesh.CreatePlane('ground', 800, _scene);
            this._groundPlane.position.set(150, 150, -10);
            this._groundPlane.rotation.x = Math.PI;
            this._groundPlane.material = new ShadowOnlyMaterial('shadowOnly', _scene);
            // this._groundPlane.material = new StandardMaterial("standMat", _scene);
            this._groundPlane.receiveShadows = true;

            //https://www.taniarascia.com/promise-all-with-async-await/
            Promise.all(
                this._data.map(async (insect) => {

                    let controller: ARWorkerController = new ARWorkerController(this._context.sceneRenderer.camera, this.video.videoWidth, this.video.videoHeight);

                    await controller.initialize(insect, this._context);

                    this._groundPlane.parent = controller.getRoot();
                    this._controllers.set(insect.id, controller);
                })
            ).then(() => {
                _scene.stopAllAnimations();
                resolve(true);
            });
        });

    }

    public update(): void {
        this.context_process.fillStyle = 'black';
        this.context_process.fillRect(0, 0, this.pw, this.ph);
        // we can optimze this by moving to one image for all AR objects

        this.context_process.drawImage(this.video, 0, 0, this.vw, this.vh, this.ox, this.oy, this.w, this.h);

        var imageData: ImageData = this.context_process.getImageData(0, 0, this.pw, this.ph);

        this._controllers.forEach(element => {
            element.update();
            element.process(imageData);
        });
    }
}