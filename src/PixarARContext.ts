import { AppJson } from "./models/AppData";
import appdata from "./appdata.json";
import { WebCameraViewRenderer } from "./views/WebCamereViewRenderer";
import { ARGameManager } from "./models/ARGameManager";
import { TimeManager, wait } from "./framework/TimeManager";
import { ARWorkerGroup } from "./models/ARWorkerGroup";
import { Scene3DRendererBabylon } from "./views/Scene3DRendererBabylon";
import { URLHelper } from "./utils/net/URLHelper";
import { GUIViewMediator } from "./views/GUIViewMediator";
import { AudioManager } from "./framework/AudioManager";
import { Scene } from "@babylonjs/core/scene";


//D:\3lbs\projects\Insecta\playpen\kalwalt-interactivity-AR

export class PixarARContext {

    public appData: AppJson = appdata as AppJson;

    public eventDispatcher: EventTarget = new EventTarget();

    public cameraView: WebCameraViewRenderer;

    public sceneRenderer: Scene3DRendererBabylon;

    public gameManager: ARGameManager;

    public timeManager: TimeManager;

    public arWorkerGroup: ARWorkerGroup;

    public GUIViewMediator: GUIViewMediator;


    constructor(location: string) {
        URLHelper.initalize(location);
    }

    public async initialize(): Promise<boolean> {
        console.log("init insecta");
        this.GUIViewMediator = new GUIViewMediator(this.eventDispatcher, "https://sites.google.com/view/science-of-pixar/home");
        this.GUIViewMediator.initialize();

        // models
        this.gameManager = new ARGameManager();

        // views
        this.cameraView = new WebCameraViewRenderer();
        await this.cameraView.initialize();
        this.sceneRenderer = new Scene3DRendererBabylon();
        await this.sceneRenderer.initialize();

        await wait(2000);
        this.arWorkerGroup = new ARWorkerGroup(this);
        await this.arWorkerGroup.initialize(appdata.characters);

        this.timeManager = new TimeManager();
        this.timeManager.addTickedComponent(this.sceneRenderer);
        this.timeManager.addTickedComponent(this.arWorkerGroup);


        AudioManager.instance.initialize(appdata.sounds, this.sceneRenderer.scene);

        await wait(100);
        this.startGame();
        await wait(100);

        return Promise.resolve(true);
    }

    public getScene () : Scene{
        return this.sceneRenderer.scene;
    }

    public startGame(): void {
        console.log("start pixar ar");
        this.timeManager.initialize();
        this.GUIViewMediator.hideLoading();
    }

}
