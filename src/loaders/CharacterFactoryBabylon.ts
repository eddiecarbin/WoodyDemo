import { Entity } from "app/framework/entity/Entity";
import { AnimationData, CharacterModelData } from "app/models/AppData";
import { ModelRendererComponent } from "app/models/components/ModelRendererComponent";
import { CharacterControllerComponent } from "app/models/components/CharacterControllerComponent";
import { CharacterEntity } from "app/models/CharacterEntity";
// import * as BABYLON from 'babylonjs';
// import 'babylonjs-loaders';
// import "@babylonjs/loaders";
import "@babylonjs/loaders/glTF/2.0";
// import { GLTFLoader} from "@babylonjs/loaders/glTF/2.0/glTFLoader"
import { URLHelper } from "app/utils/net/URLHelper";
import { ARControllerComponent } from "app/models/components/ARControllerComponent";
import { AnimationControllerComponent } from "app/models/components/AnimationControllerComponent";
import { StateMachineComponent } from "app/models/components/StateMachineComponent";
import { StateMachine } from "app/framework/StateMachine";
import { DoNothingState } from "app/models/states/DoNothingState";
import { SpawnState } from "app/models/states/SpawnState";
import { IdleState } from "app/models/states/IdleState";
import { DanceState } from "app/models/states/DanceState";
import { ExitState } from "app/models/states/ExitState";
import { AudioControllerComponent } from "app/models/components/AudioControllerComponent";
import { WaveState } from "app/models/states/WaveState";
import { PixarARContext } from "app/PixarARContext";
import { Scene3DRendererBabylon } from "app/views/Scene3DRendererBabylon";
import { Scene } from "@babylonjs/core/scene";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { AnimationPropertiesOverride } from "@babylonjs/core/Animations/animationPropertiesOverride";
import { SceneLoader } from "@babylonjs/core/Loading";
import { Skeleton } from "@babylonjs/core/Bones";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math";

export class CharacterFactoryBabylon {

    static createCharacterEntity(data: CharacterModelData, context: PixarARContext): Promise<Entity> {

        let sceneRenderer: Scene3DRendererBabylon = context.sceneRenderer;
        let scene: Scene = sceneRenderer.scene;
        let shadowGenerator: ShadowGenerator = sceneRenderer.shadowGenerator;
        let eventDispatcher: EventTarget = context.eventDispatcher;

        return new Promise<Entity>((resolve, reject) => {
            SceneLoader.ImportMesh("", URLHelper.instance().resolveURL(data.modelURL), data.file, scene, (newMeshes, particleSystems, skeletons) => {
                console.log("loading model: " + data.file);

                for (var index = 0; index < newMeshes.length; index++) {
                    // newMeshes[index].receiveShadows = false;;
                }

                let model: AbstractMesh = newMeshes[0];
                
                shadowGenerator.addShadowCaster(model);

                //let matrix : Matrix = model.getWorldMatrix();
                //let globalVector : Vector3 =Vector3.TransformCoordinates(boxes_position, matrix);


                let entity: CharacterEntity = new CharacterEntity();
                entity.addComponent(new ModelRendererComponent(model, data, scene));
                entity.addComponent(new CharacterControllerComponent(data));
                entity.addComponent(new ARControllerComponent(data));

                let stateMachineComponent: StateMachineComponent = entity.addComponent(new StateMachineComponent()) as StateMachineComponent;
                let stateMachine: StateMachine = stateMachineComponent.stateMachine;

                stateMachine.AddState(DoNothingState.NAME, new DoNothingState(stateMachineComponent, eventDispatcher));
                stateMachine.AddState(SpawnState.NAME, new SpawnState(stateMachineComponent));
                stateMachine.AddState(IdleState.NAME, new IdleState(stateMachineComponent, eventDispatcher));
                stateMachine.AddState(DanceState.NAME, new DanceState(stateMachineComponent));
                stateMachine.AddState(ExitState.NAME, new ExitState(stateMachineComponent));
                stateMachine.AddState(WaveState.NAME, new WaveState(stateMachineComponent));

                let skeleton: Skeleton = skeletons[0];

                model.skeleton = skeleton;

                let animationComponent: AnimationControllerComponent = entity.addComponent(new AnimationControllerComponent(scene, skeleton)) as AnimationControllerComponent;

                skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
                skeleton.animationPropertiesOverride.enableBlending = true;
                skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
                skeleton.animationPropertiesOverride.loopMode = 1;
                scene.stopAllAnimations();

                let audioComponent: AudioControllerComponent = entity.addComponent(new AudioControllerComponent()) as AudioControllerComponent;

                entity.initialize();
                stateMachine.GoToState(DoNothingState.NAME);

                resolve(entity);
                // Once the scene is loaded, just register a render loop to render it
            }, (progress) => {
                // To do: give progress feedback to user
            }, (scene, message) => {
                console.log(message);
            }, ".glb");
        });
    };

}
