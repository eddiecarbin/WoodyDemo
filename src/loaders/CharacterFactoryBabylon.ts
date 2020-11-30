import { Entity } from "app/framework/entity/Entity";
import { AnimationData, CharacterModelData } from "app/models/AppData";
import { ModelRendererComponent } from "app/models/components/ModelRendererComponent";
import { CharacterControllerComponent } from "app/models/components/CharacterControllerComponent";
import { CharacterEntity } from "app/models/CharacterEntity";
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

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

export class CharacterFactoryBabylon {

    static createCharacterEntity(data: CharacterModelData, context: PixarARContext): Promise<Entity> {

        let sceneRenderer: Scene3DRendererBabylon = context.sceneRenderer;
        let scene: BABYLON.Scene = sceneRenderer.scene;
        let shadowGenerator: BABYLON.ShadowGenerator = sceneRenderer.shadowGenerator;
        let eventDispatcher: EventTarget = context.eventDispatcher;
        
        return new Promise<Entity>((resolve, reject) => {
            BABYLON.SceneLoader.ImportMesh("", URLHelper.instance().resolveURL(data.modelURL), data.file, scene, (newMeshes, particleSystems, skeletons) => {
                console.log("loading model: " + data.file);

                for (var index = 0; index < newMeshes.length; index++) {
                    // newMeshes[index].receiveShadows = false;;
                }

                let model: BABYLON.AbstractMesh = newMeshes[0];
                // shadowGenerator.getShadowMap().renderList.push(newMeshes[0])
                shadowGenerator.addShadowCaster(model, true);
                //.getChildMeshes()[0];
                // model.setParent(null);
                let entity: CharacterEntity = new CharacterEntity();
                entity.addComponent(new ModelRendererComponent(model, data));
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

                let skeleton: BABYLON.Skeleton = skeletons[0];

                model.skeleton = skeleton;
                
                let animationComponent: AnimationControllerComponent = entity.addComponent(new AnimationControllerComponent(scene, skeleton)) as AnimationControllerComponent;

                skeleton.animationPropertiesOverride = new BABYLON.AnimationPropertiesOverride();
                skeleton.animationPropertiesOverride.enableBlending = true;
                skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
                skeleton.animationPropertiesOverride.loopMode = 1;
                scene.stopAllAnimations();
                
                let audioComponent: AudioControllerComponent = entity.addComponent(new AudioControllerComponent()) as AudioControllerComponent;
                
                
                if (data.animations.length > 5) {
                    
                    data.animations.forEach(async (aniData) => {
                        
                        // await CHARACTERFACTORYBABYLON.loadAnimation(aniData, scene);
                        // animationComponent.addAnimation(aniData);
                    });
                }
                
                entity.initialize();
                stateMachine.GoToState(DoNothingState.NAME);
                
                resolve(entity);
                // Once the scene is loaded, just register a render loop to render it
            }, (progress) => {
                // To do: give progress feedback to user
            }, (scene, message) => {
                console.log(message);
                debugger;
            });
        });
    };
    //https://www.babylonjs-playground.com/

    //https://www.babylonjs-playground.com/#BCU1XR#0
    //https://www.babylonjs-playground.com/#QY1WYT#72
    //https://www.babylonjs-playground.com/#UGD0Q0#2
    //https://doc.babylonjs.com/divingDeeper/importers/loadingFileTypes#sceneloaderimportanimations

    static loadAnimation(aniData: AnimationData, scene: BABYLON.Scene): Promise<AnimationData> {

        return new Promise<AnimationData>((resolve, reject) => {
            BABYLON.SceneLoader.ImportAnimations(aniData.modelURL, aniData.file, scene, false, BABYLON.SceneLoaderAnimationGroupLoadingMode.Clean, null, (scene) => {

                if (scene.animationGroups.length > 0) {
                    scene.animationGroups[scene.animationGroups.length - 1].play(true);
                }
                resolve(aniData);
            }, null, (scene, message) => {
                console.log("CharacterFactoryBabylon: Failed to load animation: " + aniData.file + ", " + message);
                reject("failed to load data: " + message);
            })
        });
    }
}
