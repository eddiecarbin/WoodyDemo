import { EntityComponent } from "app/framework/entity/EntityComponent";
import { AnimationData } from "../AppData";
import * as BABYLON from 'babylonjs';

export class AnimationControllerComponent extends EntityComponent {

    public static NAME = "AnimationControllerComponent"

    private _data: AnimationData;

    private _animationDataDictionary: any;

    private _skeleton: BABYLON.Skeleton;

    private _scene: BABYLON.Scene;

    constructor(scene: BABYLON.Scene, skeleton: BABYLON.Skeleton) {
        super(AnimationControllerComponent.NAME);
        this._skeleton = skeleton;
        this._scene = scene;
    }

    public addAnimation(aniData: AnimationData): void {

    }


    public onAdd(): void {

    }

    public playAnimationAsync(name: string, loop: boolean = false, speed: number = 1): Promise<boolean> {
        var group: BABYLON.AnimationGroup = this._scene.getAnimationGroupByName(name);
        return new Promise<boolean>((resolve, rejects)=>{
            group.start(loop, 1.0, group.from, group.to, false).onAnimationEndObservable.add((eventData, eventState)=>{
                resolve(true);
            })
        });
    }

    public playAnimationNumber(id: number, loop: boolean = false): BABYLON.AnimationGroup {



        const sambaAnim = this._scene.getAnimationGroupByName("stand");
        //Play the Samba animation  
       
        return;
        // let anim: BABYLON.Animatable = this._scene.beginAnimation(this._skeleton, 10, 900, true, 1);
        console.log(this._scene.animationGroups.length);
        return this._scene.animationGroups[id].play(loop);
        // this._scene.beginAnimation(this._skeleton, 0, 100, true, 1.0);
        // return null; //this._scene.animationGroups[id].play(loop);
    }

    public beginAnimation(): void {
        // scene.beginAnimation(this._skeleton, 0, 100, true, 0.8);
        this._scene.animationGroups[1].play(false);
        console.log("plainy animation")

        var standRange: BABYLON.AnimationGroup = this._scene.getAnimationGroupByName("stand");
        let anim: BABYLON.Animatable = this._scene.beginAnimation(this._skeleton, 10, 800, true, 0.8);

        anim.waitAsync()



        let group = this._scene.animationGroups[0];

        // console.log("this._scene.animationGroups.length: " + this._scene.animationGroups.length);
        // console.log("this._scene.animationGroups " + this._scene.animationGroups);
        this._scene.animationGroups[this._scene.animationGroups.length - 1].play(true);
        // console.log("stand animation: " + standRange);
        // standRange.start(true, 1.0, standRange.from, standRange.to, false);
        //let anim: BABYLON.Animatable = this._scene.beginAnimation(this._skeleton, 10, 800, true, 0.8);
        // anim.restart();
    }

    public stopAnimation(name:string): void {
        var group: BABYLON.AnimationGroup = this._scene.getAnimationGroupByName(name);
        group.stop();
        // group.reset();
    }

    public set enabled(value: boolean) {
        super.enabled = value;
        // this.root.setEnabled(value);
    }
}